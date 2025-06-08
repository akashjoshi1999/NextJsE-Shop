// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';
const secret = process.env.AUTH_SECRET!;

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    let userId: string | null = null;

    // ✅ Try to get session from NextAuth (OAuth)
    const token = await getToken({ req, secret }); // ✅ works in API routes, handles both OAuth & JWT

    if (token?.email) {
  const user = await User.findOne({ email: token.email }).select('_id');
  console.log('Token user:', token.email, 'DB user:', user);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      userId = user._id.toString();
    } else {
      // ✅ Fallback to JWT token from Authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);

      if (!decoded?.id) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

      userId = decoded.id;
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .select('-__v');
console.log('Fetched orders for user:', userId, 'Count:', orders.length);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
