import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { upsertUser } from "@/utils/userHelpers"
import type { User, Account, Profile } from "next-auth"

// Optional: JWT utilities (if you use your own token auth too)
import { createToken, createRefreshToken } from "@/lib/auth"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: '/login', // custom login page
  },

  callbacks: {
    async signIn({ user, account, profile }: {
      user: User
      account: Account | null
      profile?: Profile
    }) {
      try {
        // ✅ Create or update user in DB
        const dbUser = await upsertUser({
          email: user.email || '',
          name: user.name || '',
          image: user.image || '',
        })

        console.log("User upserted:", dbUser)

        // ✅ Store DB _id on the user object
        user.id = dbUser._id.toString()

        return true
      } catch (error) {
        console.error("OAuth signIn error:", error)
        return false
      }
    },

    async jwt({ token, user, account }) {
  // On first sign-in
  if (account) {
    token.accessToken = account.access_token;
    token.refreshToken = account.refresh_token;
  }

  // Always keep user info
  if (user) {
    token.id = user.id || (user as any)._id;
    token.email = user.email;
    token.name = user.name;
    token.picture = user.image;
  }

  return token;
},


   async session({ session, token }) {
  if (session.user && token) {
    session.user.id = token.id as string;
    session.user.email = token.email as string;
    session.user.name = token.name as string;
    session.user.image = token.picture as string;

    // ⬇️ Pass tokens to client
    (session as any).accessToken = token.accessToken;
    (session as any).refreshToken = token.refreshToken;
  }
  return session;
}

  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
