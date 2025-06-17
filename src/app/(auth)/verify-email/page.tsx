"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const VerifyEmail: React.FC = () => {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.emailVerified) {
                router.push("/");
            } else {
                setCheckingAuth(false);
            }
        });
        return () => unsubscribe();
    }, [router]);
    const handleGoToLogin = () => {
        router.push("/login");
    };
    if (checkingAuth) return null;
    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center h-screen">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Email Verification Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">
                            A verification email has been sent to your registered email
                            address. Please check your inbox (or spam folder) and verify your
                            email before logging in.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={handleGoToLogin} className="w-full">
                            Go to Login
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default VerifyEmail;
