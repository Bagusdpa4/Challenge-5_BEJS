const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  store: async (req, res, next) => {
    try {
      const { name, email, password, identity_type, identity_number, address } =
        req.body;

      const exist = await prisma.user.findFirst({
        where: { email },
      });

      if (
        !name ||
        !email ||
        !password ||
        !identity_type ||
        !identity_number ||
        !address
      ) {
        return res.status(401).json({
          status: false,
          message: "Input must be required",
          data: null,
        });
      } else if (exist) {
        return res.status(400).json({
          status: false,
          message: "Email already used!",
        });
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          profiles: {
            create: { identity_type, identity_number, address },
          },
        },
        include: {
          profiles: true,
        },
      });

      res.status(201).json({
        status: true,
        message: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      const { search } = req.query;
      
      const users = await prisma.user.findMany({
        where: { name: { contains: search, mode: "insensitive" } },
      });
      res.status(200).json({
        status: true,
        message: "success",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          profiles: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: `User with id ${id} not found`,
          data: null,
        });
      }
      res.status(200).json({
        status: true,
        message: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const { name, email, password, identity_type, identity_number, address } =
        req.body;

      if (
        !name &&
        !email &&
        !password &&
        !identity_type &&
        !identity_number &&
        !address
      ) {
        return res.status(400).json({
          status: false,
          message: "At least one data must be provided for update",
          data: null,
        });
      }

      const exist = await prisma.user.findUnique({
        where: { id },
      });

      if (!exist) {
        return res.status(404).json({
          status: false,
          message: `User with id ${id} not found`,
          data: null,
        });
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          password,
          profiles: {
            update: { identity_type, identity_number, address },
          },
        },
        include: {
          profiles: true,
        },
      });
      res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const exist = await prisma.user.findUnique({
        where: { id },
      });

      if (!exist) {
        return res.status(404).json({
          status: false,
          message: `User with id ${id} not found`,
          data: null,
        });
      }

      // Cek apakah pengguna memiliki akun bank
      const userAccounts = await prisma.account.findMany({
        where: { user_id: id },
      });
  
      // Jika pengguna memiliki akun bank
      if (userAccounts.length > 0) {
        // Cek apakah ada riwayat transaksi
        const relatedTransactions = await prisma.transaction.findMany({
          where: {
            OR: [
              { source_account_id: { in: userAccounts.map(account => account.id) } },
              { destination_account_id: { in: userAccounts.map(account => account.id) } },
            ],
          },
        });
  
        // Jika ada riwayat transaksi, hapus riwayat tersebut
        if (relatedTransactions.length > 0) {
          await prisma.transaction.deleteMany({
            where: {
              OR: [
                { source_account_id: { in: userAccounts.map(account => account.id) } },
                { destination_account_id: { in: userAccounts.map(account => account.id) } },
              ],
            },
          });
        }
  
        // Hapus akun bank dari pengguna
        await prisma.account.deleteMany({
          where: { user_id: id },
        });
      }
  
      // Hapus profil pengguna
      await prisma.profile.deleteMany({
        where: { user_id: id },
      });

      // Hapus pengguna itu sendiri
      await prisma.user.delete({
        where: { id },
      });

      res.status(200).json({
        status: true,
        message: "User deleted successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
