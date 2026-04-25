"use client";

import {useState} from "react";
import { useRouter } from "next/navigation";
import avatars from "@/lib/avatars"
import { toast } from "@/components/ui/sonner";
import {Button} from "@/components/ui/button"

export default function OnboardingPage(){

    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState(avatars[0]);
    const router = useRouter();     


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            const res = await fetch("/api/users/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, avatar }),
            });
            if (res.ok) {
            toast({ title: "Profile saved!" })
            router.push("/onboarding/anime")
            }


        } catch (error) {
            toast({
            title: "Something went wrong",
            description: "Failed to update profile. Try again.",
            variant: "destructive",
            })

        }

    }
    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>  
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />              

                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Choose an Avatar</label>                      
                        <div className="flex space-x-2 overflow-x-auto py-2">
                            {avatars.map((avt, index) => (
                                <img
                                    key={index}
                                    src={avt}
                                    alt={`Avatar ${index + 1}`}
                                    className={`w-16 h-16 rounded-full border-2 ${avatar === avt ? 'border-blue-500' : 'border-gray-300'} cursor-pointer`}
                                    onClick={() => setAvatar(avt)}
                                />
                            ))}
                        </div>
                    </div>
                        <Button type="submit" className="w-full">
                        Next
                        </Button>
                </form>
            </div>
        </div>
    );

}