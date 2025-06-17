"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef } from "react";
import { signUp, signInWithGoogle } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [gloading, setGLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });
    const [isClient, setIsClient] = useState(false);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/";
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsClient(true);
        if (auth.currentUser) {
            router.push("/");
        }
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [router]);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email.trim());
    };

    const validateName = (name: string) => {
        const errors = [];
        const trimmedName = name.trim();

        if (!trimmedName) {
            errors.push("Name is required");
        } else if (trimmedName.length < 2) {
            errors.push("Name must be at least 2 characters");
        } else if (trimmedName.length > 50) {
            errors.push("Name must be less than 50 characters");
        } else if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
            errors.push("Name can only contain letters, spaces, hyphens, and apostrophes");
        }

        return errors;
    };

    const checkPasswordRequirements = (password: string) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        setPasswordRequirements(requirements);
        return requirements;
    };

    const validatePassword = (password: string) => {
        const errors = [];
        const requirements = checkPasswordRequirements(password);

        if (!password) {
            errors.push("Password is required");
        } else {
            if (!requirements.length) errors.push("Password must be at least 8 characters");
            if (!requirements.uppercase) errors.push("Password must contain at least one uppercase letter");
            if (!requirements.lowercase) errors.push("Password must contain at least one lowercase letter");
            if (!requirements.number) errors.push("Password must contain at least one number");
            if (!requirements.special) errors.push("Password must contain at least one special character");
        }

        return errors;
    };

    const validateForm = () => {
        const errors: {
            name?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        const nameErrors = validateName(name);
        if (nameErrors.length > 0) {
            errors.name = nameErrors[0];
        }

        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!isValidEmail(email)) {
            errors.email = "Please enter a valid email address";
        }

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            errors.password = passwordErrors[0];
        }

        if (!confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFieldBlur = (fieldName: string) => {
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        setTouchedFields({
            name: true,
            email: true,
            password: true,
            confirmPassword: true
        });

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const response = await signUp(email.trim(), password, name.trim());
            setMessage(response.message || "Account created successfully! Please verify your email.");

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setPasswordRequirements({
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false
            });

            setTimeout(() => {
                router.push("/verify-email");
            }, 2000);

        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.message.includes("auth/email-already-in-use")) {
                    setError("An account with this email already exists. Please use a different email or try logging in.");
                } else if (err.message.includes("auth/weak-password")) {
                    setError("Password is too weak. Please choose a stronger password.");
                } else if (err.message.includes("auth/invalid-email")) {
                    setError("Please enter a valid email address.");
                } else {
                    setError(err.message || "Failed to create account. Please try again.");
                }
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError("");
        setMessage("");
        setGLoading(true);

        try {
            const result = await signInWithGoogle();
            if (!result.user) {
                throw new Error("Google sign-in failed. Please try again.");
            }
            setMessage("Account created successfully with Google!");

            setTimeout(() => {
                router.replace(redirectUrl);
            }, 1000);

        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.message.includes("popup-closed-by-user")) {
                    setError("Google sign-up was cancelled.");
                } else if (err.message.includes("popup-blocked")) {
                    setError("Pop-up blocked. Please allow pop-ups and try again.");
                } else if (err.message.includes("auth/account-exists-with-different-credential")) {
                    setError("An account with this email already exists. Please sign in instead.");
                } else {
                    setError("Google sign-up failed. Please try again.");
                }
            } else {
                setError("An unexpected error occurred with Google sign-up.");
            }
        } finally {
            setGLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
        <div className={`flex items-center gap-2 text-xs ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {met ? <CheckCircle className="h-3 w-3" /> : <X className="h-3 w-3" />}
            <span>{text}</span>
        </div>
    );

    if (!isClient) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-[325px]">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} noValidate>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">
                                    Full Name
                                </Label>
                                <Input
                                    ref={nameInputRef}
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (fieldErrors.name) {
                                            setFieldErrors(prev => ({ ...prev, name: undefined }));
                                        }
                                    }}
                                    onBlur={() => handleFieldBlur('name')}
                                    required
                                    autoComplete="name"
                                    aria-label="Full Name"
                                    aria-describedby={fieldErrors.name ? "name-error" : "name-helper"}
                                    aria-invalid={!!fieldErrors.name}
                                    className={fieldErrors.name ? "border-red-500 focus:border-red-500" : ""}
                                    disabled={loading || gloading}
                                />
                                <div id="name-helper" className="sr-only">
                                    Please enter your full name
                                </div>
                                {fieldErrors.name && touchedFields.name && (
                                    <div id="name-error" className="flex items-center gap-1 text-red-500 text-sm" role="alert">
                                        <AlertCircle className="h-4 w-4" />
                                        {fieldErrors.name}
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (fieldErrors.email) {
                                            setFieldErrors(prev => ({ ...prev, email: undefined }));
                                        }
                                    }}
                                    onBlur={() => handleFieldBlur('email')}
                                    required
                                    autoComplete="email"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    aria-label="Email Address"
                                    aria-describedby={fieldErrors.email ? "email-error" : "email-helper"}
                                    aria-invalid={!!fieldErrors.email}
                                    className={fieldErrors.email ? "border-red-500 focus:border-red-500" : ""}
                                    disabled={loading || gloading}
                                />
                                <div id="email-helper" className="sr-only">
                                    Please enter your email address
                                </div>
                                {fieldErrors.email && touchedFields.email && (
                                    <div id="email-error" className="flex items-center gap-1 text-red-500 text-sm" role="alert">
                                        <AlertCircle className="h-4 w-4" />
                                        {fieldErrors.email}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            checkPasswordRequirements(e.target.value);
                                            if (fieldErrors.password) {
                                                setFieldErrors(prev => ({ ...prev, password: undefined }));
                                            }
                                        }}
                                        onBlur={() => handleFieldBlur('password')}
                                        required
                                        autoComplete="new-password"
                                        aria-label="Password"
                                        aria-describedby="password-requirements"
                                        aria-invalid={!!fieldErrors.password}
                                        className={`pr-10 ${fieldErrors.password ? "border-red-500 focus:border-red-500" : ""}`}
                                        disabled={loading || gloading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        onKeyDown={(e) => handleKeyDown(e, () => setShowPassword(!showPassword))}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        tabIndex={0}
                                        disabled={loading || gloading}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {password && (
                                    <div id="password-requirements" className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md space-y-1">
                                        <p className="text-xs font-medium text-gray-800 dark:text-gray-300 mb-2">
                                            Password Requirements:
                                        </p>
                                        <PasswordRequirement met={passwordRequirements.length} text="At least 8 characters" />
                                        <PasswordRequirement met={passwordRequirements.uppercase} text="One uppercase letter" />
                                        <PasswordRequirement met={passwordRequirements.lowercase} text="One lowercase letter" />
                                        <PasswordRequirement met={passwordRequirements.number} text="One number" />
                                        <PasswordRequirement met={passwordRequirements.special} text="One special character" />
                                    </div>
                                )}

                                {fieldErrors.password && touchedFields.password && (
                                    <div className="flex items-center gap-1 text-red-500 text-sm" role="alert">
                                        <AlertCircle className="h-4 w-4" />
                                        {fieldErrors.password}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="confirm-password">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (fieldErrors.confirmPassword) {
                                                setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                                            }
                                        }}
                                        onBlur={() => handleFieldBlur('confirmPassword')}
                                        required
                                        autoComplete="new-password"
                                        aria-label="Confirm Password"
                                        aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : "confirm-password-helper"}
                                        aria-invalid={!!fieldErrors.confirmPassword}
                                        className={`pr-10 ${fieldErrors.confirmPassword ? "border-red-500 focus:border-red-500" : ""}`}
                                        disabled={loading || gloading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        onKeyDown={(e) => handleKeyDown(e, () => setShowConfirmPassword(!showConfirmPassword))}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                        tabIndex={0}
                                        disabled={loading || gloading}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <div id="confirm-password-helper" className="sr-only">
                                    Please re-enter your password to confirm
                                </div>
                                {fieldErrors.confirmPassword && touchedFields.confirmPassword && (
                                    <div id="confirm-password-error" className="flex items-center gap-1 text-red-500 text-sm" role="alert">
                                        <AlertCircle className="h-4 w-4" />
                                        {fieldErrors.confirmPassword}
                                    </div>
                                )}
                                {password && confirmPassword && password === confirmPassword && (
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                                        <CheckCircle className="h-4 w-4" />
                                        Passwords match
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col pt-5 pb-5">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || gloading}
                                aria-live="polite"
                                aria-describedby="signup-status"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>

                            {error && (
                                <div id="signup-status" className="flex items-center gap-1 text-red-500 text-sm pt-2" role="alert" aria-live="polite">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm pt-2" role="alert" aria-live="polite">
                                    <CheckCircle className="h-4 w-4" />
                                    {message}
                                </div>
                            )}
                        </div>
                    </form>

                    <Button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:hover:text-black rounded-md py-2 px-4 shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
                        variant="outline"
                        disabled={loading || gloading}
                        aria-live="polite"
                    >
                        <div className="flex items-center">
                            <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="w-5 h-5"
                                aria-hidden="true"
                            >
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            </svg>
                        </div>
                        <span>
                            {gloading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                    Creating account with Google...
                                </>
                            ) : (
                                "Continue with Google"
                            )}
                        </span>
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
                            className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;