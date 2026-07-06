import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractEmails, getFirstBusinessEmail } from '../utils/helpers.js';

const CONTACT_PATHS = ['/', '/contact', '/contact-us', '/about', '/about-us'];
const SCRAPE_TIMEOUT = 12000;
const websiteCache = new Map();

let browser = null;

async function getBrowser() {
  if (browser) return browser;
  try {
    const { chromium } = await import('playwright');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    return browser;
  } catch {
    return null;
  }
}

function normalizeUrl(baseUrl, path) {
  try {
    const url = new URL(path, baseUrl);
    return url.href;
  } catch {
    return null;
  }
}

async function scrapeWithCheerio(url) {
  const response = await axios.get(url, {
    timeout: SCRAPE_TIMEOUT,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
    },
    maxRedirects: 5,
    validateStatus: (status) => status < 400,
  });

  const $ = cheerio.load(response.data);
  const bodyText = $('body').text();
  const mailtoLinks = [];
  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) mailtoLinks.push(href.replace('mailto:', '').split('?')[0]);
  });

  const pageEmails = extractEmails(bodyText);
  const linkEmails = extractEmails(mailtoLinks.join(' '));
  return [...new Set([...pageEmails, ...linkEmails])];
}

async function scrapeWithPlaywright(url) {
  const b = await getBrowser();
  if (!b) return scrapeWithCheerio(url);

  const context = await b.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: SCRAPE_TIMEOUT,
    });

    const content = await page.content();
    const mailtoHrefs = await page.$$eval('a[href^="mailto:"]', (links) =>
      links.map((a) => a.getAttribute('href') || '')
    );

    const emails = extractEmails(content);
    const mailtoEmails = mailtoHrefs
      .map((h) => h.replace('mailto:', '').split('?')[0])
      .filter(Boolean);

    return [...new Set([...emails, ...mailtoEmails])];
  } finally {
    await context.close();
  }
}

async function scrapePage(url) {
  try {
    return await scrapeWithCheerio(url);
  } catch {
    try {
      return await scrapeWithPlaywright(url);
    } catch {
      return [];
    }
  }
}

export async function scrapeWebsiteForEmail(websiteUrl) {
  if (!websiteUrl) return 'Not Available';

  const cacheKey = websiteUrl.toLowerCase().replace(/\/$/, '');
  if (websiteCache.has(cacheKey)) {
    return websiteCache.get(cacheKey);
  }

  let baseUrl = websiteUrl;
  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
  }

  const allEmails = [];

  for (const path of CONTACT_PATHS) {
    const url = normalizeUrl(baseUrl, path);
    if (!url) continue;

    try {
      const emails = await scrapePage(url);
      allEmails.push(...emails);
      if (allEmails.length > 0) break;
    } catch {
      continue;
    }
  }

  const uniqueEmails = [...new Set(allEmails)];
  const result = getFirstBusinessEmail(uniqueEmails);
  websiteCache.set(cacheKey, result);
  return result;
}

export function clearWebsiteCache() {
  websiteCache.clear();
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
