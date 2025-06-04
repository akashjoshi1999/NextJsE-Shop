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
      if (err instanceof Error) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle cases where `err` is not an instance of `Error`
      console.error('Webhook signature verification failed with an unknown error.', err);
      return res.status(400).send('Webhook Error: Unknown error occurred.');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const order = await Order.findOne({ stripeSessionId: session.id });

      if (order) {
        order.paymentStatus = 'paid';
        order.stripePaymentIntentId = session.payment_intent as string;
        await order.save();
      }

      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: 'succeeded' }
      );

      console.log(`✅ Payment succeeded for session: ${session.id}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
