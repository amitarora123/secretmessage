import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              {
                username: credentials.identifier,
              },
            ],
          });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          if (user.provider !== "credentials") {
            throw new Error(
              "You signed up using Google. Please continue with Google login."
            );
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // If user signs in
      if (user) {
        // Credentials login: user is already your DB user
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      // Google login: check if account.provider is 'google' and user is missing
      if (account?.provider === "google") {
        await dbConnect();

        const existingUser: User = (await UserModel.findOne({
          email: token.email,
        })) as User;

        if (existingUser) {
          token._id = existingUser._id.toString();
          token.isVerified = existingUser.isVerified;
          token.isAcceptingMessages = existingUser.isAcceptingMessage;
          token.username = existingUser.username;
        } else {
          // If user doesn't exist, create a new one (optional)
          const newUser = await UserModel.create({
            email: token.email,
            isVerified: true, // since Google verifies emails
            isAcceptingMessages: true,
            username: token.email?.split("@")[0], // default username
            provider: "google",
          });

          token._id = newUser._id.toString();
          token.isVerified = newUser.isVerified;
          token.isAcceptingMessages = newUser.isAcceptingMessage;
          token.username = newUser.username;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
};
