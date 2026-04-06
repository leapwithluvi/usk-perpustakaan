import {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  extractTokenFromHeader,
} from "../jwt";

describe("JWT Utility", () => {
  const payload = { id: "user-123", email: "test@example.com", role: ["USER"] };

  describe("AccessToken", () => {
    it("should generate and verify a valid access token", () => {
      const token = generateAccessToken(payload as any);
      const decoded = verifyAccessToken(token);

      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });
  });

  describe("RefreshToken", () => {
    it("should generate and verify a valid refresh token", () => {
      const token = generateRefreshToken(payload as any);
      const decoded = verifyRefreshToken(token);

      expect(decoded.id).toBe(payload.id);
    });
  });

  describe("extractTokenFromHeader", () => {
    it("should extract token from Bearer header", () => {
      const header = "Bearer my-token";
      expect(extractTokenFromHeader(header)).toBe("my-token");
    });

    it("should return null for invalid header format", () => {
      expect(extractTokenFromHeader("InvalidHeader my-token")).toBeNull();
      expect(extractTokenFromHeader(undefined)).toBeNull();
      expect(extractTokenFromHeader("Bearer")).toBeNull();
    });
  });
});
