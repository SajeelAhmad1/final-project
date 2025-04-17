import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define protected paths
const protectedPaths = [
  // "/student",
  "/facultys",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle `.well-known/assetlinks.json`
  if (pathname === "/.well-known/assetlinks.json") {
    const assetLinks = [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.example.myapp",
          sha256_cert_fingerprints: [
            "AA:BB:CC:DD:EE:FF:GG:HH:II:JJ:KK:LL:MM:NN:OO:PP:QQ:RR:SS:TT:UU:VV:WW:XX:YY:ZZ"
          ]
        }
      }
    ];

    return new Response(JSON.stringify(assetLinks), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Authentication and Authorization Logic
  const token = await getToken({ req });
  console.log("token from middleware", token);
  console.log("token end")

  const email = token?.email || "";
  console.log("from middleware", email);

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath) {
    if (token.isProfileComplete === true) {
      const profileUrl = new URL(
        `/profile/?email=${encodeURIComponent(email)}`,
        req.url
      );
      return NextResponse.redirect(profileUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: [
    // "/student/:path*",
    "/facultys/:path*",
    "/.well-known/assetlinks.json",
  ],
};
