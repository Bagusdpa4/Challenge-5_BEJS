const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let token = "";
let user

describe("test POST /api/v1/auth/register endpoint", () => {
  beforeAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });
  test("test email belum terdaftar -> sukses", async () => {
    try {
      let name = "Dummy";
      let email = "Dummy@gmail.com";
      let password = "password123";
      let identity_type = "KTP";
      let identity_number = "77777";
      let address = "Jalan Kebenaran";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name,
          email,
          password,
          identity_type,
          identity_number,
          address,
        });
      user = body.data;
      // console.log("body", body);
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("profiles");
      expect(body.data.profiles).toHaveProperty("id");
      expect(body.data.profiles).toHaveProperty("identity_type");
      expect(body.data.profiles).toHaveProperty("identity_number");
      expect(body.data.profiles).toHaveProperty("address");
      expect(body.data.profiles).toHaveProperty("user_id");
      expect(body.data.name).toBe(name);
      expect(body.data.email).toBe(email);
      expect(body.data.profiles.identity_type).toBe(identity_type);
      expect(body.data.profiles.identity_number).toBe(identity_number);
      expect(body.data.profiles.address).toBe(address);
    } catch (err) {
      throw err;
    }
  });
  test("test email sudah terdaftar -> error", async () => {
    try {
      let name = "Dummy";
      let email = "Dummy@gmail.com";
      let password = "password123";
      let identity_type = "KTP";
      let identity_number = "77777";
      let address = "Jalan Kebenaran";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name,
          email,
          password,
          identity_type,
          identity_number,
          address,
        });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
  test("test inputan ada yang tidak diisi -> error", async () => {
    try {
      let name = "coba";
      let email = "coba@gmail.com";
      let password = "password123";
      let identity_type = "KTP";
      let identity_number = "77777";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({ name, email, password, identity_type, identity_number });

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

describe("test POST /api/v1/auth/login endpoint", () => {
  test("test login user -> sukses", async () => {
    try {
      let email = "Dummy@gmail.com";
      let password = "password123";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email,
          password,
        });
      token = body.data.token;
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("token");
    } catch (err) {
      throw err;
    }
  });

  test("test inputan ada yang tidak diisi -> error", async () => {
    try {
      let email = "";
      let password = "";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/login")
        .send({email, password});

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

describe("test GET /api/v1/auth/authenticate endpoint", () => {
  test("test auth dengan bearer -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app)
        .get("/api/v1/auth/authenticate")
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
    } catch (err) {
      throw err;
    }
  });

  test("test auth dengan bearer -> error", async () => {
    try {
      let { statusCode, body } = await request(app)
        .get("/api/v1/auth/authenticate")
        .set("Authorization", `Bearer ${"token"}`);
      expect(statusCode).toBe(409);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test auth dengan bearer -> error", async () => {
    try {
      let token2 = ""
      let { statusCode, body } = await request(app)
        .get("/api/v1/auth/authenticate")
        .set("Authorization", `Bearer ${token2}`);
      expect(statusCode).toBe(403);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});
