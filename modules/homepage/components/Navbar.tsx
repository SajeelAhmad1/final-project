import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = () => {
            setIsMenuOpen(false);
        };

        const timer = setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isMenuOpen]);

    const toggleMenu = (e: any) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="relative z-50">
            <div className="flex justify-between items-center pb-6 bg-white">
                <div>
                    <Image
                        src={logo.src}
                        height={200}
                        width={200}
                        quality={50}
                        alt="logo"
                        className="h-16 w-16 md:h-20 md:w-20"
                    />
                </div>

                <div className="hidden md:flex md:space-x-4 lg:space-x-8">
                    <button
                        onClick={() => router.push("/admin-login")}
                        className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-[#ffffff] text-sm lg:text-base">
                        Admin Login
                    </button>
                    <button
                        onClick={() => router.push("/login")}
                        className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-[#ffffff] text-sm lg:text-base">
                        Faculty Login
                    </button>
                    <button
                        onClick={() => router.push("/login")}
                        className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-[#ffffff] text-sm lg:text-base">
                        Student Login
                    </button>
                </div>

                <button
                    className="md:hidden p-2 z-50"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6 text-[#1B8BF0]" />
                    ) : (
                        <Menu className="h-6 w-6 text-[#1B8BF0]" />
                    )}
                </button>
            </div>

            {isMenuOpen && (
                <div className="md:hidden fixed top-0 left-0 right-0 w-full h-full">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>

                    <div
                        className="absolute top-24 left-4 right-4 bg-white shadow-xl rounded-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            <button
                                onClick={() => {
                                    router.push("/admin-login");
                                    setIsMenuOpen(false);
                                }}
                                className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-4 py-2 rounded-lg text-[#ffffff] w-full">
                                Admin Login
                            </button>
                            <button
                                onClick={() => {
                                    router.push("/login");
                                    setIsMenuOpen(false);
                                }}
                                className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-4 py-2 rounded-lg text-[#ffffff] w-full">
                                Faculty Login
                            </button>
                            <button
                                onClick={() => {
                                    router.push("/login");
                                    setIsMenuOpen(false);
                                }}
                                className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-4 py-2 rounded-lg text-[#ffffff] w-full">
                                Student Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;