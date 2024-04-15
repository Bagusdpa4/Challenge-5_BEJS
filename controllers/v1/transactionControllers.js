const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  store: async (req, res, next) => {
    try {
      const { amount, source_account_id, destination_account_id } = req.body;

      const sourceAccount = await prisma.account.findUnique({
        where: { id: source_account_id },
      });
      const destinationAccount = await prisma.account.findUnique({
        where: { id: destination_account_id },
      });

      if (!sourceAccount || !destinationAccount) {
        if (!sourceAccount) {
          return res.status(404).json({
            status: false,
            message: `Source account with account_id = ${source_account_id} not found`,
            data: null,
          });
        } else {
          return res.status(404).json({
            status: false,
            message: `Destination account with account_id = ${destination_account_id} not found`,
            data: null,
          });
        }
      }

      if (sourceAccount.balance < amount) {
        return res.status(400).json({
          status: false,
          message: "The balance in the source account is insufficient",
          data: null,
        });
      }

      const transaction = await prisma.transaction.create({
        data: {
          amount,
          source_account_id,
          destination_account_id,
        },
      });

      await prisma.account.update({
        where: { id: source_account_id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
      await prisma.account.update({
        where: { id: destination_account_id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      res.status(201).json({
        status: true,
        message: "Transaction created successfully",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      const transactions = await prisma.transaction.findMany();
      res.status(200).json({
        status: true,
        message: "success",
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          sourceAccount : true,
          destinationAccount : true
        }
      });

      if (!transaction) {
        return res.status(404).json({
          status: false,
          message: `Transaction with id ${id} not found`,
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: "success",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
  
      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });
  
      if (!transaction) {
        return res.status(404).json({
          status: false,
          message: `Transaction with id ${id} not found`,
          data: null,
        });
      }
  
      await prisma.transaction.delete({
        where: { id },
      });
  
      res.status(200).json({
        status: true,
        message: `Transaction with id ${id} has been deleted successfully`,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
  
};
