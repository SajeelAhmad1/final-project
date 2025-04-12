"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Pencil } from "lucide-react";

type StudentProfile = {
  firstName: string;
  lastName: string;
  rollNumber: string;
  batch: string;
  department: string;
  phone: string;
  imageUrl?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

const StudentProfileForm: React.FC = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>({
    firstName: "",
    lastName: "",
    rollNumber: "",
    batch: "",
    department: "",
    phone: "",
    imageUrl: null,
    streetAddress: null,
    city: null,
    state: null,
    postalCode: null,
    country: null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session?.user?.student) return;
    setProfile(session.user.student);
    if (session.user.student.imageUrl) {
      setImagePreview(session.user.student.imageUrl);
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value || null }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('/api/upload-image', { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Failed to upload image');
    const data = await response.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedProfile = { ...profile };

      if (imageFile) {
        updatedProfile.imageUrl = await uploadImage(imageFile);
      }

      const method = session?.user?.isProfileComplete ? "PUT" : "POST";
      const response = await fetch("/api/profile/student-profile", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      toast.success(data.message);
      
      await update({
        user: {
          ...session?.user,
          student: data.data,
          isProfileComplete: true
        }
      });

      if (!session?.user?.isProfileComplete) {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4 bg-gray-100 border border-gray-300">
              {imagePreview ? (
                <Image src={imagePreview} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2"
            >
              <Pencil className="text-white w-4 h-4" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="md:col-span-2 text-xl font-semibold">Personal Information</h2>
          
          {[
            { label: "First Name", name: "firstName", type: "text", required: true },
            { label: "Last Name", name: "lastName", type: "text", required: true },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label} {field.required && "*"}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={profile[field.name as keyof StudentProfile] || ""}
                onChange={handleChange}
                required={field.required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="md:col-span-2 text-xl font-semibold">Academic Information</h2>
          
          {[
            { label: "Roll Number", name: "rollNumber", type: "text", required: true },
            { label: "Batch", name: "batch", type: "text", required: true },
            { label: "Department", name: "department", type: "text", required: true },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label} {field.required && "*"}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={profile[field.name as keyof StudentProfile] || ""}
                onChange={handleChange}
                required={field.required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="md:col-span-2 text-xl font-semibold">Contact Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {[
            { label: "Street Address", name: "streetAddress", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "State/Province", name: "state", type: "text" },
            { label: "Postal Code", name: "postalCode", type: "text" },
            { label: "Country", name: "country", type: "text" },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={profile[field.name as keyof StudentProfile] || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? "Saving..." : session?.user?.isProfileComplete ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default StudentProfileForm;