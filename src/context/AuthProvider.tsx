"use client";
import { SessionProvider } from "next-auth/react";
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // your logic here
  return <SessionProvider>{children}</SessionProvider>;
}
