import { SignUp } from '@clerk/nextjs';
import Link from "next/link";

export default function SignUpPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-6 bg-black">
            <Link href="/" className="text-xl font-bold text-orange-500"> Raftel</Link>
            <SignUp forceRedirectUrl="/onboarding" />
        </main>
    )
}
