# TinyLink Backend Server

Express.js REST API for the TinyLink URL shortener.

## Setup

```bash

# Install dependencies

npm install

# Configure environment

cp example.env .env

# Edit .env and add your DATABASE_URL

# Run migrations

npx prisma migrate dev

# Generate Prisma Client

npx prisma generate

# Start development server (with auto-reload)

npm run dev

# Or start production server

npm start
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
PORT=3000
```

## Database Commands

```bash

# Create a new migration

npx prisma migrate dev --name description

# Apply migrations in production

npx prisma migrate deploy

# Open Prisma Studio (GUI)

npx prisma studio

# Reset database (development only!)

npx prisma migrate reset
```

## API Documentation

See main README.md for complete API documentation.

## Tech Stack

- Express.js 5
- Prisma ORM 7
- PostgreSQL (via @prisma/adapter-pg)
- Node.js 18+
