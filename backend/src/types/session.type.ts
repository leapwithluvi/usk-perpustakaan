export interface CreateSessionData {
  userId: string;
  refreshToken: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  expiresAt: Date;
}

export interface UpdateSessionData {
  refreshToken?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  expiresAt?: Date;
}
