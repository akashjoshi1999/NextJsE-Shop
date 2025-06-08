import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

interface ExtendedSession extends Session {
  accessToken?: string;
  refreshToken?: string;
}

export async function upsertUser(profile: { email: string; name?: string; image?: string }) {
  await connectToDatabase()
  const { email, name, image } = profile

  if (!email) throw new Error('Email is required')

  let user = await User.findOne({ email })

  if (user) {
    user.name = name ?? user.name
    user.image = image ?? user.image
    await user.save()
  } else {
    user = new User({
      email,
      name,
      image,
      isOAuth: true,
    })
    await user.save()
  }

  return user
}

export function useAuthToken() {
  const { data: session } = useSession();
  const extendedSession = session as ExtendedSession | null;

  if (extendedSession?.accessToken) {
    return extendedSession.accessToken;
  }

  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }

  return null;
}
