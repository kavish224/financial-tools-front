"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signInWithGoogle } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gloading, setGLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{email?: string; password?: string}>({});
  const [isClient, setIsClient] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const MAX_ATTEMPTS = 5;
  const BLOCK_DURATION = 5 * 60 * 1000;

  useEffect(() => {
    setIsClient(true);
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
    const storedAttempts = localStorage.getItem('login_attempts');
    const storedBlockTime = localStorage.getItem('login_block_time');
    
    if (storedAttempts) {
      setAttemptCount(parseInt(storedAttempts));
    }
    
    if (storedBlockTime) {
      const blockTime = parseInt(storedBlockTime);
      const now = Date.now();
      if (now < blockTime) {
        setIsBlocked(true);
        setBlockTimeRemaining(Math.ceil((blockTime - now) / 1000));
        
        const timer = setInterval(() => {
          const remaining = Math.ceil((blockTime - Date.now()) / 1000);
          if (remaining <= 0) {
            setIsBlocked(false);
            setAttemptCount(0);
            localStorage.removeItem('login_attempts');
            localStorage.removeItem('login_block_time');
            clearInterval(timer);
          } else {
            setBlockTimeRemaining(remaining);
          }
        }, 1000);
        
        return () => clearInterval(timer);
      } else {
        setAttemptCount(0);
        localStorage.removeItem('login_attempts');
        localStorage.removeItem('login_block_time');
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace(redirect);
      }
    });

    return () => unsubscribe();
  }, [router, redirect]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    return errors;
  };

  const validateForm = () => {
    const errors: {email?: string; password?: string} = {};
    
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else {
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors[0];
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRateLimit = () => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    localStorage.setItem('login_attempts', newAttemptCount.toString());
    
    if (newAttemptCount >= MAX_ATTEMPTS) {
      const blockUntil = Date.now() + BLOCK_DURATION;
      localStorage.setItem('login_block_time', blockUntil.toString());
      setIsBlocked(true);
      setBlockTimeRemaining(Math.ceil(BLOCK_DURATION / 1000));
      
      const timer = setInterval(() => {
        const remaining = Math.ceil((blockUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setIsBlocked(false);
          setAttemptCount(0);
          localStorage.removeItem('login_attempts');
          localStorage.removeItem('login_block_time');
          clearInterval(timer);
        } else {
          setBlockTimeRemaining(remaining);
        }
      }, 1000);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError(`Too many failed attempts. Please wait ${Math.ceil(blockTimeRemaining / 60)} minutes before trying again.`);
      return;
    }
    
    setError("");
    setFieldErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      await signIn(email.trim(), password);
      setAttemptCount(0);
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('login_block_time');
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsubscribe();
          router.replace(redirect);
        }
      });
    } catch (err) {
      handleRateLimit();
      
      if (err instanceof Error) {
        if (err.name === "EmailNotVerifiedError") {
          setError("Please verify your email address before logging in.");
        } else if (err.message.includes("auth/user-not-found")) {
          setError("No account found with this email address.");
        } else if (err.message.includes("auth/wrong-password")) {
          setError("Incorrect password. Please try again.");
        } else if (err.message.includes("auth/too-many-requests")) {
          setError("Too many failed login attempts. Please try again later.");
        } else if (err.message.includes("auth/user-disabled")) {
          setError("This account has been disabled. Please contact support.");
        } else {
          setError("Login failed. Please check your credentials and try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      
      if (err instanceof Error && err.message.includes("email")) {
        emailInputRef.current?.focus();
      } else {
        passwordInputRef.current?.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isBlocked) {
      setError(`Too many failed attempts. Please wait ${Math.ceil(blockTimeRemaining / 60)} minutes before trying again.`);
      return;
    }
    
    setError("");
    setGLoading(true);

    try {
      await signInWithGoogle();
      setAttemptCount(0);
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('login_block_time');
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsubscribe();
          router.replace(redirect);
        }
      });
    } catch (err) {
      handleRateLimit();
      
      if (err instanceof Error) {
        if (err.message.includes("popup-closed-by-user")) {
          setError("Google sign-in was cancelled.");
        } else if (err.message.includes("popup-blocked")) {
          setError("Pop-up blocked. Please allow pop-ups and try again.");
        } else {
          setError("Google sign-in failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred with Google sign-in.");
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isClient) {
    return (
      <div className="login-container flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="login-container flex flex-col justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} noValidate>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">
                  Email <span aria-label="required"></span>
                </Label>
                <Input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors(prev => ({...prev, email: undefined}));
                    }
                  }}
                  required
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  aria-label="Email Address"
                  aria-describedby={fieldErrors.email ? "email-error" : "email-helper"}
                  aria-invalid={!!fieldErrors.email}
                  className={fieldErrors.email ? "border-red-500 focus:border-red-500" : ""}
                  disabled={loading || gloading || isBlocked}
                />
                <div id="email-helper" className="sr-only">
                  Please enter your email address to sign in
                </div>
                {fieldErrors.email && (
                  <div id="email-error" className="flex items-center gap-1 text-red-500 text-sm" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {fieldErrors.email}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">
                  Password <span aria-label="required"></span>
                </Label>
                <div className="relative">
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors(prev => ({...prev, password: undefined}));
                      }
                    }}
                    required
                    autoComplete="current-password"
                    aria-label="Password"
                    aria-describedby={fieldErrors.password ? "password-error" : "password-helper"}
                    aria-invalid={!!fieldErrors.password}
                    className={`pr-10 ${fieldErrors.password ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={loading || gloading || isBlocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    onKeyDown={(e) => handleKeyDown(e, () => setShowPassword(!showPassword))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={0}
                    disabled={loading || gloading || isBlocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div id="password-helper" className="sr-only">
                  Please enter your password to sign in
                </div>
                {fieldErrors.password && (
                  <div id="password-error" className="flex items-center gap-1 text-red-500 text-sm" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {fieldErrors.password}
                  </div>
                )}
              </div>
            </div>
            
            {isBlocked && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Too many failed attempts. Try again in {formatTime(blockTimeRemaining)}</span>
                </div>
              </div>
            )}
            
            <div className="flex flex-col pt-5 pb-5">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || gloading || isBlocked}
                aria-live="polite"
                aria-describedby="login-status"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              
              {error && (
                <div id="login-status" className="flex items-center gap-1 text-red-500 text-sm pt-2" role="alert" aria-live="polite">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              {attemptCount > 0 && attemptCount < MAX_ATTEMPTS && !isBlocked && (
                <div className="text-amber-600 dark:text-amber-400 text-sm pt-2">
                  Warning: {MAX_ATTEMPTS - attemptCount} attempts remaining
                </div>
              )}
            </div>
          </form>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 shadow-sm hover:bg-gray-100 dark:hover:text-black transition disabled:opacity-50"
            variant="outline"
            disabled={loading || gloading || isBlocked}
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
                  Logging in with Google...
                </>
              ) : (
                "Continue with Google"
              )}
            </span>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-center text-sm">
            Forgot your password?{" "}
            <Link 
              href="/password-reset" 
              className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
            >
              Reset it here
            </Link>
          </p>
        </CardFooter>
      </Card>
      <p className="pt-4 text-center text-sm">
        New to the platform?{" "}
        <Link 
          href={`/signup?redirect=${encodeURIComponent(redirect)}`} 
          className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;