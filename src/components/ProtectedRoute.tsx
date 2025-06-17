"use client"

import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "@/lib/firebase"
interface ProtectedRouteProps {
    children: React.ReactNode;
}
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const pathname = usePathname();
    useEffect(() => {
        const auth = getAuth(app);
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unSubscribe();
    }, []);
    if (user === undefined) {
        return <div className="text-center py-10">Checking authentication...</div>;
    }
    if (!user) {
        const redirectUrl = encodeURIComponent(pathname);
        return (
            <div>
                <nav>
                    <Navbar />
                </nav>
                <div className="min-h-screen flex justify-center items-center">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Please Login to Continue</CardTitle>
                        </CardHeader>
                        <CardContent className="">
                            <p className="pb-6">You must be logged in to access this page.</p>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Link href={`/login?redirect=${redirectUrl}`}>
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return <>{children}</>;
}