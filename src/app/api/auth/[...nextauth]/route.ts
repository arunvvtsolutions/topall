import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { getAccessToken, getIpDetails, getUser, verifyOtp } from '@/utils/api/auth';
import { VerfiyOtpPayload } from '@/types/auth';
import { Countrycodes } from '@/components/partials/auth/countrycodes';

const JWT_SECRET = '123456';
const AUTH_SECRET = 'k4eqoc3EKTWg4dbXw5S/in2z33FX/NotZS42mRN3mnc=';
const JWT_MAX_AGE = 7 * 24 * 60 * 60;

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: { phoneNumber: {}, otp: {}, device: {} },
      async authorize(credentials) {
        const ipAddress = await getIpDetails();
        const country = Countrycodes.find((c) => c.flag.toLowerCase() === ipAddress?.country?.toLowerCase());

        const payload: VerfiyOtpPayload = {
          mobileNumber: credentials?.phoneNumber || '',
          otpNumber: credentials?.otp!,
          loginTime: new Date(),
          userTimeZone: ipAddress.timezone,
          addressCountry: country?.name || '',
          ipAddress: ipAddress.ip,
          location: ipAddress.city,
          deviceName: credentials?.device!
        };

        const result = await verifyOtp(payload);
        if (!result.success) throw new Error(result.message);
        if (!result.user) return null;

        return {
          id: result.user.userId,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role.role,
          accessToken: result.user.accessToken,
          refreshToken: result.user.refreshToken,
          mobileNumber: result.user.mobileNumber,
          onboardStatus: result.user.onBoardData,
          referLevel: result.user.referLevel,
          loginCountry: result.user.loginCountry,
          standard: result.user.standard,
          currentExams: result.user.currentExams
        } as any;
      }
    })
  ],
  pages: { signIn: '/login', error: '/auth/otp-verify' },
  session: { strategy: 'jwt' },
  secret: AUTH_SECRET,
  jwt: {
    maxAge: JWT_MAX_AGE,
    secret: JWT_SECRET,
    encode: async ({ token }) => token?.accessToken || '',
    decode: async ({ token }) => {
      try {
        return { ...jwtDecode(token!), accessToken: token } as any;
      } catch {
        return {};
      }
    }
  },
  callbacks: {
    async jwt({ token, account, user }) {
      const cookieStore = cookies();
      if (account) {
        // setting refresh token on signIn
        cookieStore.set('next-auth.refresh-token', user.refreshToken);
        return {
          ...token,
          ...user
        } as any;
      }
      if (Math.floor(Date.now() / 1000) < (token?.exp as any) || 0) {
        const refreshToken = cookieStore.get('next-auth.refresh-token');
        if (!refreshToken) throw new Error('Refresh token is empty');
        const newToken = await getAccessToken(refreshToken.value);
        return { ...token, accessToken: newToken.accessToken };
      }
      return token;
    },
    async session({ session, token }) {
      try {
        const user = await getUser(token.accessToken);
        return {
          expires: session.expires,
          user: {
            id: user.userId,
            name: user.name,
            email: user.email,
            role: user.role.role,
            accessToken: token.accessToken,
            refreshToken: '',
            mobileNumber: user.mobileNumber,
            tokenType: '',
            onboardStatus: user.onBoardData,
            referLevel: user.referLevel,
            loginCountry: user.loginCountry,
            image: '',
            standard: user.standard,
            currentExams: user.currentExams
          }
        };
      } catch {
        return session;
      }
    }
  }
};

export const handler = NextAuth(authOptions) as never;
export { handler as GET, handler as POST };
