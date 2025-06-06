import { buffer } from 'micro';
import Stripe from 'stripe';
import stripe from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from 'next';
import Order from '@/models/Order';
import Payment from '@/models/Payment';
import { connectToDatabase } from '@/lib/mongodb';


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();
  
    if (req.method === 'POST') {
      const sig = req.headers['stripe-signature']!;
      const buf = await buffer(req);
      let event;
  
      try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
      } catch (err: unknown) {
        console.error('Webhook verification failed:', err);
        return res.status(400).send('Webhook Error');
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
          return res.status(500).send('Server error');
        }
      }
  
      res.json({ received: true });
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  }
  