import request from "supertest";
import app from "../app";

describe("App Integration Tests", () => {
  it("should return 404 for unknown routes", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body.error).toHaveProperty(
      "message",
      `Endpoint GET /unknown-route not found`
    );
  });

  it("should have security headers (helmet)", async () => {
    const response = await request(app).get("/api");
    expect(response.headers).toHaveProperty(
      "x-content-type-options",
      "nosniff"
    );
    expect(response.headers).toHaveProperty("x-dns-prefetch-control", "off");
  });
});
