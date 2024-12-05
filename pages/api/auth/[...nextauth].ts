import NextAuth, { Session, User, Account, Profile } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }): Promise<ExtendedSession> => {
      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
          },
        } as ExtendedSession;
      }
      return session as ExtendedSession;
    },
    signIn: async ({ 
      user, 
      account, 
      profile 
    }: { 
      user: User; 
      account: Account | null; 
      profile?: Profile 
    }) => {
      try {
        if (account?.provider === 'google') {
          const params = new URLSearchParams(account.state as string);
          const state = params.get('state');
          if (state) {
            const { referredBy } = JSON.parse(state);
            
            if (referredBy && user.id !== referredBy) {
              await prisma.user.update({
                where: { id: user.id },
                data: { referredById: referredBy }
              });
            }
          }
        }
      } catch (error) {
        console.error('Error processing referral:', error);
      }
      return true;
    }
  },
}

export default NextAuth(authOptions)