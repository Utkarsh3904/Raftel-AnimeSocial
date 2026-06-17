import { SignIn } from '@clerk/nextjs';
import Link from "next/link";

export default function SignInPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-6 bg-black">
            <Link href="/" className="text-xl font-bold text-orange-500"> Raftel </Link>
            <SignIn
              forceRedirectUrl="/feed"
              signUpForceRedirectUrl="/onboarding"
            />
        </main>
    )
}
