import React from "react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/">
      <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-sm text-white cursor-pointer">
        Orion<span className="text-purple-400">.AI</span>
      </h1>
    </Link>
  );
}
