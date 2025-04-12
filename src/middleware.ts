import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define protected paths
const protectedPaths = [
  "/doctor/dashboard",
  "/doctor/patient-listings",
  "/doctor/merckandmanuals",
  "/doctor/virtual-visits",
  "/doctor/drugs-and-medications",
  "/doctor/prescription-writer",
  "/doctor/appointments",
  "/doctor/reports-and-referrals",
  "/doctor/health-tools",
  "/doctor/pharma-cme",
  "/doctor/supply-ordering",
  "/doctor/billing",
  "/doctor/med-advisory",
  "/doctor/my-emr",
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
  console.log(email);

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath) {
    if (token.isProfileComplete === false) {
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
    "/doctor/dashboard/:path*",
    "/doctor/patient-listings/:path*",
    "/doctor/merckandmanuals/:path*",
    "/doctor/virtual-visits/:path*",
    "/doctor/drugs-and-medications/:path*",
    "/doctor/prescription-writer/:path*",
    "/doctor/appointments/:path*",
    "/doctor/reports-and-referrals/:path*",
    "/doctor/health-tools/:path*",
    "/doctor/pharma-cme/:path*",
    "/doctor/supply-ordering/:path*",
    "/doctor/billing/:path*",
    "/doctor/med-advisory/:path*",
    "/doctor/my-emr/:path*",
    "/.well-known/assetlinks.json",
  ],
};
