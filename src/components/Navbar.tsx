"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";
import LogoutButton from "./LogoutBtn"; // Import the LogoutButton component
import { ModeToggle } from "./DarkModeBtn";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading } = useAuth(); // Get user and loading state from useAuth
    const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu container
    const buttonRef = useRef<HTMLButtonElement>(null); // Ref for the menu button
    const pp = user?.photoURL
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
    const AvatarMenu = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer no-focus-outline no-select">
                    <AvatarImage
                        src={user?.photoURL || "https://github.com/k.png"}
                        alt="user avatar"
                    />
                    <AvatarFallback>
                        {user?.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 rounded-lg border bg-[#ffffff] dark:bg-[#1c1d1f] shadow-lg p-2 text-sm"
            >
                <DropdownMenuLabel className="font-bold text-[#000000] dark:text-[#D9D9D9]">
                    Hi, {user?.displayName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 border-[#D9D9D9] dark:border-[#b3b3b3]" />
                <DropdownMenuItem
                    className="p-2 hover:bg-[#D9D9D9] dark:hover:bg-[#b3b3b3] rounded-md cursor-pointer text-[#000000] dark:text-[#D9D9D9]"
                >
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="p-2 hover:bg-[#D9D9D9] dark:hover:bg-[#b3b3b3] rounded-md cursor-pointer text-[#000000] dark:text-[#D9D9D9]"
                >
                    Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="p-2 hover:bg-[#D9D9D9] dark:hover:bg-[#b3b3b3] rounded-md cursor-pointer text-[#000000] dark:text-[#D9D9D9]"
                >
                    Team
                </DropdownMenuItem>
                <DropdownMenuLabel className="p-2"> <LogoutButton /></DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );
    return (
        <nav className="p-4 shadow-lg text-l dark:bg-[#1c1d1f]">
            <div className="flex items-center justify-between">
                {/* Links (hidden on mobile) */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link href={"/"} className="pr-8">Logo</Link>
                    <Link href={"/"}>Home</Link>
                    {/* <Link href={"/markets"}>Markets</Link> */}
                    <Link href={"/analytics"}>Analytics</Link>
                    <Link href={"/tools"}>Tools</Link>
                    <Link href={"/aboutus"}>About Us</Link>
                    <Link href={"/support"}>Support</Link>
                </div>

                {/* Mode Toggle and Login/Logout */}
                <div className="hidden md:flex items-center space-x-4">
                    <ModeToggle />
                    {user ? <AvatarMenu /> : (
                        <Button className="rounded-full px-5 py-2">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>

                {/* Hamburger Menu (for mobile) */}
                <div className="md:hidden flex items-center justify-between w-full">
                    <div className="flex items-center justify-center">
                        <Button
                            ref={buttonRef}
                            className="rounded-full text-xl"
                            onClick={toggleMenu}
                            variant={"ghost"}
                        >
                            ☰
                        </Button>
                        <Link href={"/"} className="text-xl">
                            Logo
                        </Link>
                    </div>
                    <div className="flex space-x-4 items-center">
                        <ModeToggle />
                        {user ? <AvatarMenu /> : (
                            <Button className="rounded-full px-5 py-2">
                                <Link href="/login">Login</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                className={`md:hidden ${isOpen ? "block" : "hidden"} mt-4`}
            >
                <div className="flex flex-col items-center space-y-4">
                    <Link href={"/"}>Home</Link>
                    {/* <Link href={"/markets"}>Markets</Link> */}
                    <Link href={"/analytics"}>Analytics</Link>
                    <Link href={"/tools"}>Tools</Link>
                    <Link href={"/aboutus"}>About Us</Link>
                    <Link href={"/support"}>Support</Link>
                </div>
            </div>
        </nav>
    );
};
