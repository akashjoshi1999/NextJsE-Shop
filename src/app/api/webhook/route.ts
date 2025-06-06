import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import Payment from '@/models/Payment';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const sig = req.headers.get('stripe-signature')!;
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Checkout Session completed:', session.id);

    try {
      const order = await Order.findOne({ stripeSessionId: session.id.trim() });

      if (order) {
        order.paymentStatus = 'paid';
        order.stripePaymentIntentId = session.payment_intent as string;
        await order.save();
        console.log('✅ Order updated');
      } else {
        console.warn('⚠️ No matching order found for session:', session.id);
      }

      const payment = await Payment.findOneAndUpdate(
        { stripeSessionId: session.id.trim() },
        { status: 'succeeded' },
        { new: true }
      );

      if (payment) {
        console.log('✅ Payment updated:', payment._id);
      } else {
        console.warn('⚠️ No matching payment found for session:', session.id);
      }
    } catch (error) {
      console.error('❌ Error updating order/payment:', error);
      return new Response('Server error', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
