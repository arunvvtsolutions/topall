import { DefaultSession, DefaultUser } from 'next-auth';
import { Roles } from './enum';

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      id: number;
      mobileNumber: string;
      role: Roles;
      tokenType: string;
      onboardStatus: 0 | 1;
      referLevel: number;
      loginCountry: string;
      standard: { streamId: number; standard: { id: number; name: string } }[];
      currentExams: { id: number; name: string }[];
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    id: number;
    mobileNumber: string;
    role: Roles;
    tokenType: string;
    userName: string | null;
    onboardStatus: 0 | 1;
    referLevel: number;
    loginCountry: string;
    standard: { id: number; name: string };
    currentExams: { id: number; name: string }[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    id: number;
    mobileNumber: string;
    role: Roles;
    tokenType: string;
    userName: string | null;
    onboardStatus: 0 | 1;
    referLevel: number;
    loginCountry: string;
    standard: { id: number; name: string };
    currentExams: { id: number; name: string }[];
  }
}
