import { PrismaClient, Role, PostStatus } from "../src/generated/client";
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

  // 3. Create Expanded Blog & News Posts
  const samplePosts = [
    {
      slug: "clean-water-initiative-reaches-10-villages",
      title: "Clean Water Initiative Reaches 10 New Villages in Rural Benin",
      excerpt: "Our latest ecological health drive successfully installed solar-powered water filtration systems in rural communities.",
      content: `<p>We are proud to announce the completion of our latest clean water project, bringing safe, solar-filtered drinking water to over 8,000 residents across 10 rural villages.</p><h2>Project Milestones</h2><ul><li><p>Installed 10 solar-powered filtration pumps.</p></li><li><p>Trained 30 local water management committee members.</p></li><li><p>Reduced waterborne illness cases by an estimated 65% in targeted regions.</p></li></ul><p>Clean water is a fundamental right. Through generous donor support and community collaboration, we continue to build sustainable infrastructure that saves lives.</p>`,
      category: "Healthcare",
      coverImage: "/assets/water_tank.png",
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date("2026-07-28"),
      viewsCount: 1420,
    },
    {
      slug: "annual-science-excellence-awards-2026",
      title: "Annual Science & Academic Excellence Awards 2026",
      excerpt: "Celebrating the outstanding academic achievements of over 500 scholars supported by the ABOI NGO educational fund.",
      content: `<p>This week, ABOI NGO hosted its 2026 Science Excellence Ceremony, honoring top-performing students from secondary schools and university scholarship recipients.</p><h2>Key Highlights</h2><p>Over 500 scholars received merit grants, digital learning devices, and mentorship pledges from regional university professors.</p>blockquote>Investing in education and scientific literacy is the single most effective way to empower the next generation.</blockquote><p>We extend our deepest gratitude to all our partner institutions and patrons who made this milestone possible.</p>`,
      category: "Education",
      coverImage: "/assets/3-woman-serving-food.jpeg",
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date("2026-07-20"),
      viewsCount: 2150,
    },
    {
      slug: "interfaith-symposium-regional-cohesion",
      title: "Interfaith Dialogue Symposium for Regional Peace & Cohesion",
      excerpt: "A landmark symposium bringing together community leaders to draft a unified charter for lasting peace and solidarity.",
      content: `<p>In collaboration with local civic organizations, ABOI NGO convened over 120 community and religious representatives in Cotonou for a two-day conference focused on interfaith harmony and social cohesion.</p><h2>Key Resolutions</h2><ul><li><p>Establishment of local youth peace councils.</p></li><li><p>Joint community development programs across diverse neighborhoods.</p></li><li><p>Creation of an emergency civic mediation committee.</p></li></ul><p>Building peace requires active listening, mutual respect, and shared goals for social development.</p>`,
      category: "Social Impact",
      coverImage: "/assets/prayer.png",
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date("2026-07-15"),
      viewsCount: 980,
    },
    {
      slug: "maternal-health-clinic-launch-akpakpa",
      title: "Mobile Maternal Health Clinic Launched in Akpakpa",
      excerpt: "A new mobile clinic initiative providing free prenatal care, ultrasounds, and essential medicine to expectant mothers.",
      content: `<p>Ensuring access to healthcare during pregnancy is vital for reducing infant and maternal mortality. ABOI NGO has officially deployed its first fully equipped mobile healthcare van in Akpakpa.</p><h2>Services Offered</h2><ul><li><p>Free weekly prenatal consultations and checkups.</p></li><li><p>Ultrasound scans performed by certified midwives.</p></li><li><p>Distribution of vital maternal vitamins and iron supplements.</p></li></ul><p>The mobile clinic will visit underserved urban neighborhoods three times a week.</p>`,
      category: "Healthcare",
      coverImage: "/assets/water-tank.jpeg",
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date("2026-07-04"),
      viewsCount: 1750,
    },
    {
      slug: "sustainable-farming-workshop-benin",
      title: "Press Release: Eco-Friendly Agricultural Workshop Empowers 300 Farmers",
      excerpt: "ABOI NGO concludes its intensive 4-week sustainable agricultural training for smallholder farming collectives.",
      content: `<p><strong>COTONOU, BENIN</strong> — ABOI NGO is pleased to announce the successful conclusion of the 2026 Sustainable Farming Workshop, empowering 300 smallholder farmers with organic soil enhancement techniques and climate-resilient crop management.</p><h2>Program Outcomes</h2><ul><li><p>Distribution of 5,000 drought-resistant seed packages.</p></li><li><p>Hands-on drip irrigation installation workshops.</p></li><li><p>Direct linking of farming cooperatives to urban markets.</p></li></ul><p>Sustainable agriculture ensures food security while preserving the natural ecosystem for future generations.</p>`,
      category: "Press Releases",
      coverImage: "/assets/rice.png",
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date("2026-06-25"),
      viewsCount: 3100,
    },
    {
      slug: "youth-digital-skills-bootcamp-2026",
      title: "Empowering 200 Youth through Free Digital Skills & Coding Bootcamp",
      excerpt: "Young adults complete a 3-month intensive web development and digital literacy course organized by ABOI NGO.",
      content: `<p>Bridging the digital divide is central to ABOI NGO's educational mandate. Today marked the graduation of 200 young adults who completed our intensive 12-week technology bootcamp.</p><h2>Curriculum & Accomplishments</h2><ul><li><p>HTML, CSS, JavaScript, and Web Development fundamentals.</p></li><li><p>Digital marketing and freelance platform onboarding.</p></li><li><p>Career readiness and interview preparation.</p></li></ul><p>Graduates gained practical expertise positioning them for employment and remote freelance opportunities.</p>`,
      category: "Education",
      coverImage: "/assets/woman_with_food.png",
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date("2026-06-14"),
      viewsCount: 1640,
    },
    {
      slug: "disaster-relief-distribution-flood-season",
      title: "Emergency Relief Flood Response Reaches Affected Households",
      excerpt: "Providing emergency shelter materials, dry rations, and hygiene kits to families affected by recent seasonal flooding.",
      content: `<p>Following heavy seasonal rainfall, ABOI NGO's rapid response teams dispatched emergency aid packages to over 450 displaced families in vulnerable coastal areas.</p><h2>Relief Package Contents</h2><ul><li><p>Waterproof tarpaulins and heavy blankets.</p></li><li><p>Emergency food rations (rice, oil, grains, canned food).</p></li><li><p>Hygiene kits and water purification tablets.</p></li></ul><p>Our relief teams will remain on the ground assisting local municipal authorities with ongoing recovery efforts.</p>`,
      category: "Social Impact",
      coverImage: "/assets/sharing_rice.png",
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date("2026-05-30"),
      viewsCount: 2490,
    },
    {
      slug: "waqf-endowment-fund-expansion",
      title: "Official Statement: ABOI NGO Expands Perpetual Waqf Endowment Fund",
      excerpt: "Announcement of new community assets dedicated to funding perpetual educational and social development programs.",
      content: `<p>ABOI NGO is honored to announce the expansion of its institutional Waqf Endowment Fund. Dedicated assets will generate perpetual revenue streams to fund scholarship grants, healthcare centers, and orphan support programs for generations to come.</p><blockquote>Waqf ensures that community investment delivers continuous, everlasting benefit to society.</blockquote><p>We invite philanthropic partners to contribute to perpetual endowment assets that secure the future of our communities.</p>`,
      category: "Press Releases",
      coverImage: "/assets/sharing_rice2.png",
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date("2026-05-18"),
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
    { key: "contact_phone", value: "+229 0197294351 / 0164962217" },
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
