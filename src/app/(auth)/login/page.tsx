"use client";
import React, { useEffect } from "react";
import ClientPasswordForm from "@/components/loginForm";

export default function Home() {
  useEffect(() => {
    document.title = "Login - Lyalla and Lora";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute( 
        "content",
        "Login yourself on Lyalla and Lora"
      );
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Login yourself on Lyalla and Lora";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="relative min-h-screen min-w-full grid grid-cols-1 md:grid-cols-2">
      {/* Content Section */}
      <section className="relative z-10 w-full h-full flex flex-col justify-center items-center px-4 space-y-6">
        <div className="flex flex-col justify-center items-center space-y-4">
        <div className="text-center text-[40px] font-bold text-[#F19B12]">
            Lyalla and Lora
          </div>
        </div>
        <div className="max-w-[300px] sm:max-w-[360px] w-full">
          <ClientPasswordForm />
        </div>
      </section>

      {/* Placeholder for the second column (hidden on smaller screens) */}
      <div className="hidden md:block">
      
      </div>
    </div>
  );
}
