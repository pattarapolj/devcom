import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { ActionResponse } from "@/global";

import { IAccountDoc } from "./app/database/account.model";
import { api } from "./lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [GitHub({
        clientId: process.env.AUTH_GITHUB_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }), Google({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                const { data: existingAccount, success } = 
                await api.accounts.getByProvider(account.type === 'credentials'
                    ? token.email!
                    : account.providerAccountId) as ActionResponse<IAccountDoc>;

                if (!success || !existingAccount) return token;

                const userId = existingAccount.userId;

                if (userId) token.sub = userId.toString();
            }

            return token;
        },
        async signIn({ user, profile, account }) {
            if(account?.type === "credentials") return true;
            if(!account || !user) return false;

            const userInfo = {
                name: user.name!,
                email: user.email!,
                image: user.image!,
                username: account.provider === 'github'
                    ? (profile?.login as string) 
                    : (user.name?.toLocaleLowerCase() as string)
            }

            const { success } = await api.auth.oAuthSignIn({
                user: userInfo,
                authProvider: account.provider as 'google' | 'github',
                authProviderId: account.providerAccountId }) as ActionResponse;
            if (!success) {
                return false;
            }
            return true;
        }
    }

})