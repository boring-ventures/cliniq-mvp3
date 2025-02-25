import { PrismaClient, RoleEnum } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create a super admin user if it doesn't exist
  await createSuperAdminUser();

  console.log("Seed completed successfully!");
}

async function createSuperAdminUser() {
  const email = "admin@cliniq.com";
  const password = "Admin@123"; // This should be changed after first login

  // Check if user already exists
  const existingUser = await prisma.profile.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("Super admin user already exists");
    return existingUser;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  console.log("Creating super admin user");
  const user = await prisma.profile.create({
    data: {
      email,
      hashedPassword,
      firstName: "System",
      lastName: "Administrator",
      role: RoleEnum.SUPER_ADMIN,
      isActive: true,
      userId: email,
    },
  });

  return user;
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
