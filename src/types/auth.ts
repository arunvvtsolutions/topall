export type VerfiyOtpPayload = {
  mobileNumber: string;
  otpNumber: string;
  loginTime: Date;
  userTimeZone: string;
  addressCountry: string;
  ipAddress: string;
  location: string;
  deviceName: string;
};

export type LogoutPayload = {
  logoutTime: Date;
  logoutIp: string;
  logoutLocation: string;
  studentId: number;
};

export type Role = {
  id: number;
  role: string;
  name: string;
  avatar: string;
  isActive: boolean;
};

export type VerfiedUserResponse = {
  userId: number;
  joinedData: string;
  name: string;
  mobileNumber: string;
  email: string | null;
  onBoardData: boolean;
  currentExams: any[];
  userTimeZone: string;
  loginCountry: string;
  uuidNumber: string;
  referalCode: string;
  lastLoginTime: string;
  lastLogoutTime: string | null;
  target: string | null;
  isActive: boolean;
  loginDevice: string;
  role: Role;
  state: string | null;
  city: string | null;
  referLevel: number;
  standard: string | null;
  testExpiry: string | null;
  daysExpiry: string | null;
  accessToken: string;
  refreshToken: string;
};
