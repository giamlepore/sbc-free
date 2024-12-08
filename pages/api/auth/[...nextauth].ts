import NextAuth, { Session, User, Account, Profile } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { AccessLevel } from '@prisma/client'

interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessLevel: AccessLevel;
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
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            referrals: true
          }
        });

        let accessLevel: AccessLevel = AccessLevel.LEAD;
        const referralCount = dbUser?.referrals.length || 0;

        if (referralCount >= 40) {
          accessLevel = AccessLevel.STUDENT;
        } else if (referralCount >= 5) {
          accessLevel = AccessLevel.LEAD_PLUS;
        }

        if (dbUser?.accessLevel === AccessLevel.ADMIN || 
            dbUser?.accessLevel === AccessLevel.STUDENT || 
            dbUser?.accessLevel === AccessLevel.LEAD_PLUS) {
          accessLevel = dbUser.accessLevel;
        }

        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            accessLevel: dbUser?.accessLevel || accessLevel
          }
        };
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
        if (!user.email) {
          console.error('User email is required');
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: user.id,
              email: user.email,
              name: user.name || '',
              accessLevel: AccessLevel.LEAD
            }
          });
        } else if (existingUser.id !== user.id) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { id: user.id }
          });
        }

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
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return true;
      }
    }
  }
}

export default NextAuth(authOptions)