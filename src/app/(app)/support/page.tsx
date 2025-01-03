"use client";

import { useAuth } from "@/components/AuthProvider";
import LogoutButton from "@/components/LogoutBtn";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Authenticated Content</h1>
      <LogoutButton />
    </div>
  );
}

export default Page;
