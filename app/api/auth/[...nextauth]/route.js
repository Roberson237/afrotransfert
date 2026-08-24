import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '../../../../lib/prisma';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000,
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 Tentative de connexion Google:', {
        email: user.email,
        name: user.name,
        provider: account.provider,
      });

      try {
        const existingUser = await prisma.utilisateur.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          console.log('👤 Création d\'un nouvel utilisateur Google');
          await prisma.utilisateur.create({
            data: {
              nom: profile.family_name || user.name.split(' ')[1] || 'Nom',
              prenom: profile.given_name || user.name.split(' ')[0] || 'Prénom',
              email: user.email,
              mot_de_passe: null,
            },
          });
          console.log('✅ Utilisateur Google créé avec succès');
        } else {
          console.log('👤 Utilisateur Google existant trouvé');
        }

        return true;
      } catch (error) {
        console.error('❌ Erreur lors de la création de l\'utilisateur Google:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token.sub) {
        const user = await prisma.utilisateur.findUnique({
          where: { email: session.user.email },
        });
        if (user) {
          session.user.id = user.id;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };