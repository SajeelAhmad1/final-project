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
        } catch (error) {
          console.error("Detailed authorization error:", {
            message: error.message,
            stack: error.stack,
            credentials
          });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Update the signIn callback in auth-options.ts
async signIn({ user, account, profile, request }) {
  // Get the role from the callback URL
  const url = new URL(request.url);
  const role = url.pathname.includes('/register/faculty') 
    ? ROLE.FACULTY 
    : ROLE.STUDENT;

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
              firstName: profile?.given_name || user.firstName,
              lastName: profile?.family_name || user.lastName,
              rollNumber: tempRollNumber,
              batch: 'TEMP', // Temporary value
              department: 'TEMP', // Temporary value
              phone: 'TEMP', // Temporary value
            }
          };
        } else if (role === ROLE.FACULTY) {
          userData.faculty = {
            create: {
              firstName: profile?.given_name || user.firstName,
              lastName: profile?.family_name || user.lastName,
              department: 'TEMP', // Temporary value
              designation: 'TEMP', // Temporary value
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
          user.isProfileComplete = false; // Mark as incomplete since we used temp values
        } else {
          user.faculty = newUser.faculty;
          user.isProfileComplete = false; // Mark as incomplete since we used temp values
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
          const profile = await prisma.student.create({
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
          user.student = profile;
          user.isProfileComplete = false;
        } else if (existingUser.role === ROLE.FACULTY && !existingUser.faculty) {
          const profile = await prisma.faculty.create({
            data: {
              userId: existingUser.id,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              department: 'TEMP',
              designation: 'TEMP',
            }
          });
          user.faculty = profile;
          user.isProfileComplete = false;
        }
      }
      
      // Set the role on the user object
      user.role = role;
      return true;
    } catch (error) {
      console.error('Error during Google sign-in:', error);
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
          isProfileComplete: !!user.student,
          verified: user.verified,
          name: user.student 
            ? `${user.student.firstName} ${user.student.lastName}`.trim()
            : '',
        };
      }
    
      // For credential logins
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isProfileComplete = !!user.student;
        token.student = user.student || null;
        token.verified = user.verified;
        token.role = user.role;
        token.loginType = user.loginType;
        token.token = user.token;
        token.name = user.student 
          ? `${user.student.firstName} ${user.student.lastName}`.trim()
          : '';
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