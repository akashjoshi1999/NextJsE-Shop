// models/Order.ts
import mongoose, { Schema, model, models } from 'mongoose';

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // false if guest checkout allowed
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: String,
  productImage: String,
  quantity: {
    type: Number,
    default: 1,
  },
  amount: {
    type: Number,
    required: true, // in cents
  },
  currency: {
    type: String,
    default: 'usd',
  },
  stripeSessionId: String,
  stripePaymentIntentId: String,
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'failed'],
    default: 'unpaid',
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveryDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = models.Order || model('Order', orderSchema);
export default Order;
