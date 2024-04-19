const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let user
let account 

describe("test POST /api/v1/accounts endpoint", () => {
  beforeAll(async () => {
    user = await prisma.user.findMany();
  });

  test("test membuat account baru by user_id -> sukses", async () => {
    try {
      let bank_name = "BNI";
      let bank_account_number = "21082010195";
      let balance = 1000000;
      let user_id = user[0].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, user_id });
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("user_id");
      expect(body.data.bank_name).toBe(bank_name);
      expect(body.data.bank_account_number).toBe(bank_account_number);
      expect(body.data.balance).toBe(balance);
      expect(body.data.user_id).toBe(user_id);
    } catch (err) {
      throw err;
    }
  });

  test("test membuat account baru by user_id -> error (input must be required)", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({});
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test membuat account baru by user_id -> error (Bank account number already exists)", async () => {
    try {
      let bank_name = "BNI";
      let bank_account_number = "21082010195";
      let balance = 100000;
      let user_id = user[0].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, user_id });
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test membuat account baru by user_id -> error (user_id not found)", async () => {
    try {
      let bank_name = "BNI";
      let bank_account_number = "21082010100";
      let balance = 100000;
      let user_id = user[0].id + 100;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, user_id });
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

describe("test GET /api/v1/accounts endpoint", () => {
  test("test menampilkan semua accounts yang sudah terdaftar -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get("/api/v1/accounts");
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("bank_name");
      expect(body.data[0]).toHaveProperty("bank_account_number");
      expect(body.data[0]).toHaveProperty("balance");
      expect(body.data[0]).toHaveProperty("user_id");
    } catch (err) {
      throw err;
    }
  });
});

describe("test GET /api/v1/accounts/:id endpoint", () => {
  beforeAll(async () => {
    account = await prisma.account.findMany();
  });
  test("test menampilkan detail account by id -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/accounts/${account[0].id}`
      );
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("user_id");
      expect(body.data).toHaveProperty("user");
      expect(body.data.user).toHaveProperty("id");
      expect(body.data.user).toHaveProperty("name");
      expect(body.data.user).toHaveProperty("email");
      expect(body.data.user).toHaveProperty("profiles");
      expect(body.data.user.profiles).toHaveProperty("id");
      expect(body.data.user.profiles).toHaveProperty("identity_type");
      expect(body.data.user.profiles).toHaveProperty("identity_number");
      expect(body.data.user.profiles).toHaveProperty("address");
      expect(body.data.user.profiles).toHaveProperty("user_id");
    } catch (err) {
      throw err;
    }
  });

  test("test menampilkan detail account by id -> error (not found)", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/accounts/${account[0].id + 100}`
      );
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

describe("test DELETE /api/v1/accounts/:id endpoint", () => {
  beforeAll(async () => {
    account = await prisma.account.findMany();
  });
  // test("test menghapus accounts by id -> sukses", async () => {
  //   try {
  //     let { statusCode, body } = await request(app).delete(
  //       `/api/v1/accounts/${account[0].id}`
  //     );
  //     expect(statusCode).toBe(200);
  //     expect(body).toHaveProperty("status");
  //     expect(body).toHaveProperty("message");
  //     expect(body).toHaveProperty("data");
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  test("test menghapus accounts by id -> error (not found)", async () => {
    try {
      let { statusCode, body } = await request(app).delete(
        `/api/v1/accounts/${account[0].id + 100}`
      );
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});
