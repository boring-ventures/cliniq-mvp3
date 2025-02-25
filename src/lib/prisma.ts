import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with logging in development
const prismaClientSingleton = () => {
  try {
    const client = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });

    // Add middleware for error logging
    client.$use(async (params, next) => {
      try {
        return await next(params);
      } catch (error) {
        console.error(
          `Prisma error in ${params.model}.${params.action}:`,
          error
        );
        throw error;
      }
    });

    return client;
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    throw error;
  }
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
