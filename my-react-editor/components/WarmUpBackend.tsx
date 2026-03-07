"use client";

import { useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function WarmUpBackend() {
    useEffect(() => {
        // Fire-and-forget ping to wake up the backend from Railway's sleep
        fetch(BACKEND_URL, { mode: "cors" }).catch(() => {
            // Silently ignore errors — this is just a warm-up
        });
    }, []);

    return null; // No UI
}
