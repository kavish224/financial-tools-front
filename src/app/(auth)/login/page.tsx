"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signInWithGoogle } from "@/lib/auth";
import { auth } from "@/lib/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({ email: false, google: false });
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      router.push("/"); // Redirect to the home page if already logged in
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error
    setLoading((prev) => ({ ...prev, email: true }));
  
    try {
      await signIn(email, password);
      router.push("/"); // Redirect to home page upon successful login
    } catch (err) {
      // Type 'unknown' instead of 'any'
      if (err instanceof Error) {
        // Check for a custom error name or Firebase-specific errors
        if (err.name === "EmailNotVerifiedError") {
          setError("Please verify your email address before logging in.");
        } else {
          console.log("Caught error message:", err.message); // Log the error message for debugging
          setError(err.message); // Set the error message from Firebase or custom error
        }
      } else {
        setError("An unknown error occurred."); // Fallback error message
      }
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };
  
  const handleGoogleLogin = async () => {
    setError("");
    setLoading((prev) => ({ ...prev, google: true }));
  
    try {
      await signInWithGoogle();
      alert("Logged in successfully!");
      router.push("/"); // Redirect to home page after Google login
    } catch (err) {
      // Type 'unknown' instead of 'any'
      if (err instanceof Error) {
        setError(err.message); // Show specific error message
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, google: false }));
    }
  };  

  return (
    <div className="login-container flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
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
            </div>
            <div className="flex flex-col pt-5 pb-5">
              <Button
                type="submit"
                className="w-full"
                disabled={loading.email || loading.google}
              >
                {loading.email ? "Logging in..." : "Login"}
              </Button>
              {error && (
                <p className="text-red-500 pt-2" aria-live="polite">
                  {error}
                </p>
              )}
            </div>
          </form>
          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full"
            variant="outline"
            disabled={loading.email || loading.google}
          >
            {loading.google ? "Logging in with Google..." : "Login with Google"}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            New to x?{" "}
            <a href="/signup" className="underline">
              Register
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
