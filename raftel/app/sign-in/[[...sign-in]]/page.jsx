import { SignIn } from '@clerk/nextjs';
import Link from "next/link";

export default function SignInPage() {
    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
            <Link href="/" className="text-orange-500 font-bold text-xl">← Raftel</Link>
            <SignIn
              forceRedirectUrl="/feed"
              signUpForceRedirectUrl="/onboarding"
            />
        </main>
    )
}
