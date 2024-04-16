const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createUser() {
  try {
    const usersData = [
      {
        name: "User 1",
        email: "user1@gmail.com",
        password: "password123",
        profiles: {
          create: {
            identity_type: "KTP",
            identity_number: "1234567890",
            address: "Jalan Pahlawan No. 123",
          },
        },
      },
      {
        name: "User 2",
        email: "user2@gmail.com",
        password: "password456",
        profiles: {
          create: {
            identity_type: "SIM",
            identity_number: "0987654321",
            address: "Jalan Merdeka No. 456",
          },
        },
      },
    ];

    const createdUsers = await Promise.all(
      usersData.map(userData => prisma.user.create({ data: userData }))
    );

    return createdUsers.map(user => user.id);
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = createUser;
