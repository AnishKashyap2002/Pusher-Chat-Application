"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import Input from "./Input";
import Image from "next/image";
import Button from "./Button";
import { BsGithub } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// type Inputs = {
//     name:string,
//     email:string,
//     password:string,
//     confirmPassword: string,
// }

// here will come the zod resolver

// --------zod----------

// ending

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
    const session = useSession();

    const router = useRouter();

    useEffect(() => {
        // check for session attributes man
        if (session.status === "authenticated") {
            router.push("/users");
        }
    }, [session.status, router]);

    // react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const [loading, setLoading] = useState(false);

    const [variant, setVariant] = useState<Variant>("REGISTER");

    const socialAction = (action: string) => {
        setLoading(true);

        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid Credentials");
                }
                if (callback?.ok) {
                    router.push("/conversations");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onSubmit: SubmitHandler<FieldValues> = (data, e) => {
        e?.preventDefault();
        setLoading(true);
        if (variant == "REGISTER") {
            axios
                .post("/api/register", data)
                .then(() => signIn("credentials", data))
                .catch(() => toast.error("Something went wrong"))
                .finally(() => setLoading(false));
        }
        if (variant == "LOGIN") {
            signIn("credentials", {
                ...data,
                redirect: false,
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error("Invalid Credentials");
                    } else if (callback?.ok) {
                        toast.success("Success login");
                        router.push("/users");
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        console.log(data);
    };

    const toggleVariant = useCallback(() => {
        setVariant((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN"));
    }, [variant]);

    return (
        <div className="bg-slate-200 flex flex-col rounded-md w-full sm:w-[700px]">
            <form
                action=""
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white flex flex-col px-6 py-4 rounded-lg gap-2"
            >
                <div className="">
                    <p className="flex justify-center gap-2 text-black mb-2 items-center">
                        <span className="h-10 w-10 relative">
                            <Image
                                alt="Logo"
                                src={"/hacker.jpg"}
                                fill
                                className="object-cover rounded-full"
                            />
                        </span>
                        <span className="font-extrabold text-2xl">Chatify</span>
                    </p>
                </div>
                <p className="text-xl w-full text-center text-black font-semibold ">
                    {variant == "LOGIN" ? "Sign In" : "Sign Up"} to Chatify
                </p>

                {variant == "REGISTER" && (
                    <Input
                        label="Enter Your Name"
                        id="name"
                        register={register}
                        errors={errors}
                        disabled={loading}
                    />
                )}
                <Input
                    label="Enter Your email"
                    id="email"
                    type="email"
                    register={register}
                    disabled={loading}
                    errors={errors}
                />
                <Input
                    label="Enter Your password"
                    id="password"
                    type="password"
                    register={register}
                    disabled={loading}
                    errors={errors}
                />
                <Button
                    type="submit"
                    full={true}
                    disabled={loading}
                >
                    {variant == "LOGIN" ? "Sign In" : "Sign Up"}
                </Button>
                <div className="relative mt-5">
                    <div className="py-3">
                        <p className="z-0 h-0.5 bg-gray-700 w-full " />
                    </div>
                    <div className="absolute top-0 w-full flex justify-center  z-10 ">
                        <p className="text-black bg-white px-4">
                            Other Providers
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    <div
                        className=" cursor-pointer flex gap-2 justify-center items-center text-black bg-slate-200 rounded-md px-4 py-2 shadow-md"
                        onClick={() => socialAction("github")}
                    >
                        <BsGithub />
                        <p>Github</p>
                    </div>
                    <div
                        className=" cursor-pointer flex gap-2 justify-center items-center text-black bg-slate-200 rounded-md px-4 py-2 shadow-md"
                        onClick={() => socialAction("google")}
                    >
                        <BsGoogle />
                        <p>Google</p>
                    </div>
                </div>
                <div className="w-full text-center text-black mt-4  items-center flex gap-2 justify-center">
                    {variant == "LOGIN"
                        ? "New to Chatify ?"
                        : "Already have an account ?"}
                    <span
                        className="cursor-pointer font-bold"
                        onClick={toggleVariant}
                    >
                        {variant == "LOGIN" ? "Sign Up" : "Sign In"}
                    </span>
                </div>
            </form>
        </div>
    );
};

export default AuthForm;
