"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/Firebase";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                router.push("/login"); // Redirect to login if not authenticated
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    // If user is authenticated, render the children
    return <>{user ? children : null}</>;
}
