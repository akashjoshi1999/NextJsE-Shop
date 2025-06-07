// src/app/api/auth/profile/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = decoded.id;

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

    const user = await User.findById(userId);
    console.log('Updating user:', user);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update fields
    user.name = `${firstName ?? user.firstName} ${lastName ?? user.lastName}`;
    user.first_name = firstName ?? user.firstName;
    user.last_name = lastName ?? user.lastName;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.bio = bio ?? user.bio;
    user.location = location ?? user.location;
    user.profileImage = profileImage ?? user.profileImage;

    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully' , user });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
