import { PrismaClient, Role } from "../src/generated/client";
import bcrypt from "bcryptjs";

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient(
  connectionString
    ? {
        datasources: {
          db: {
            url: connectionString,
          },
        },
      }
    : undefined
);

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@aboi.org";
  const password = process.env.ADMIN_PASSWORD || "AdminPass123!";
  const name = process.env.ADMIN_NAME || "Super Admin";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
    create: {
      email,
      name,
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log("==========================================");
  console.log("✅ Admin Account Successfully Created / Updated!");
  console.log(`📧 Email:    ${admin.email}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`👤 Name:     ${admin.name}`);
  console.log(`🛡️ Role:     ${admin.role}`);
  console.log(`🆔 ID:       ${admin.id}`);
  console.log("==========================================");
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin account:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
