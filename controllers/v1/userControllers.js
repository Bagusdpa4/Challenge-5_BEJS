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
        return res.status(403).json({
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

      await prisma.profile.deleteMany({
        where: { user_id: id },
      });

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
