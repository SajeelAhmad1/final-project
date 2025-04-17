"use client";
import React from "react";
import StudentProfileForm from "@/components/studentProfileForm";
import FacultyProfileForm from "@/components/facultyProfileForm";
import { useEffect } from "react";
import bgImg from "@/assets/onBoarding/profileImg.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileDetails() {
  const { data: session }: any = useSession();
  const router = useRouter();
  
  // Add redirect if profile is already complete
  useEffect(() => {
    if (session?.user?.isProfileComplete) {
      const redirectPath = session.user.role === "STUDENT" 
        ? "/student" 
        : "/faculty";
      router.push(redirectPath);
    }
  }, [session, router]);

  useEffect(() => {
    document.title = "Profile - Academic Management System";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Setup your profile on Academic Management System"
      );
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = "Setup your profile on Academic Management System";
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gray-100">
      {/* Form Section - Scrollable */}
      <section className="w-full lg:w-[60%] flex flex-col p-6 space-y-8 lg:space-y-12 overflow-y-auto">
        {session?.user?.role === "STUDENT" && <StudentProfileForm />}
        {session?.user?.role === "FACULTY" && <FacultyProfileForm />}
      </section>

      {/* Background Image Section - Fixed but scrolls with page */}
      <div className="hidden lg:block lg:w-[40%] relative">
        <div className="sticky top-0 h-screen w-full">
          <Image
            src={bgImg.src}
            alt="profile background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}