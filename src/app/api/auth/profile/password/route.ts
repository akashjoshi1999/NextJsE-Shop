// src/app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // const { old_password, new_password } = await request.json();

    await connectToDatabase();

    // Get auth header from request
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Invalid authorization header' }, { status: 401 });
    }

    // Decode JWT payload to get user id (consider verifying the token instead)
    const payloadJson = Buffer.from(token.split('.')[1], 'base64').toString();
    const { id } = JSON.parse(payloadJson);

    if (!id) {
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
    }

    // Fetch user from DB (only id, name, email fields)
    const user = await User.findById(id).select('id name email');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // TODO: Implement password verification with old_password and update with new_password if valid
    // (not shown here)

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in profile POST:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
