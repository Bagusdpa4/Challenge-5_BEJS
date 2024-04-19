const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let user;
let account;
let transaction;
let newAccount;

describe("test POST /api/v1/transactions endpoint", () => {
  beforeAll(async () => {
    account = await prisma.account.findMany();
    user = await prisma.user.findMany();
    try {
      let bank_name = "BCA";
      let bank_account_number = "21082010123";
      let balance = 1000000;
      let user_id = user[0].id;

      const { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, user_id });

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      
      newAccount = body.data;
    } catch (err) {
      throw err;
    }
  });

  test("test membuat transaksi baru by account_id -> sukses", async () => {
    try {
      let amount = 10000;
      let source_account_id = account[0].id;
      let destination_account_id = newAccount.id;
      
      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ amount, source_account_id, destination_account_id });
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

  test("test membuat transaksi baru by account_id -> error (Balance is insufficient)", async () => {
    try {
      let amount = 50000000;
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

describe("test GET /api/v1/transactions endpoint", () => {
  test("test menampilkan semua transactions yang sudah terdaftar -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get("/api/v1/transactions");
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("amount");
      expect(body.data[0]).toHaveProperty("source_account_id");
      expect(body.data[0]).toHaveProperty("destination_account_id");
    } catch (err) {
      throw err;
    }
  });
});

describe("test GET /api/v1/transactions/:id endpoint", () => {
  beforeAll(async () => {
    transaction = await prisma.transaction.findMany();
  });
  test("test menampilkan detail transaction by id -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/transactions/${transaction[0].id}`
      );
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("amount");
      expect(body.data).toHaveProperty("source_account_id");
      expect(body.data).toHaveProperty("destination_account_id");
      expect(body.data).toHaveProperty("sourceAccount");
      expect(body.data.sourceAccount).toHaveProperty("id");
      expect(body.data.sourceAccount).toHaveProperty("bank_name");
      expect(body.data.sourceAccount).toHaveProperty("bank_account_number");
      expect(body.data.sourceAccount).toHaveProperty("balance");
      expect(body.data.sourceAccount).toHaveProperty("user_id");
      expect(body.data).toHaveProperty("destinationAccount");
      expect(body.data.destinationAccount).toHaveProperty("id");
      expect(body.data.destinationAccount).toHaveProperty("bank_name");
      expect(body.data.destinationAccount).toHaveProperty("bank_account_number");
      expect(body.data.destinationAccount).toHaveProperty("balance");
      expect(body.data.destinationAccount).toHaveProperty("user_id");
    } catch (err) {
      throw err;
    }
  });

  test("test menampilkan detail transaction by id -> error (not found)", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/transactions/${transaction[0].id + 100}`
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

describe("test DELETE /api/v1/transactions/:id endpoint", () => {
    beforeAll(async () => {
        transaction = await prisma.transaction.findMany();
      });
    // test("test menghapus transactions by id -> sukses", async () => {
    //   try {
    //     let { statusCode, body } = await request(app).delete(
    //       `/api/v1/transactions/${transaction[0].id}`
    //     );
    //     expect(statusCode).toBe(200);
    //     expect(body).toHaveProperty("status");
    //     expect(body).toHaveProperty("message");
    //     expect(body).toHaveProperty("data");
    //   } catch (err) {
    //     throw err;
    //   }
    // });

  test("test menghapus transactions by id -> error (not found)", async () => {
    try {
      let { statusCode, body } = await request(app).delete(
        `/api/v1/transactions/${transaction[0].id + 100}`
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
