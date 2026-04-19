/**
 * Database Export Script
 * Run this locally to export all data from your current database
 * Command: npm run export-data
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function exportAllData() {
  try {
    console.log("📊 Exporting all database data...");

    const data = {
      admin: await prisma.admin.findMany(),
      asia: await prisma.asia.findMany(),
      asiastate: await prisma.asiastate.findMany(),
      blog: await prisma.blog.findMany(),
      category_india: await prisma.category_india.findMany(),
      contact: await prisma.contact.findMany(),
      country: await prisma.country.findMany(),
      enquiry: await prisma.enquiry.findMany(),
      faq: await prisma.faq.findMany(),
      feedback: await prisma.feedback.findMany(),
      countrytoursfaq: await prisma.countrytoursfaq.findMany(),
      landing_page: await prisma.landing_page.findMany(),
      settings: await prisma.settings.findMany(),
      state: await prisma.state.findMany(),
      tour: await prisma.tour.findMany(),
      upcoming_trip: await prisma.upcoming_trip.findMany(),
      user: await prisma.user.findMany(),
      user_document: await prisma.user_document.findMany(),
      review: await prisma.review.findMany(),
      bussian_content: await prisma.bussian_content.findMany(),
    };

    // Save to JSON file
    const filePath = path.join(__dirname, "exported-data.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("✅ Data exported successfully!");
    console.log(`📁 Saved to: ${filePath}`);
    console.log("\n📊 Summary:");
    Object.entries(data).forEach(([table, records]) => {
      console.log(`   ${table}: ${records.length} records`);
    });
  } catch (error) {
    console.error("❌ Error exporting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

exportAllData();
