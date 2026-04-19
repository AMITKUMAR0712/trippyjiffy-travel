import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getSettings = async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 1 },
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { primaryColor, secondaryColor, fontFamily, navbarColor, footerColor, glassEffect, borderRadius, cardHoverStyle, primaryGradient, darkTheme } = req.body;
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: { primaryColor, secondaryColor, fontFamily, navbarColor, footerColor, glassEffect, borderRadius, cardHoverStyle, primaryGradient, darkTheme },
      create: { id: 1, primaryColor, secondaryColor, fontFamily, navbarColor, footerColor, glassEffect, borderRadius, cardHoverStyle, primaryGradient, darkTheme },
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
