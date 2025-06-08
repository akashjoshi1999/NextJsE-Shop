import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type {
    NextAuthOptions,
    Session,
    User,
    Account,
    Profile
} from "next-auth";
import { upsertUser } from "@/utils/userHelpers";
import type { JWT } from "next-auth/jwt";
interface ExtendedSession extends Session {
    accessToken?: string;
    refreshToken?: string;
}

interface ExtendedToken extends JWT {
    id?: string;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
    accessToken?: string;
    refreshToken?: string;
}

interface ExtendedUser extends User {
    _id?: string;
    image?: string | null;
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile",
                },
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],

    secret: process.env.AUTH_SECRET,

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async signIn({
            user,
            account,
            profile,
        }: {
            user: User;
            account: Account | null;
            profile?: Profile;
        }) {
            console.log("signIn callback:", { user, account, profile });
            try {
                const dbUser = await upsertUser({
                    email: user.email || "",
                    name: user.name || "",
                    image: (user as ExtendedUser).image || "",
                });

                (user as ExtendedUser).id = dbUser._id.toString();
                return true;
            } catch (error) {
                console.error("OAuth signIn error:", error);
                return false;
            }
        },

        async jwt({
            token,
            user,
            account,
        }: {
            token: JWT;
            user: User | undefined;
            account: Account | null;
        }): Promise<JWT> {
            const updatedToken = token as ExtendedToken;

            if (account) {
                updatedToken.accessToken = account.access_token;
                updatedToken.refreshToken = account.refresh_token;
            }

            if (user) {
                const u = user as ExtendedUser;
                updatedToken.id = u.id || u._id;
                updatedToken.email = u.email ?? null;
                updatedToken.name = u.name ?? null;
                updatedToken.picture = u.image ?? null;
            }

            return updatedToken as JWT;
        },

        async session({ session, token }) {
            const extendedSession = session as ExtendedSession;
            const extendedToken = token as ExtendedToken;

            if (extendedSession.user) {
                const user = extendedSession.user as typeof session.user & {
                    id?: string;
                };
                user.id = extendedToken.id ?? "";
                user.email = extendedToken.email ?? null;
                user.name = extendedToken.name ?? null;
                user.image = extendedToken.picture ?? null;

                extendedSession.accessToken = extendedToken.accessToken;
                extendedSession.refreshToken = extendedToken.refreshToken;
            }

            return extendedSession;
        },
    },
};
