"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/finallandingpage.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-8 pt-8 sm:px-12 sm:pt-10">
          <Image
            src="/raftel-icon.png"
            alt="Raftel"
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl object-cover"
          />
          <div className="flex items-center gap-4">
            <SignUpButton mode="modal">
              <button className="rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-black hover:text-white">
                Sign Up
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800">
                Sign In
              </button>
            </SignInButton>
          </div>
        </header>

        <main className="flex flex-1 items-center sm:pl-16 sm:mb-80">
          <div className="max-w-lg">
            <h1 className="text-6xl font-extrabold tracking-tight text-black sm:text-7xl md:text-8xl">
              Raftel
            </h1>
            <p className="mt-4 text-lg font-medium text-zinc-700 sm:text-xl md:text-2xl">
              Your crew. Your anime.
              <br />
              Your identity.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
