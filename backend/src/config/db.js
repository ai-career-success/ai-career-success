const { PrismaClient } = require("@prisma/client");

// Singleton Prisma Client instance to avoid multiple instances across reloads
const prisma = global.__prismaInstance || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  global.__prismaInstance = prisma;
}

// Friendly alias so both prisma.user and prisma.users work
if (!prisma.users) {
  prisma.users = prisma.user;
}

async function disconnect() {
  await prisma.$disconnect();
}

// Support both const { prisma } = require(...) and const prisma = require(...)
prisma.prisma = prisma;
prisma.disconnect = disconnect;

module.exports = prisma;
