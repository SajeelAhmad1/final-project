"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import Image from "next/image";
import logo from "@/assets/logo.png"

const ClientPasswordform = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/admin",
            });

            console.log("Sign in result:", result);

            if (result?.error) {
                setError(result.error); // Use the error message from NextAuth
            } else {
                router.push("/admin");
            }
        } catch (error: any) {
            console.error("Error during sign-in:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-16">

            <div className="flex justify-center bg-white">
                <Image
                    src={logo.src}
                    height={120}
                    width={150}
                    alt="Ava Logo"
                    className="p-2"
                />
            </div>


            <div className="flex flex-col items-center min-h-screen">

                <h1 className="text-[#25292A] font-montserrat text-4xl font-semibold leading-[48.96px] tracking-[-0.02em] text-center">
                    Login as Administrator
                </h1>

                <div className="w-[90%] border border-gray-200 md:w-full max-w-lg p-6 mt-8 mb-8 bg-white shadow-xl rounded-xl">
                    

                    <form onSubmit={handleSubmit} className="space-y-6  pb-8">


                        {/* Email Field */}
                        <div className="my-2 ">
                            <label
                                htmlFor="email"
                                className="text-[#25292A] font-semibold text-sm mb-2 block"
                            >
                                Email Address<span className="text-red-500">*</span>
                            </label>

                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 py-4 px-6 rounded-lg border-blue-300 border-2 w-full text-sm focus:outline-none"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative my-2">
                            <label
                                htmlFor="password"
                                className="text-[#25292A] font-semibold text-sm mb-2 block"
                            >
                                Password <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 py-4 px-6 rounded-lg border-2 border-blue-300 w-full text-sm focus:outline-none"
                                />
                                <div
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-6 w-6 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-6 w-6 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="text-sm text-red-500 mt-2">
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-b from-[#579FE1] to-[#2290F3] text-white text-lg rounded-lg"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </form>
                </div>

            </div>


        </div>
    );
};

export default ClientPasswordform;
