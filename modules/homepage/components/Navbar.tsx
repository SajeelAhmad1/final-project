import { useRouter } from "next/navigation"
import Image from "next/image"

const Navbar = () => {
    const router = useRouter();
    return (
        <div className="flex justify-between items-center pb-6">
            <div>
            <Image
            src='/uet_logo.png'
            height={200}
            width={200}
            quality={50}
            alt="logo"
            className="h-20 w-20"
            />
        </div>
        <div className="space-x-8">
            <button 
            onClick={()=>router.push("/login")}
            className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-4 py-2 rounded-lg text-[#ffffff]">
                Student Login
            </button>
            <button 
            onClick={()=>router.push("/login")}
            className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] px-4 py-2 rounded-lg text-[#ffffff]">
                Faculty Login
            </button>
        </div>
        </div>
    )
}
export default Navbar