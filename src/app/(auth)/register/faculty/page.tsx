"use client";
import React, { useEffect } from "react";
import bgImg from "@/assets/onBoarding/register.png";
import ClientLoginForm from "@/components/registerForm";
import Image from "next/image";
import logo from "@/assets/logo.png"

export default function Home() {
  useEffect(() => {
    document.title = "Register - Academic Management System";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Register yourself on Academic Management System"
      );
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Register yourself on Academic Management System";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2">
      <section className="relative h-screen z-10 flex flex-col justify-center items-center md:items-center p-6">
        <div className="w-full text-center md:text-left space-y-2">
          <Image
                      src={logo.src}
                      width={100}
                      height={100}
                      alt="logo"
                      className="mx-auto pb-4"
                    />
          <h1 className="font-medium text-[24px] md:text-[32px] lg:text-[40px] tracking-[-2%] text-center leading-[56.96px] text-black">
            <span className="whitespace-nowrap">
              Keep Track of Classes<br /> and Exam Schedules
            </span>
          </h1>
          <p className="text-black text-[14px] md:text-[18px] leading-[43.7px] text-center my-1">
          Keep track of teaching schedules and students
          </p>
        </div>
        <div className="max-w-[400px] w-full">
          <ClientLoginForm />
        </div>

        <div className="w-full text-center text-black mt-5 space-y-2">
          <p className="text-sm md:text-[15.28px] leading-[20.78px]">
            By Proceeding, You Agree To The <br />
            <a href="#" className="text-blue-500">
              Terms of Service
            </a>{" "}
            And{" "}
            <a href="#" className="text-blue-500">
              Privacy Policy
            </a>
          </p>

          <p className="text-sm md:text-[15.28px] leading-[25.48px]">
            Already Have An Account?{" "}
            <a href="./login" className="text-blue-500 font-medium">
              Log in
            </a>
          </p>
        </div>
      </section>
      
      <div className="absolute right-0 top-0 w-1/2 h-screen">
        <Image
          src={bgImg.src}
          alt="bg"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}