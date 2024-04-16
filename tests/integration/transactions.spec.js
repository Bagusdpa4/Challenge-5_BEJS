const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let account

describe("test POST /api/v1/transactions endpoint", () => {
  beforeAll(async () => {
    account = await prisma.account.findMany();
  });

  test("test membuat transaksi baru by account_id -> sukses", async () => {
    try {
      let amount = 10000;
      let source_account_id = account[0].id;
      let destination_account_id = account[1].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ amount, source_account_id, destination_account_id });
      transaction = body.data;
      //   console.log("body", body);
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("amount");
      expect(body.data).toHaveProperty("source_account_id");
      expect(body.data).toHaveProperty("destination_account_id");
      expect(body.data.amount).toBe(amount);
      expect(body.data.source_account_id).toBe(source_account_id);
      expect(body.data.destination_account_id).toBe(destination_account_id);
    } catch (err) {
      throw err;
    }
  });

  test("test membuat transaksi baru by account_id -> error (Input must be required)", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({});
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test membuat transaksi baru by account_id -> error (cannot be same id)", async () => {
    try {
      let amount = 10000;
      let source_account_id = account[0].id;
      let destination_account_id = account[0].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ amount, source_account_id, destination_account_id });
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test membuat transaksi baru by account_id -> error (Balance is insufficient)", async () => {
    try {
      let amount = 1000000;
      let source_account_id = account[1].id;
      let destination_account_id = account[0].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ amount, source_account_id, destination_account_id });
      expect(statusCode).toBe(403);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("test membuat transaksi baru by account_id -> error (account_id not found!)", async () => {
    try {
      let amount = 10000;
      let source_account_id = account[0].id;
      let destination_account_id = account[0].id + 100;
      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ amount, source_account_id, destination_account_id });
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});
