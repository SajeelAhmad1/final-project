"use client";
import React, { useEffect, useState } from "react";
import VerificationForm from "@/components/verificationForm";
import AuthLayout from "@/components/auth";
import Image from "next/image";
import logo from "@/assets/logo.png"

export default function Verification() {
  useEffect(() => {
    document.title = "Verification - Academic Management System";

    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute("content", "Verify your Academic Management System account");
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Verify your Academic Management System account";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <AuthLayout>
      <section className="w-full h-screen flex flex-col justify-center items-center">
        <div>
          <div className="text-center text-[40px] font-bold text-[#F19B12]">
            <Image
            src={logo.src}
            width={150}
            height={150}
            alt="logo"
            className="mx-auto"
            />
          </div>
          <div className="flex flex-col items-center space-y-1 lg:space-y-1 p-5 mt-[50px]">
            <h1 className="font-semibold leading-[28.8px] md:leading-[48.8px] text-[24px] md:text-[36px] lg:text-[40px] text-center">
              Enter The 6-Digit Verification Code <br />
               Sent To Your Email
            </h1>
          </div>
        </div>

        <div className="max-w-[360px] w-full">
          <VerificationForm />
        </div>
      </section>
    </AuthLayout>
  );
}
