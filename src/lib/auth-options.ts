// lib/auth-options.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { ROLE } from "@/common/constant/apis-urls";
import axios from "axios";

const prisma = new PrismaClient();

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || '',
          firstName: profile.given_name || profile.name?.split(' ')[0] || '',
          lastName: profile.family_name || profile.name?.split(' ')[1] || '',
          email: profile.email,
          image: profile.picture,
          verified: true,
          loginType: "GOOGLE",
        };
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSettingPassword: { label: "IsSettingPassword", type: "hidden" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          let user;
          if (credentials.isSettingPassword === "true") {
            const response = await fetch(
              `${process.env.NEXTAUTH_URL}/api/password-save`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: credentials.email,
                  newPassword: credentials.password,
                  confirmPassword: credentials.password,
                }),
              }
            );

            if (!response.ok) throw new Error("Failed to set password");
            user = (await response.json()).data;
          } else {
            const response = await axios.post(
              `${process.env.NEXTAUTH_URL}/api/login`,
              {
                email: credentials.email,
                password: credentials.password,
                role: ROLE.STUDENT,
              }
            );

            if (response.status !== 200) {
              throw new Error("Invalid credentials");
            }
            user = response.data.data;
          }

          if (!user) return null;

          const student = await prisma.student.findUnique({
            where: { userId: user.id },
          });

          return {
            ...user,
            student: student || null,
            isProfileComplete: !!student,
          };
        } catch (error: any) {
          console.error("Authorization error:", {
            message: error.message,
            stack: error.stack,
            credentials: {
              email: credentials?.email,
              isSettingPassword: credentials?.isSettingPassword
            }
          });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, request }) {
      // Default role if we can't determine from URL
      let role = ROLE.STUDENT;

      // Try to get role from URL if available
      try {
        if (request?.url) {
          const url = new URL(request.url);
          if (url.pathname.includes('/register/faculty')) {
            role = ROLE.FACULTY;
          }
        }
      } catch (error) {
        console.error('Error parsing URL for role detection:', error);
      }

      if (account?.provider === "google") {
        try {
          // Check if user exists in your database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { student: true, faculty: true },
          });

          if (!existingUser) {
            // Create new user for Google sign-in with the determined role
            const userData: any = {
              email: user.email,
              verified: true,
              loginType: "GOOGLE",
              role: role,
            };

            if (role === ROLE.STUDENT) {
              // Generate a temporary roll number for initial signup
              const tempRollNumber = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
              
              userData.student = {
                create: {
                  firstName: profile?.given_name || user.firstName || '',
                  lastName: profile?.family_name || user.lastName || '',
                  rollNumber: tempRollNumber,
                  batch: 'TEMP',
                  department: 'TEMP',
                  phone: 'TEMP',
                }
              };
            } else if (role === ROLE.FACULTY) {
              userData.faculty = {
                create: {
                  firstName: profile?.given_name || user.firstName || '',
                  lastName: profile?.family_name || user.lastName || '',
                  department: 'TEMP',
                  designation: 'TEMP',
                }
              };
            }

            const newUser = await prisma.user.create({
              data: userData,
              include: { student: true, faculty: true },
            });
            
            user.id = newUser.id;
            if (role === ROLE.STUDENT) {
              user.student = newUser.student;
              user.isProfileComplete = false;
            } else {
              user.faculty = newUser.faculty;
              user.isProfileComplete = false;
            }
          } else {
            user.id = existingUser.id;
            if (existingUser.role === ROLE.STUDENT) {
              user.student = existingUser.student;
              user.isProfileComplete = !!existingUser.student;
            } else {
              user.faculty = existingUser.faculty;
              user.isProfileComplete = !!existingUser.faculty;
            }

            // If user exists but doesn't have a profile, create one with temp values
            if (existingUser.role === ROLE.STUDENT && !existingUser.student) {
              const tempRollNumber = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
              const studentProfile = await prisma.student.create({
                data: {
                  userId: existingUser.id,
                  firstName: user.firstName || '',
                  lastName: user.lastName || '',
                  rollNumber: tempRollNumber,
                  batch: 'TEMP',
                  department: 'TEMP',
                  phone: 'TEMP',
                }
              });
              user.student = studentProfile;
              user.isProfileComplete = false;
            } else if (existingUser.role === ROLE.FACULTY && !existingUser.faculty) {
              const facultyProfile = await prisma.faculty.create({
                data: {
                  userId: existingUser.id,
                  firstName: user.firstName || '',
                  lastName: user.lastName || '',
                  department: 'TEMP',
                  designation: 'TEMP',
                }
              });
              user.faculty = facultyProfile;
              user.isProfileComplete = false;
            }
          }
          
          // Set the role on the user object
          user.role = existingUser?.role || role;
          return true;
        } catch (error: any) {
          console.error('Google sign-in error:', {
            message: error.message,
            stack: error.stack,
            user,
            profile
          });
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      // Initial sign-in
      if (account && user) {
        token = {
          ...token,
          id: user.id,
          email: user.email,
          role: user.role || ROLE.STUDENT,
          loginType: account.provider === "google" ? "GOOGLE" : "CREDENTIALS",
          student: user.student || null,
          faculty: user.faculty || null,
          isProfileComplete: user.isProfileComplete || false,
          verified: user.verified || false,
          name: user.student 
            ? `${user.student.firstName} ${user.student.lastName}`.trim()
            : user.faculty
              ? `${user.faculty.firstName} ${user.faculty.lastName}`.trim()
              : user.name || '',
        };
      }
    
      // For subsequent requests
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isProfileComplete = user.isProfileComplete || false;
        token.student = user.student || null;
        token.faculty = user.faculty || null;
        token.verified = user.verified || false;
        token.role = user.role || ROLE.STUDENT;
        token.loginType = user.loginType || "CREDENTIALS";
        token.token = user.token;
        token.name = user.student 
          ? `${user.student.firstName} ${user.student.lastName}`.trim()
          : user.faculty
            ? `${user.faculty.firstName} ${user.faculty.lastName}`.trim()
            : user.name || '';
      }
    
      return token;
    },
    
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        loginType: token.loginType,
        isProfileComplete: token.isProfileComplete,
        student: token.student,
        faculty: token.faculty,
        verified: token.verified,
      };
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default authOptions;