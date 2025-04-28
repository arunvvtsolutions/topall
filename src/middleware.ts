// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    // const role = request.nextauth.token?.role as string
    const role = request.cookies.get('role')?.value; // Get the 'role' cookie

    // Redirect non-users away from /user routes
    if (url.pathname.startsWith('/user') && role !== 'user') {
      url.pathname = '/'; // Redirect to home page
      return NextResponse.redirect(url);
    }

    return NextResponse.next(); // Allow request if no conditions matched
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    secret: process.env.NEXTAUTH_SECRET
  }
);

export const config = {
  matcher: [] // Apply middleware to /admin and /user routes only
};
