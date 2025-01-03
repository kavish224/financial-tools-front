"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signUp, signInWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation"; // For redirection after signup

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(""); // New state to hold success message
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage(""); // Clear previous messages

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await signUp(email, password);
            setMessage(response.message); // Display message to verify email
            alert("Signup successful, please check your email to verify.");
            router.push("/login"); // Optionally, redirect to login page after successful signup
        } catch (err: unknown) {
            // Type 'unknown' instead of 'any'
            if (err instanceof Error) {
                setError(err.message || "Failed to sign up. Please try again.");
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithGoogle();
            console.log("Google signup successful:", result.user);
        } catch (err: unknown) {
            // Type 'unknown' instead of 'any'
            if (err instanceof Error) {
                setError("Failed to sign up with Google. Please try again.");
                console.error(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col pt-5 pb-5">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Signing up..." : "Signup"}
                            </Button>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            {message && <p style={{ color: "green" }}>{message}</p>}
                        </div>
                    </form>
                    <Button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full"
                        variant="outline"
                    >
                        Sign Up with Google
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p>
                        Already have an account?{" "}
                        <a href="/login" className="underline">
                            Login
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
