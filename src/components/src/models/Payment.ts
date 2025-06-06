import mongoose, { model, models, Schema } from "mongoose";

// models/Payment.ts
const paymentSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optional if guest checkouts allowed
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    amount: Number,
    currency: String,
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed'],
    },
    method: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Payment = models.Payment || model('Payment', paymentSchema);
export default Payment;