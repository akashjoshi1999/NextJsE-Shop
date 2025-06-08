import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { useSession } from 'next-auth/react';

export async function upsertUser(profile: { email: string; name?: string; image?: string }) {
  await connectToDatabase()
  const { email, name, image } = profile

  if (!email) throw new Error('Email is required')

  // Find user by email
  let user = await User.findOne({ email })

  if (user) {
    // Optionally update user data here if you want (e.g. name, image)
    user.name = name ?? user.name
    user.image = image ?? user.image
    await user.save()
  } else {
    // Create new user
    user = new User({
      email,
      name,
      image,
      isOAuth: true, // Assuming you want to mark them as authenticated
      // You might want to mark them as OAuth user (no password)
    })
    await user.save()
  }

  return user
}

export function useAuthToken() {
  const { data: session } = useSession();

  if (session?.accessToken) {
    return session.accessToken;
  }
  
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  
  return null;
}
