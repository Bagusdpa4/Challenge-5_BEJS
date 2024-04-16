const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let users = {};

describe("test POST /api/v1/accounts endpoint", () => {
  beforeAll(async () => {
    users = await prisma.user.findMany();
  });

  test("test membuat account baru by user_id -> sukses", async () => {
    try {
        if (users.length === 0) {
            throw new Error("No users found");
          }
      let bank_name = "BNI";
      let bank_account_number = "21082010195";
      let balance = 100000;
      let user_id = users[0].id;

      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, user_id });
      // console.log("body", body);
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
});
