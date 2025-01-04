"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";
import LogoutButton from "./LogoutBtn"; // Import the LogoutButton component
import { ModeToggle } from "./DarkModeBtn";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading } = useAuth(); // Get user and loading state from useAuth
    const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu container
    const buttonRef = useRef<HTMLButtonElement>(null); // Ref for the menu button

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    // Close menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                menuRef.current &&
                !menuRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setIsOpen(false); // Close the menu
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading state while checking auth status
    }

    return (
        <nav className="p-4 shadow-lg text-l dark:bg-[#1c1d1f]">
            <div className="flex items-center justify-between">
                {/* Links (hidden on mobile) */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link href={"/"} className="pr-8">Logo</Link>
                    <Link href={"/"}>Home</Link>
                    <Link href={"/markets"}>Markets</Link>
                    <Link href={"/analytics"}>Analytics</Link>
                    <Link href={"/tools"}>Tools</Link>
                    <Link href={"/aboutus"}>About Us</Link>
                    <Link href={"/support"}>Support</Link>
                </div>

                {/* Mode Toggle and Login/Logout */}
                <div className="hidden md:flex items-center space-x-4">
                    <ModeToggle />
                    {user ? (
                        <LogoutButton /> // Show Logout button if user is logged in
                    ) : (
                        <Button className="rounded-full px-5 py-2">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>

                {/* Hamburger Menu (for mobile) */}
                <div className="md:hidden flex items-center justify-between w-full">
                    <Link href={"/"} className="text-xl">
                        Logo
                    </Link>
                    <Button
                        ref={buttonRef}
                        className="rounded-full text-xl"
                        onClick={toggleMenu}
                        variant={"ghost"}
                    >
                        ☰
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                className={`md:hidden ${isOpen ? "block" : "hidden"} mt-4`}
            >
                <div className="flex flex-col items-center space-y-4">
                    <Link href={"/"}>Home</Link>
                    <Link href={"/markets"}>Markets</Link>
                    <Link href={"/analytics"}>Analytics</Link>
                    <Link href={"/tools"}>Tools</Link>
                    <Link href={"/aboutus"}>About Us</Link>
                    <Link href={"/support"}>Support</Link>
                    <ModeToggle />
                    {user ? (
                        <LogoutButton />
                    ) : (
                        <Button className="rounded-full px-5 py-2">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};
