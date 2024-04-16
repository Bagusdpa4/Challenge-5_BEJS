const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let user = {}

describe("test POST /api/v1/users endpoint", () => {
  // beforeAll(async () => {
  //   await prisma.transaction.deleteMany();
  //   await prisma.account.deleteMany();
  //   await prisma.profile.deleteMany();
  //   await prisma.user.deleteMany();
  // });

  test("test email belum terdaftar -> sukses", async () => {
    try {
      let name = "Dummy";
      let email = "Dummy@gmail.com";
      let password = "password123";
      let identity_type = "KTP";
      let identity_number = "77777";
      let address = "Jalan Kebenaran";
      let { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({name,email,password,identity_type,identity_number,address,});
      user = body.data
      // console.log("body", body);
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("profiles");
      expect(body.data.profiles).toHaveProperty("id");
      expect(body.data.profiles).toHaveProperty("identity_type");
      expect(body.data.profiles).toHaveProperty("identity_number");
      expect(body.data.profiles).toHaveProperty("address");
      expect(body.data.profiles).toHaveProperty("user_id");
      expect(body.data.name).toBe(name);
      expect(body.data.email).toBe(email);
      expect(body.data.password).toBe(password);
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
        .post("/api/v1/users")
        .send({name,email,password,identity_type,identity_number,address,});

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });
  test("test inputan ada yang tidak diisi -> error", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({});

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

describe("test GET /api/v1/users endpoint", () => {
  test("test menampilkan semua users yang sudah terdaftar -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get("/api/v1/users");
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("name");
      expect(body.data[0]).toHaveProperty("email");
      expect(body.data[0]).toHaveProperty("password");
    } catch (err) {
      throw err;
    }
  });
});

describe("test GET /api/v1/users/:id endpoint", () => {
  test("test menampilkan detail users by id -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/users/${user.id}`);
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("profiles");
      expect(body.data.profiles).toHaveProperty("id");
      expect(body.data.profiles).toHaveProperty("identity_type");
      expect(body.data.profiles).toHaveProperty("identity_number");
      expect(body.data.profiles).toHaveProperty("address");
      expect(body.data.profiles).toHaveProperty("user_id");
    } catch (err) {
      throw err;
    }
  });

  test("test menampilkan detail users by id -> error", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/users/${user.id + 100}`);
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

describe("test PUT /api/v1/users/:id endpoint", () => {
  test("test update data users -> sukses", async () => {
    try {
      let name = "usertest1";
      let password = "password123";
      let { statusCode, body } = await request(app)
        .put(`/api/v1/users/${user.id}`)
        .send({name,password,});

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("profiles");
      expect(body.data.profiles).toHaveProperty("id");
      expect(body.data.profiles).toHaveProperty("identity_type");
      expect(body.data.profiles).toHaveProperty("identity_number");
      expect(body.data.profiles).toHaveProperty("address");
      expect(body.data.profiles).toHaveProperty("user_id");
      expect(body.data.name).toBe(name);
      expect(body.data.password).toBe(password);
    } catch (err) {
      throw err;
    }
  });

  test("test update data users -> error (one data must be provided)", async () => {
    try {
      let { statusCode, body } = await request(app).put(`/api/v1/users/${user.id}`).send({});
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test update data users -> error (not found)", async () => {
    try {
      let name = "usertest1";
      let { statusCode, body } = await request(app).put(`/api/v1/users/${user.id + 100}`).send({name});
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

describe("test DELETE /api/v1/users/:id endpoint", () => {
  test("test menghapus users by id -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).delete(`/api/v1/users/${user.id}`);
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test menghapus users by id -> error (not found)", async () => {
    try {
      let { statusCode, body } = await request(app).delete(`/api/v1/users/${user.id + 100}`);
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});