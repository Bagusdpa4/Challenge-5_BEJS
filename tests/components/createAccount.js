const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createUser = require("./createUser");

async function createAccount() {
  const userId = await createUser();
  try {
    const accountsData = [
      {
        bank_name: "BNI",
        bank_account_number: "21082010300",
        balance: 1000000,
        user_id: userId[0],
      },
      {
        bank_name: "BCA",
        bank_account_number: "21082010200",
        balance: 500000,
        user_id: userId[1],
      },
    ];

    const createdAccounts = await Promise.all(
      accountsData.map((accountData) =>
        prisma.account.create({ data: accountData })
      )
    );

    return createdAccounts.map((account) => account.id);
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = createAccount;
