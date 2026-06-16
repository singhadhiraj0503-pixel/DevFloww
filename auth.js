import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // providers: [
  //   GitHub({
  //     clientId: process.env.AUTH_GITHUB_ID,
  //     clientSecret: process.env.AUTH_GITHUB_SECRET,
  //   }),
  //   Google({
  //     clientId: process.env.AUTH_GOOGLE_ID,
  //     clientSecret: process.env.AUTH_GOOGLE_SECRET,
  //   }),
  // ],
  providers: [GitHub, Google],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },

    async jwt({ account, token }) {
      if (account) {
        const { data: existingAccount, success } =
          await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email
              : account.providerAccountId,
          );
        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;
        if (userId) token.sub = userId.toString();
      }
      return token;
    },

    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name,
        email: user.email,
        image: user.image,
        username:
          account.provider === "github"
            ? profile?.login
            : user?.name?.toLowerCase(),
      };

      const { success } = await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });

      if (!success) return false;

      return true;
    },
  },
});
