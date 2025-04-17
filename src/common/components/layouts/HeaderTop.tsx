"use client"
import { useRouter } from 'next/navigation'

const HeaderTop = () => {
    const router = useRouter();
    return (
        <div className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0]  px-4 justify-between h-12 m-auto mr-16 ml-16 hidden lg:flex md:flex">
            <div className='flex justify-center items-center w-full'>
                <div className="text-white font-inter font-medium text-[20px] leading-[150%] tracking-[0%]">
                    Sign up to get 20% off on your first order. 
                    <span 
                    onClick={()=>router.push("/register")}
                    className='cursor-pointer font-inter font-medium text-[20px] leading-[150%] tracking-[0%] underline'>
                        Sign Up
                    </span>
                </div>
            </div>
            
        </div>
    )
}

export default HeaderTop