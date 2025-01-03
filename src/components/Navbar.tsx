"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { useAuth } from "./AuthProvider"
import LogoutButton from "./LogoutBtn" // Import the LogoutButton component

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user, loading } = useAuth(); // Get user and loading state from useAuth

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    if (loading) {
        return <div>Loading...</div>; // Show loading state while checking auth status
    }

    return (
        <nav className="p-4 shadow-lg text-l dark:bg-[#1c1d1f]">
            <div className="flex items-center justify-between flex-wrap">
                {/* Logo and Links */}
                <div className="flex items-center space-x-4">
                    <Link href={"/"} className="pr-10">Logo</Link>
                    <div className="hidden md:flex space-x-4">
                        <Link href={"/"} className="pr-4">Home</Link>
                        <Link href={"/markets"} className="pr-4">Markets</Link>
                        <Link href={"/analytics"} className="pr-4">Analytics</Link>
                        <Link href={"/tools"} className="pr-4">Tools</Link>
                        <Link href={"/aboutus"} className="pr-4">About Us</Link>
                        <Link href={"/support"} className="pr-4">Support</Link>
                    </div>
                </div>

                {/* Login/Logout Button (hidden on mobile) */}
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
            </div>

            {/* Mobile Menu */}
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
        </nav>
    )
};
