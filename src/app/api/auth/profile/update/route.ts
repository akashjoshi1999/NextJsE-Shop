// src/app/api/auth/profile/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';
import { jwtVerify } from 'jose';
import User from '@/models/User';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    let userEmail: string | null = null;
    let userId: string | null = null;

    // ✅ Try getting NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userEmail = session.user.email;
    } else {
      // ✅ Fallback: check Authorization header
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        userId = payload.id as string;
      } catch (err) {
        console.error('JWT verification failed:', err);
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      location,
      profileImage,
    } = body;

    // ✅ Find user by ID or email depending on login type
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // ✅ Update fields
    user.name = `${firstName ?? user.first_name} ${lastName ?? user.last_name}`;
    user.first_name = firstName ?? user.first_name;
    user.last_name = lastName ?? user.last_name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.bio = bio ?? user.bio;
    user.location = location ?? user.location;
    user.profileImage = profileImage ?? user.profileImage;

    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
