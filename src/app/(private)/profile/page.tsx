"use client";
import React from "react";
import StudentProfileForm from "@/components/studentProfileForm";
import FacultyProfileForm from "@/components/facultyProfileForm";
import { useEffect } from "react";
import bgImg from "@/assets/myImages/otp.png"
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function ProfileDetails() {
  const { data: session }: any = useSession();
  useEffect(() => {
    document.title = "Profile - Lyalla and Lora";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Setup your profile on Lyalla and Lora"
      );
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Setup your profile on Lyalla and Lora";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-gray-100">
      <section className="w-full lg:w-[60%] flex flex-col justify-center items-center p-6 space-y-8 lg:space-y-1">
        {session?.user?.role === "STUDENT" && (
          <StudentProfileForm />
        )}
        {session?.user?.role === "FACULTY" && (
          <FacultyProfileForm />
        )}
      </section>
      <div className="hidden lg:block lg:w-[40%] h-screen relative">
        <Image
          src={bgImg.src}
          alt="profile background"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}