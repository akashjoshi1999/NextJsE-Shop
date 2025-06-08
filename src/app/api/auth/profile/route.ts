import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Token missing from authorization header' }, { status: 401 });
    }

    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const { id } = decoded;

    const user = await User.findById(id).select('id name email first_name last_name profileImage bio location phone');
    console.log('Fetched user profile:', user);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
