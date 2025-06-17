"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, KeyRound, ArrowLeft, Mail } from "lucide-react";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setRedirecting(true);
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!emailTouched) {
      setEmailTouched(true);
    }
    if (statusMessage) {
      setStatusMessage("");
      setStatusType("");
    }
  };
  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setStatusMessage("Please enter your email address.");
      setStatusType("error");
      return;
    }
    if (!isEmailValid) {
      setStatusMessage("Please enter a valid email address.");
      setStatusType("error");
      return;
    }
    setStatusMessage("");
    setStatusType("");
    setLoading(true);
    try {
      const message = await resetPassword(email.trim());
      setStatusMessage(message);
      setStatusType("success");
      setEmail("");
      setEmailTouched(false);
    } catch (err) {
      console.error("Password reset error:", err);
      if (err instanceof Error) {
        let errorMessage = err.message;
        if (err.message.includes("user-not-found")) {
          errorMessage = "No account found with this email address.";
        } else if (err.message.includes("invalid-email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (err.message.includes("too-many-requests")) {
          errorMessage = "Too many requests. Please wait before trying again.";
        } else if (err.message.includes("network-request-failed")) {
          errorMessage = "Network error. Please check your connection and try again.";
        }
        setStatusMessage(errorMessage);
        setStatusType("error");
      } else {
        setStatusMessage("An unexpected error occurred. Please try again later.");
        setStatusType("error");
      }
    } finally {
      setLoading(false);
    }
  };
  if (redirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="">Redirecting...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="password-reset-container flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setEmailTouched(true)}
                  className={` ${emailTouched && email && !isEmailValid
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : ""
                    }`}
                  required
                  disabled={loading}
                  autoComplete="email"
                  aria-describedby="email-error"
                />
              </div>
              {emailTouched && email && !isEmailValid && (
                <p id="email-error" className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Please enter a valid email address
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !email.trim() || !isEmailValid}
            >
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          {statusMessage && (
            <div className={`w-full flex items-start gap-2 p-3 rounded-md ${statusType === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
              }`}>
              {statusType === "error" ? (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${statusType === "error" ? "text-red-700" : "text-green-700"
                }`}>
                {statusMessage}
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordReset;