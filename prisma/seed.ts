import { PrismaClient, Role, PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Create or update Default Super Admin User
  const adminEmail = "admin@aboi.org";
  const passwordHash = await bcrypt.hash("AdminPass123!", 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
    },
    create: {
      email: adminEmail,
      name: "Super Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email} (ID: ${admin.id})`);

  // 2. Create Default NGO Pillars
  const pillars = [
    {
      slug: "education",
      title: "Education & Literacy",
      description: "Empowering children and youth with access to quality education, learning resources, and modern school facilities.",
      icon: "GraduationCap",
      order: 1,
    },
    {
      slug: "health",
      title: "Health & Wellness",
      description: "Providing essential medical outreach, preventive healthcare, and maternal care to underserved communities.",
      icon: "HeartPulse",
      order: 2,
    },
    {
      slug: "agriculture",
      title: "Sustainable Agriculture",
      description: "Supporting local farmers with modern eco-friendly agricultural tools, training, and food security programs.",
      icon: "Sprout",
      order: 3,
    },
    {
      slug: "community",
      title: "Community Outreach",
      description: "Fostering social development, clean water projects, and economic empowerment for local families.",
      icon: "Users",
      order: 4,
    },
  ];

  for (const pillar of pillars) {
    await prisma.pillar.upsert({
      where: { slug: pillar.slug },
      update: pillar,
      create: pillar,
    });
  }
  console.log(`✅ Seeded ${pillars.length} NGO pillars.`);

  // 3. Create Initial Blog Posts
  const samplePosts = [
    {
      slug: "new-educational-center-opening",
      title: "New Educational Center Opening in Benin",
      excerpt: "ABOI NGO proudly announces the opening of a state-of-the-art educational facility for local youth.",
      content: "<p>We are thrilled to celebrate the launch of our newest educational center. This facility will serve over 500 children every year with digital access, books, and trained teachers.</p>",
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date("2024-05-12"),
      viewsCount: 1420,
    },
    {
      slug: "community-outreach-program-highlights",
      title: "Community Outreach Program Highlights",
      excerpt: "A recap of our recent health and nutrition drive serving over 1,200 families.",
      content: "<p>Our volunteers dedicated over 200 hours last month distributing food baskets, clean water kits, and basic medical checkups.</p>",
      status: PostStatus.DRAFT,
      authorId: admin.id,
      publishedAt: null,
      viewsCount: 0,
    },
    {
      slug: "annual-charity-gala-2024",
      title: "Annual Charity Gala 2024",
      excerpt: "Join us in celebrating community achievements and fundraising for upcoming 2025 initiatives.",
      content: "<p>The annual charity gala brought together leaders, donors, and partners to support sustainable development across West Africa.</p>",
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date("2024-04-28"),
      viewsCount: 3890,
    },
  ];

  for (const post of samplePosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log(`✅ Seeded ${samplePosts.length} sample blog posts.`);

  // 4. Create Initial Site Settings
  const settings = [
    { key: "org_name", value: "ABOI NGO" },
    { key: "contact_email", value: "contact@aboi-ngo.org" },
    { key: "contact_phone", value: "+229 97 00 00 00" },
    { key: "maintenance_mode", value: "false" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✅ Seeded ${settings.length} site settings.`);

  console.log("🎉 Database seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
