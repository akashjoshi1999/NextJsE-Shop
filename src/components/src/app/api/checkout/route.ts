import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
    await connectToDatabase(); // make sure DB is connected

    try {
        const { product, userId } = await req.json(); // Include userId if available

        if (!product) {
            return NextResponse.json({ error: "Product data is required" }, { status: 400 });
        }

        const origin = req.headers.get("origin") || "http://localhost:3000";

        let productImage = "";
        if (product.image?.startsWith("http")) {
            productImage = product.image;
        } else {
            productImage = `${origin}${product.image.startsWith("/") ? "" : "/"}${product.image}`;
        }

        // 💳 Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: product.name,
                            ...(productImage && { images: [productImage] }),
                            description: product.description || "",
                        },
                        unit_amount: Math.round(product.price * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel`,
            metadata: {
                productId: product._id || "",
                productName: product.name,
            },
        });

        // 🧾 Save Order in DB (unpaid)
        const newOrder = new Order({
            userId: userId || null,
            product: product._id,
            productName: product.name,
            productImage,
            quantity: 1,
            amount: Math.round(product.price * 100),
            currency: "usd",
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
            paymentStatus: "unpaid",
        });

        await newOrder.save();

        // 💰 Optionally Save Payment separately
        const newPayment = new Payment({
            orderId: newOrder._id,
            userId: userId || null, // Ad
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
            amount: Math.round(product.price * 100),
            currency: "usd",
            status: "pending",
            method: "card",
        });

        await newPayment.save();

        return NextResponse.json({ url: session.url });

    } catch (error: unknown) {
        console.error("Stripe checkout error:", error);

        // Narrow down the type of error
        if (error instanceof Error) {
            return NextResponse.json(
                { error: "Error creating checkout session", details: error.message },
                { status: 500 }
            );
        }

        // Handle cases where error is not an instance of Error
        return NextResponse.json(
            { error: "Error creating checkout session", details: "Unknown error occurred" },
            { status: 500 }
        );
    }
}