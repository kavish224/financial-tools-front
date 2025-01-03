"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";
import LogoutButton from "./LogoutBtn"; // Import the LogoutButton component
import { usePathname } from "next/navigation"; // Import usePathname

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth(); // Get user and loading state from useAuth
  const pathname = usePathname(); // Get the current path

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if the current page is login or signup
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth status
  }

  return (
    <nav className="p-4 shadow-lg text-l dark:bg-[#1c1d1f]">
      <div className="flex items-center justify-between flex-wrap">
        {/* Logo */}
        <div>
          <Link href={"/"}>Logo</Link>
        </div>

        {!isAuthPage ? (
          <>
            {/* Links (hidden on mobile) */}
            <div className="hidden md:flex space-x-4">
              <Link href={"/"}>Home</Link>
              <Link href={"/markets"}>Markets</Link>
              <Link href={"/analytics"}>Analytics</Link>
              <Link href={"/tools"}>Tools</Link>
              <Link href={"/aboutus"}>About Us</Link>
              <Link href={"/support"}>Support</Link>
            </div>

            {/* Login/Logout Button */}
            <div className="hidden md:block">
              {user ? (
                <LogoutButton /> // Show Logout button if user is logged in
              ) : (
                <Button className="rounded-full p-5">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>

            {/* Hamburger Menu (for mobile) */}
            <div className="md:hidden flex items-center">
              <Button className="rounded-full p-3" onClick={toggleMenu}>
                ☰
              </Button>
            </div>
          </>
        ) : (
          // Minimal Navbar for Auth Pages
          <div className="hidden md:block">
            <Link href="/" className="underline">
              Back to Home
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {!isAuthPage && (
        <div className={`md:hidden ${isOpen ? "block" : "hidden"} mt-4`}>
          <div className="flex flex-col items-center space-y-4">
            <Link href={"/"}>Home</Link>
            <Link href={"/markets"}>Markets</Link>
            <Link href={"/analytics"}>Analytics</Link>
            <Link href={"/tools"}>Tools</Link>
            <Link href={"/aboutus"}>About Us</Link>
            <Link href={"/support"}>Support</Link>
            {user ? (
              <LogoutButton /> // Show Logout button if user is logged in
            ) : (
              <Button className="rounded-full p-3 mt-4">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
