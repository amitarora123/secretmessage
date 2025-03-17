"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-red-400 px-3 py-1 rounded-sm cursor-pointer hover:opacity-95 transition-opacity duration-200 mt-10 ml-10" onClick={() => signIn()}>Sign in</button>
    </>
  );
}
