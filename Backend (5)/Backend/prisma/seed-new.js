/**
 * Comprehensive Seed File for TrippyJiffy Database
 * This file populates the database with all necessary data
 * 
 * Run locally: node prisma/seed.js
 * On server (Hostinger): npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Helper to load exported data if it exists
function loadExportedData() {
  try {
    const dataPath = path.join(__dirname, "exported-data.json");
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath, "utf-8");
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.warn("⚠️  Could not load exported data:", error.message);
  }
  return null;
}

async function seedAdmin(exportedData) {
  console.log("👤 Seeding Admin users...");

  if (exportedData?.admin && exportedData.admin.length > 0) {
    for (const admin of exportedData.admin) {
      await prisma.admin.upsert({
        where: { email: admin.email },
        update: admin,
        create: admin,
      });
    }
    console.log(`   ✅ ${exportedData.admin.length} admins seeded`);
  } else {
    // Default admin if no data exists
    await prisma.admin.upsert({
      where: { email: "admin@trippyjiffy.com" },
      update: {},
      create: {
        email: "admin@trippyjiffy.com",
        name: "Admin",
        password: "hashed_password_here", // Change this!
      },
    });
    console.log("   ✅ Default admin created");
  }
}

async function seedCategories(exportedData) {
  console.log("🏷️  Seeding Categories...");

  if (exportedData?.category_india && exportedData.category_india.length > 0) {
    for (const cat of exportedData.category_india) {
      await prisma.category_india.upsert({
        where: { id: cat.id },
        update: cat,
        create: cat,
      });
    }
    console.log(`   ✅ ${exportedData.category_india.length} categories seeded`);
  }
}

async function seedStates(exportedData) {
  console.log("🗺️  Seeding States...");

  if (exportedData?.state && exportedData.state.length > 0) {
    for (const state of exportedData.state) {
      await prisma.state.upsert({
        where: { id: state.id },
        update: state,
        create: state,
      });
    }
    console.log(`   ✅ ${exportedData.state.length} states seeded`);
  }
}

async function seedTours(exportedData) {
  console.log("🎒 Seeding Tours...");

  if (exportedData?.tour && exportedData.tour.length > 0) {
    for (const tour of exportedData.tour) {
      await prisma.tour.upsert({
        where: { id: tour.id },
        update: tour,
        create: tour,
      });
    }
    console.log(`   ✅ ${exportedData.tour.length} tours seeded`);
  }
}

async function seedAsiaCountries(exportedData) {
  console.log("🌏 Seeding Asia Countries...");

  if (exportedData?.asia && exportedData.asia.length > 0) {
    for (const asia of exportedData.asia) {
      await prisma.asia.upsert({
        where: { id: asia.id },
        update: asia,
        create: asia,
      });
    }
    console.log(`   ✅ ${exportedData.asia.length} countries seeded`);
  }
}

async function seedAsiaStates(exportedData) {
  console.log("🏛️  Seeding Asia States...");

  if (exportedData?.asiastate && exportedData.asiastate.length > 0) {
    for (const asiastate of exportedData.asiastate) {
      await prisma.asiastate.upsert({
        where: { id: asiastate.id },
        update: asiastate,
        create: asiastate,
      });
    }
    console.log(`   ✅ ${exportedData.asiastate.length} asia states seeded`);
  }
}

async function seedCountryTours(exportedData) {
  console.log("🌍 Seeding Country Tours...");

  if (exportedData?.country && exportedData.country.length > 0) {
    for (const country of exportedData.country) {
      await prisma.country.upsert({
        where: { id: country.id },
        update: country,
        create: country,
      });
    }
    console.log(`   ✅ ${exportedData.country.length} country tours seeded`);
  }
}

async function seedBlogs(exportedData) {
  console.log("📝 Seeding Blogs...");

  if (exportedData?.blog && exportedData.blog.length > 0) {
    for (const blog of exportedData.blog) {
      await prisma.blog.upsert({
        where: { id: blog.id },
        update: blog,
        create: blog,
      });
    }
    console.log(`   ✅ ${exportedData.blog.length} blogs seeded`);
  }
}

async function seedFAQs(exportedData) {
  console.log("❓ Seeding FAQs...");

  if (exportedData?.faq && exportedData.faq.length > 0) {
    for (const faq of exportedData.faq) {
      await prisma.faq.upsert({
        where: { id: faq.id },
        update: faq,
        create: faq,
      });
    }
    console.log(`   ✅ ${exportedData.faq.length} FAQs seeded`);
  }

  if (exportedData?.countrytoursfaq && exportedData.countrytoursfaq.length > 0) {
    for (const faq of exportedData.countrytoursfaq) {
      await prisma.countrytoursfaq.upsert({
        where: { id: faq.id },
        update: faq,
        create: faq,
      });
    }
    console.log(`   ✅ ${exportedData.countrytoursfaq.length} country FAQs seeded`);
  }
}

async function seedLandingPages(exportedData) {
  console.log("🎯 Seeding Landing Pages...");

  if (exportedData?.landing_page && exportedData.landing_page.length > 0) {
    for (const page of exportedData.landing_page) {
      await prisma.landing_page.upsert({
        where: { id: page.id },
        update: page,
        create: page,
      });
    }
    console.log(`   ✅ ${exportedData.landing_page.length} landing pages seeded`);
  }
}

async function seedUpcomingTrips(exportedData) {
  console.log("✈️  Seeding Upcoming Trips...");

  if (exportedData?.upcoming_trip && exportedData.upcoming_trip.length > 0) {
    for (const trip of exportedData.upcoming_trip) {
      await prisma.upcoming_trip.upsert({
        where: { id: trip.id },
        update: trip,
        create: trip,
      });
    }
    console.log(`   ✅ ${exportedData.upcoming_trip.length} upcoming trips seeded`);
  }
}

async function seedSettings(exportedData) {
  console.log("⚙️  Seeding Settings...");

  if (exportedData?.settings && exportedData.settings.length > 0) {
    for (const setting of exportedData.settings) {
      await prisma.settings.upsert({
        where: { id: setting.id },
        update: setting,
        create: setting,
      });
    }
    console.log(`   ✅ ${exportedData.settings.length} settings seeded`);
  }
}

async function seedOtherData(exportedData) {
  console.log("🔗 Seeding Other Data...");

  const tables = [
    { name: "contact", model: prisma.contact },
    { name: "enquiry", model: prisma.enquiry },
    { name: "feedback", model: prisma.feedback },
    { name: "user", model: prisma.user },
    { name: "user_document", model: prisma.user_document },
    { name: "review", model: prisma.review },
    { name: "bussian_content", model: prisma.bussian_content },
  ];

  for (const table of tables) {
    if (exportedData?.[table.name] && exportedData[table.name].length > 0) {
      for (const record of exportedData[table.name]) {
        try {
          await table.model.upsert({
            where: { id: record.id },
            update: record,
            create: record,
          });
        } catch (error) {
          console.log(`   ⚠️  Could not upsert ${table.name} (${record.id}):`, error.message);
        }
      }
      console.log(`   ✅ ${exportedData[table.name].length} ${table.name} records seeded`);
    }
  }
}

async function main() {
  try {
    console.log("\n🌱 Starting Database Seed...\n");

    // Load exported data
    const exportedData = loadExportedData();
    if (exportedData) {
      console.log("✅ Loaded exported data from file\n");
    } else {
      console.log("ℹ️  No exported data found - will use defaults\n");
    }

    // Seed in order (respecting foreign key constraints)
    await seedAdmin(exportedData);
    await seedCategories(exportedData);
    await seedStates(exportedData);
    await seedTours(exportedData);
    await seedAsiaCountries(exportedData);
    await seedAsiaStates(exportedData);
    await seedCountryTours(exportedData);
    await seedBlogs(exportedData);
    await seedFAQs(exportedData);
    await seedLandingPages(exportedData);
    await seedUpcomingTrips(exportedData);
    await seedSettings(exportedData);
    await seedOtherData(exportedData);

    console.log("\n✨ Database seeding completed successfully!\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
