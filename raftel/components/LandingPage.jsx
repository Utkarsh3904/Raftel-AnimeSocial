"use client"

import Link from "next/link"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useState } from "react"

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

export default function LandingPage() {
  const { signUp, isLoaded: signUpLoaded } = useSignUp()
  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const [loading, setLoading] = useState(null)

  const handleGoogleSignUp = async () => {
    if (!signUpLoaded) return
    setLoading("google-signup")
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sign-up/sso-callback",
        redirectUrlComplete: "/onboarding",
      })
    } catch {
      setLoading(null)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!signInLoaded) return
    setLoading("google-signin")
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/feed",
      })
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="relative min-h-screen  bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-red-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-orange-500/10 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 font-bold text-black">
              R
            </div>
            <span className="text-xl font-bold tracking-tight">Raftel</span>
          </div>
          <Link
            href="/sign-in"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Already a member?
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-16">
          <div className="mb-12 max-w-2xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-orange-500">
              Anime Social Network
            </p>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Your crew.
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Your anime.
              </span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400">
              Join Raftel to share polls, debate hot takes, and build your anime identity with a custom avatar and top 5 list.
            </p>
          </div>

          <div className="grid w-full max-w-3xl gap-5 sm:grid-cols-2">
            {/* New user — Clerk OAuth */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-7 backdrop-blur-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
                New here
              </p>
              <h2 className="mb-2 text-xl font-bold">Join with Google</h2>
              <p className="mb-6 text-sm text-zinc-500">
                Fastest way in — one click, then pick your avatar and top 5 anime.
              </p>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading === "google-signup"}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border cursor-pointer border-zinc-700 bg-white px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-100 disabled:opacity-60"
              >
                <GoogleIcon />
                {loading === "google-signup" ? "Redirecting..." : "Continue with Google"}
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-xs text-zinc-600">or</span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              <Link
                href="/sign-up"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 text-sm font-medium text-zinc-200 transition hover:border-orange-500/50 hover:text-white"
              >
                <MailIcon />
                Sign up with Email
              </Link>
            </div>

            {/* Returning user */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-7 backdrop-blur-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Returning
              </p>
              <h2 className="mb-2 text-xl font-bold">Welcome back</h2>
              <p className="mb-6 text-sm text-zinc-500">
                Sign in to jump straight to your feed and crew.
              </p>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading === "google-signin"}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border cursor-pointer  border-zinc-700 bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:border-orange-500/50 disabled:opacity-60"
              >
                <GoogleIcon />
                {loading === "google-signin" ? "Redirecting..." : "Sign in with Google"}
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-xs text-zinc-600">or</span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              <Link
                href="/sign-in"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 text-sm font-medium text-zinc-200 transition hover:border-orange-500/50 hover:text-white"
              >
                <MailIcon />
                Sign in with Email
              </Link>
            </div>
          </div>

          <p className="mt-10 max-w-md text-center text-xs text-zinc-600">
            By continuing, you agree to set up your Raftel profile — avatar, username, and top 5 anime — before entering the feed.
          </p>
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-6 pb-4 text-xs text-zinc-600">
          <span>Polls & debates</span>
          <span className="text-zinc-800">·</span>
          <span>Custom avatars</span>
          <span className="text-zinc-800">·</span>
          <span>Top 5 anime profiles</span>
        </footer>
      </div>
    </div>
  )
}
