// src/app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {

    const { old_password, new_password } = await request.json();

    await connectToDatabase();

    // Assuming middleware passed a valid token, re-verify if needed
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1]!;
    const { id } = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()); // Or use verifyToken again

    const user = await User.findById(id).select('id name email');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
