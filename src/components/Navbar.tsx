"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";
import LogoutButton from "./LogoutBtn";
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
import { Separator } from "./ui/separator";
export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [hasMounted, setHasMounted] = useState(false);
    const toggleMenu = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);
    useEffect(() => {
        setHasMounted(true); // 👈 Set true on client mount
    }, []);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                menuRef.current &&
                !menuRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    if (!hasMounted) return null; 
    if (loading) {
        return <div>Loading...</div>;
    }

    const AvatarMenu = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer no-focus-outline no-select">
                    <AvatarImage
                        src={user?.photoURL||""}
                        alt="user avatar"
                        referrerPolicy="no-referrer"
                    />
                    <AvatarFallback>
                        {user?.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 rounded-lg border bg-[#ffffff] dark:bg-[#1c1d1f] shadow-lg p-2 text-sm"
            >
                <DropdownMenuLabel className="font-bold text-[#000000] dark:text-white">
                    Hi, {user?.displayName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 border-[#D9D9D9] dark:border-[#b3b3b3]" />
                <Link href={"/profile"}><DropdownMenuItem className="p-2 hover:bg-[#D9D9D9] dark:hover:bg-[#b3b3b3] rounded-md cursor-pointer text-[#000000] dark:text-white">
                    Profile
                </DropdownMenuItem></Link>
                <DropdownMenuLabel className="p-2">
                    <LogoutButton />
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <nav className="p-4 shadow-lg text-l dark:bg-[#1c1d1f] relative">
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
                        <Link href={"/"} className="text-xl">Logo</Link>
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

            {/* Overlay and Mobile Menu */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <div
                ref={menuRef}
                className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#1c1d1f] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col items-start space-y-4 p-4">
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
                    <Separator />
                    <Link href={"/"} className="text-lg" onClick={() => setIsOpen(false)}>
                        Home
                    </Link>
                    <Link href={"/markets"} className="text-lg" onClick={() => setIsOpen(false)}>
                        Markets
                    </Link>
                    <Link href={"/analytics"} className="text-lg" onClick={() => setIsOpen(false)}>
                        Analytics
                    </Link>
                    <Link href={"/tools"} className="text-lg" onClick={() => setIsOpen(false)}>
                        Tools
                    </Link>
                    <Link href={"/aboutus"} className="text-lg" onClick={() => setIsOpen(false)}>
                        About Us
                    </Link>
                    <Link href={"/support"} className="text-lg" onClick={() => setIsOpen(false)}>
                        Support
                    </Link>
                </div>
            </div>
        </nav>
    );
};
