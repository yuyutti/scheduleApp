"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm rounded bg-white p-8 shadow">
                <h1 className="mb-6 text-center text-xl font-bold">
                    ログイン
                </h1>

                <button
                    onClick={() => signIn("google")}
                    className="flex w-full items-center justify-center gap-3 rounded bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition"
                >
                    <Image
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        width={20}
                        height={20}
                    />
                    Googleでログイン
                </button>
            </div>
        </div>
    );
}