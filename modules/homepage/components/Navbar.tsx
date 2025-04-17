import { useRouter } from "next/navigation"
import Image from "next/image"
import logo from "@/assets/logo.png"

const Navbar = () => {
    const router = useRouter();
    return (
        <div className="flex justify-between items-center pb-6">
            <div>
                <Image
                    src={logo.src}
                    height={200}
                    width={200}
                    quality={50}
                    alt="logo"
                    className="h-20 w-20"
                />
            </div>
            <div className="space-x-8">
                <button
                    onClick={() => router.push("/admin-login")}
                    className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-4 py-2 rounded-lg text-[#ffffff]">
                    Admin Login
                </button>
                <button
                    onClick={() => router.push("/login")}
                    className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-4 py-2 rounded-lg text-[#ffffff]">
                    Faculty Login
                </button>
                <button
                    onClick={() => router.push("/login")}
                    className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-4 py-2 rounded-lg text-[#ffffff]">
                    Student Login
                </button>
            </div>
        </div>
    )
}
export default Navbar