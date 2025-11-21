import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const app = express();
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper function to generate random short code
function generateShortCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Helper function to validate URL
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// Healthcheck endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    ok: true,
    version: '1.0'
  });
});

// Dashboard - List all links
app.get('/', async (req, res) => {
  try {
    const links = await prisma.url.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        shortCode: true,
        originalUrl: true,
        clicks: true,
        lastClickedAt: true,
        createdAt: true
      }
    });

    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// Create short link (POST /api/links)
app.post('/api/links', async (req, res) => {
  try {
    const { url, customCode } = req.body;

    // Validate URL
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    let shortCode = customCode;

    // If custom code provided, validate it
    if (customCode) {
      // Check if custom code already exists
      const existingUrl = await prisma.url.findUnique({
        where: { shortCode: customCode }
      });

      if (existingUrl) {
        return res.status(409).json({ error: 'Custom code already exists' });
      }
    } else {
      // Generate unique short code
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isUnique && attempts < maxAttempts) {
        shortCode = generateShortCode();
        const existing = await prisma.url.findUnique({
          where: { shortCode }
        });
        if (!existing) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        return res.status(500).json({ error: 'Failed to generate unique code' });
      }
    }

    // Create the short URL
    const newUrl = await prisma.url.create({
      data: {
        shortCode,
        originalUrl: url
      }
    });

    res.status(201).json({
      shortCode: newUrl.shortCode,
      originalUrl: newUrl.originalUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${newUrl.shortCode}`
    });
  } catch (error) {
    console.error('Error creating short link:', error);
    res.status(500).json({ error: 'Failed to create short link' });
  }
});

// Get all links (GET /api/links)
app.get('/api/links', async (req, res) => {
  try {
    const links = await prisma.url.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// Stats page - Get stats for a single code (GET /api/links/:code)
app.get('/api/links/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const url = await prisma.url.findUnique({
      where: { shortCode: code }
    });

    if (!url) {
      return res.status(404).json({ error: 'Short code not found' });
    }

    res.json({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      lastClickedAt: url.lastClickedAt,
      createdAt: url.createdAt
    });
  } catch (error) {
    console.error('Error fetching link stats:', error);
    res.status(500).json({ error: 'Failed to fetch link stats' });
  }
});

// Delete link (DELETE /api/links/:code)
app.delete('/api/links/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const url = await prisma.url.findUnique({
      where: { shortCode: code }
    });

    if (!url) {
      return res.status(404).json({ error: 'Short code not found' });
    }

    await prisma.url.delete({
      where: { shortCode: code }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

// Redirect endpoint (GET /:code) - This should be last to avoid conflicts
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Skip if it's an API route or special route
    if (code === 'api' || code === 'healthz' || code === 'favicon.ico') {
      return res.status(404).json({ error: 'Not found' });
    }

    const url = await prisma.url.findUnique({
      where: { shortCode: code }
    });

    if (!url) {
      return res.status(404).json({ error: 'Short code not found' });
    }

    // Increment click count and update last clicked time
    await prisma.url.update({
      where: { shortCode: code },
      data: {
        clicks: { increment: 1 },
        lastClickedAt: new Date()
      }
    });

    // Redirect to original URL
    res.redirect(302, url.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Failed to redirect' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});