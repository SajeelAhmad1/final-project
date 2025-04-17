"use client";
import React, { useEffect } from "react";
import ClientPasswordForm from "@/components/loginForm";
import logo from "@/assets/logo.png";
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    document.title = "Login - Academic Management System";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Login yourself on Academic Management System"
      );
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Login yourself on Academic Management System";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="relative min-h-screen min-w-full grid grid-cols-1 md:grid-cols-2 bg-[url('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center bg-no-repeat">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Content Section */}
      <section className="relative z-10 w-full h-full flex flex-col justify-center items-center px-4 space-y-6">
        <div className="flex flex-col justify-center items-center space-y-4">
          <div className="text-center text-[40px] font-bold text-[#F19B12]">
            <Image
              src={logo.src}
              alt="logo"
              width={200}
              height={200}
            />
          </div>
        </div>
        <div className="max-w-[300px] sm:max-w-[360px] w-full">
          <ClientPasswordForm />
        </div>
      </section>

      {/* Placeholder for the second column (hidden on smaller screens) */}
      <div className="hidden md:block"></div>
    </div>
  );
}