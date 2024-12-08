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
        if (!user.email || !account) {
          console.error('User email and account are required');
          return false;
        }

        console.log('SignIn attempt:', { user, account });
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        // Caso 1: Novo usuário ou usuário excluído
        if (!existingUser) {
          // Criamos o usuário e a conta em uma única transação
          await prisma.$transaction(async (tx) => {
            await tx.user.create({
              data: {
                id: user.id,
                email: user.email,
                name: user.name || '',
                accessLevel: AccessLevel.LEAD,
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state
                  }
                }
              }
            });
          });
        } 
        // Caso 2: Usuário existe (mesmo ID ou ID diferente)
        else {
          // Verifica se precisa atualizar o ID
          if (existingUser.id !== user.id) {
            console.log('Updating user ID:', {
              oldId: existingUser.id,
              newId: user.id
            });
            
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { id: user.id }
            });
          }

          // Sempre verifica e atualiza a conta Google
          if (account) {
            const existingAccount = await prisma.account.findFirst({
              where: {
                provider: account.provider,
                providerAccountId: account.providerAccountId
              }
            });

            if (existingAccount) {
              // Atualiza a conta existente
              await prisma.account.update({
                where: { id: existingAccount.id },
                data: { 
                  userId: user.id,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  id_token: account.id_token,
                  scope: account.scope,
                  token_type: account.token_type
                }
              });
            } else {
              // Cria uma nova conta
              await prisma.account.create({
                data: {
                  userId: user.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state
                }
              });
            }
          }
        }

        // Processa referral se existir
        if (account?.provider === 'google') {
          const referralCode = account.state ? 
            new URLSearchParams(account.state as string).get('referralCode') : null;
          
          if (referralCode && user.id !== referralCode) {
            await prisma.user.update({
              where: { id: user.id },
              data: { referredById: referralCode }
            });
          }
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    }
  }
}

export default NextAuth(authOptions)