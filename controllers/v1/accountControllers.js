const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  register: async (req, res, next) => {
    try {
      const { bank_name, bank_account_number, balance, user_id } = req.body;

      if (!bank_name || !bank_account_number || !user_id) {
        return res.status(400).json({
          status: false,
          message: "Input must be required",
          data: null,
        });
      } else if (!balance || balance < 50000) {
        return res.status(403).json({
          status: false,
          message: "Balance must be at least 50000",
          data: null,
        });
      } 

      const existingNumAccount = await prisma.account.findFirst({
        where: { bank_account_number },
      });
  
      if (existingNumAccount) {
        return res.status(401).json({
          status: false,
          message: "Bank account number already exists",
          data: null,
        });
      }

      const existId = await prisma.user.findUnique({
        where: { id: user_id },
      });

      if (!existId) {
        return res.status(404).json({
          status: false,
          message: `User with id ${user_id} not found`,
          data: null,
        });
      }

      const account = await prisma.account.create({
        data: {
          bank_name,
          bank_account_number,
          balance,
          user: { connect: { id: user_id } },
        },
      });

      res.status(201).json({
        status: true,
        message: "success",
        data: account,
      });
    } catch (error) {
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      const { search } = req.query;

      const accounts = await prisma.account.findMany({
        where: { bank_name: {contains: search, mode: "insensitive" } }
      });
      res.status(200).json({
        status: true,
        message: "success",
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const accounts = await prisma.account.findUnique({
        where: { id },
        include: {
          user: {
            include: {
              profiles: true,
            },
          },
        },
      });

      if (!accounts) {
        return res.status(404).json({
          status: false,
          message: `Account with id ${id} not found`,
          data: null,
        });
      }
      res.status(200).json({
        status: true,
        message: "success",
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const account = await prisma.account.findUnique({
        where: { id },
      });

      if (!account) {
        return res.status(404).json({
          status: false,
          message: `Account with id ${id} not found`,
          data: null,
        });
      }

      await prisma.transaction.deleteMany({
        where: {
          OR: [{ source_account_id: id }, { destination_account_id: id }],
        },
      });

      await prisma.account.delete({
        where: { id },
      });

      res.status(200).json({
        status: true,
        message: "Account deleted successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
