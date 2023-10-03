import AuthForm from "@/components/AuthForm";
import Image from "next/image";

export default function Home() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-200">
            <AuthForm />
        </main>
    );
}
