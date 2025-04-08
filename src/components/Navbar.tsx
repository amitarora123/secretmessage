"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "@/models/User";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user;
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className=" container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystry Message
        </a>

        {session ? (
          <>
            <span className="mr-4">Welcome, {user.username || user.email}</span>
            <Button variant="secondary" className="w-full hover:cursor-pointer md:w-auto" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button variant="secondary" className="w-full hover:cursor-pointer md:w-auto">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
