// src/app/password/page.tsx
"use client";
import React from "react";
import PasswordPic from "@/assets/onBoarding/otpImg.png";
import ClientPasswordForm from "@/components/passwordForm";
import { useEffect } from "react";
import Image from "next/image";
import logo from "@/assets/logo.png"

export default function Password() {
  useEffect(() => {
    document.title = "Password - Academic Management System";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute("content", "Password setup for Academic Management System");
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Password setup for Academic Management System";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="h-screen w-screen px-4 flex flex-col justify-center lg:flex-row mt-0 pt-0 overflow-x-hidden bg-gray-100 ">
      <section className="w-full lg:w-[60vw] h-auto flex flex-col justify-center items-center">
        <Image
          src={logo.src}
          width={150}
          height={150}
          alt="logo"
          className="mx-auto"
        />
        <div className="flex flex-col items-center space-y-1 lg:space-y-1 pb-12 pt-8 ">
          <h1 className="font-semibold leading-[56.96px] bold text-[24px] md:text-[36px] lg:text-[46px] text-center  -tracking--2">
            Create Password
          </h1>
        </div>
        <ClientPasswordForm />
      </section>
      <div className="hidden lg:flex lg:w-[40vw] h-screen flex-col">
        <img
          src={PasswordPic.src}
          alt="Verification"
          className="w-full h-[100vh] object-cover rounded-l-[90px]"
        />
      </div>
    </div>
  );
}
