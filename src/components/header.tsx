"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const Header: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      return !!userString;
    }
    return false;
  });

  const handleLogOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      router.push("/");
      toast.success("Logged out successfully.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      setIsLoggedIn(!!userString);
    }
  }, [searchParams]);

  return (
    <header className="bg-cyan-950">
      <div className="container flex justify-between items-center text-slate-300 py-5">
        <div>
          <h1>ShortME</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <span onClick={handleLogOut} className="cursor-pointer">
                    Log out
                  </span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/signup">Sign up</Link>
                </li>
                <li>
                  <Link href="/signin">Log in</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
