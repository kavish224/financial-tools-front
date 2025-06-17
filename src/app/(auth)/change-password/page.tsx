"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { changePassword } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff,  
  ArrowLeft,
  Check,
  X
} from "lucide-react";

interface PasswordStrength {
  score: number;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
        score: 0,
        checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false,
        }
    });
    const [fieldsValidated, setFieldsValidated] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const router = useRouter();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login");
            } else if (!user.emailVerified) {
                router.push("/verify-email");
            } else {
                setAuthLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);
    useEffect(() => {
        const checks = {
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            lowercase: /[a-z]/.test(newPassword),
            number: /\d/.test(newPassword),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
        };
        const score = Object.values(checks).filter(Boolean).length;
        setPasswordStrength({ score, checks });
    }, [newPassword]);
    const getPasswordStrengthColor = (score: number) => {
        if (score <= 2) return "bg-red-500";
        if (score <= 3) return "bg-yellow-500";
        if (score <= 4) return "bg-blue-500";
        return "bg-green-500";
    };
    const getPasswordStrengthText = (score: number) => {
        if (score <= 2) return "Weak";
        if (score <= 3) return "Fair";
        if (score <= 4) return "Good";
        return "Strong";
    };
    const validateForm = () => {
        setError("");
        if (!currentPassword.trim()) {
            setError("Current password is required.");
            return false;
        }
        if (!newPassword.trim()) {
            setError("New password is required.");
            return false;
        }
        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return false;
        }
        if (passwordStrength.score < 3) {
            setError("Please choose a stronger password.");
            return false;
        }
        if (!confirmPassword.trim()) {
            setError("Please confirm your new password.");
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation password do not match.");
            return false;
        }
        if (currentPassword === newPassword) {
            setError("New password must be different from current password.");
            return false;
        }
        return true;
    };
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            setSuccess("Password changed successfully! You can now use your new password.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setFieldsValidated({
                currentPassword: false,
                newPassword: false,
                confirmPassword: false,
            });
            setTimeout(() => {
                router.push("/");
            }, 5000);
        } catch (err) {
            console.error("Change password error:", err);
            if (err instanceof Error) {
                let errorMessage = err.message;
                if (err.message.includes("wrong-password")) {
                    errorMessage = "Current password is incorrect.";
                } else if (err.message.includes("requires-recent-login")) {
                    errorMessage = "For security reasons, please log out and log back in before changing your password.";
                } else if (err.message.includes("weak-password")) {
                    errorMessage = "New password is too weak. Please choose a stronger password.";
                } else if (err.message.includes("network-request-failed")) {
                    errorMessage = "Network error. Please check your connection and try again.";
                }
                setError(errorMessage);
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };
    const handleFieldBlur = (field: keyof typeof fieldsValidated) => {
        setFieldsValidated(prev => ({ ...prev, [field]: true }));
    };
    if (authLoading) {
        return (
            <div >
                <Navbar />
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex flex-col justify-center items-center min-h-screen px-4 py-8">
                <Card className="w-[350px] max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Change Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <div className="relative">
                                    <Input
                                        id="current-password"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        onBlur={() => handleFieldBlur('currentPassword')}
                                        className="pr-10"
                                        required
                                        disabled={loading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        disabled={loading}
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        onBlur={() => handleFieldBlur('newPassword')}
                                        className="pr-10"
                                        required
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        disabled={loading}
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {newPassword && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600">Password strength:</span>
                                            <span className={`text-xs font-medium ${
                                                passwordStrength.score <= 2 ? 'text-red-600' :
                                                passwordStrength.score <= 3 ? 'text-yellow-600' :
                                                passwordStrength.score <= 4 ? 'text-blue-600' : 'text-green-600'
                                            }`}>
                                                {getPasswordStrengthText(passwordStrength.score)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 text-xs">
                                            <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                                                {passwordStrength.checks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                8+ characters
                                            </div>
                                            <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                                {passwordStrength.checks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                Uppercase
                                            </div>
                                            <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                                                {passwordStrength.checks.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                Lowercase
                                            </div>
                                            <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
                                                {passwordStrength.checks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                Number
                                            </div>
                                            <div className={`flex items-center gap-1 ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-400'}`}>
                                                {passwordStrength.checks.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                Special char
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onBlur={() => handleFieldBlur('confirmPassword')}
                                        className={`pr-10 ${
                                            fieldsValidated.confirmPassword && confirmPassword && newPassword && confirmPassword !== newPassword
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                : ""
                                        }`}
                                        required
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {fieldsValidated.confirmPassword && confirmPassword && newPassword && confirmPassword !== newPassword && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Passwords do not match
                                    </p>
                                )}
                            </div>
                            {error && (
                                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}
                            {success && (
                                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-green-700">
                                        <p>{success}</p>
                                        <p className="mt-1 text-xs">Redirecting to home page in a few seconds...</p>
                                    </div>
                                </div>
                            )}
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={loading || !currentPassword || !newPassword || !confirmPassword || passwordStrength.score < 3 || newPassword !== confirmPassword}
                            >
                                {loading ? "Changing Password..." : "Change Password"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link href="/" className="flex items-center gap-2 text-sm">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </CardFooter>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default ChangePassword;