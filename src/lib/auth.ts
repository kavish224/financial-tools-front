import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
  linkWithCredential,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "./firebase";

// Utility function for Firebase error messages
const getFirebaseErrorMessage = (error: FirebaseError) => {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "Email is already in use.",
    "auth/invalid-email": "Invalid email address.",
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/account-exists-with-different-credential":
      "An account already exists with a different sign-in method. Please link your Google account.",
    "auth/early-verify": "Please verify your email address before logging in.", // Custom error for email not verified
  };

  return errorMessages[error.code] || "An unknown error occurred.";
};

// Google Sign-In function with account linking
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken();
    return { user, idToken };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase error:", error);

      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email as string;
        const pendingCred = GoogleAuthProvider.credentialFromError(error);

        if (email && pendingCred) {
          const methods = await fetchSignInMethodsForEmail(auth, email);

          if (methods.includes("password")) {
            throw new Error(
              `An account exists with the email ${email}. Sign in using email/password to link your Google account.`
            );
          }

          const result = await signInWithPopup(auth, provider);
          await linkWithCredential(result.user, pendingCred);

          return { user: result.user, message: "Google account linked successfully!" };
        }
      }

      switch (error.code) {
        case "auth/popup-closed-by-user":
          throw new Error("Popup closed before completion. Please try again.");
        case "auth/cancelled-popup-request":
          throw new Error("Popup request was cancelled. Please try again.");
        default:
          throw new Error(getFirebaseErrorMessage(error));
      }
    }

    console.error("Unknown Google login error:", error);
    throw new Error("An unknown error occurred during Google sign-in.");
  }
};

// Signup function
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await signOut(auth); // Immediately log the user out to prevent auto-login
    return { message: "Please verify your email before logging in." };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw new Error("Error signing up. Please try again.");
  }
};

// SignIn function
// SignIn function
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (!userCredential.user.emailVerified) {
      // Throw custom error when email is not verified
      const error = new Error("Please verify your email address before logging in.");
      error.name = "EmailNotVerifiedError"; // Ensure this custom name
      throw error;
    }

    const idToken = await userCredential.user.getIdToken();
    return { user: userCredential.user, idToken };
  } catch (error: unknown) {
    console.error("Error during login:", error);

    if (error instanceof Error) {
      // Handling custom EmailNotVerifiedError
      if (error.name === "EmailNotVerifiedError") {
        throw new Error(error.message); // Re-throw the custom error with the message
      }

      // Handle other Firebase errors
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            throw new Error("The credentials provided are invalid. Please check your email and password.");
          case "auth/user-not-found":
            throw new Error("No user found with this email.");
          case "auth/wrong-password":
            throw new Error("Incorrect password. Please try again.");
          case "auth/invalid-email":
            throw new Error("Invalid email format.");
          case "auth/too-many-requests":
            throw new Error("Too many failed attempts. Please try again later.");
          case "auth/email-already-in-use":
            throw new Error("Email is already in use.");
          default:
            throw new Error("An unknown error occurred.");
        }
      }
    }

    console.error("Unknown error:", error);
    throw new Error("An unknown error occurred while trying to log in.");
  }
};


// Logout function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    console.error("Error signing out:", error);
    throw error;
  }
};
