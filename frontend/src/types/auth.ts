export type UserRole = "super_admin" | "admin" | "manager" | "analyst" | "viewer";

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: "auth" | "sales" | "customers" | "products" | "inventory" | "analytics" | "reports" | "settings";
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  companyId: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  tier: "growth" | "enterprise" | "custom";
  isActive: boolean;
  createdAt: string;
}

export interface UserSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // UNIX epoch milliseconds
  user: User;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  requiresTwoFactor: boolean;
  mfaToken?: string;
}

export interface MfaVerificationRequest {
  code: string;
  mfaToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}
