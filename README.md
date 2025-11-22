# 🔗 TinyLink - URL Shortener

A full-stack URL shortener application built with React, Express, Prisma, and PostgreSQL.

## ✨ Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Short Codes**: Option to create custom short codes (globally unique)
- **Click Tracking**: Track the number of clicks on each shortened URL
- **Analytics Dashboard**: View detailed statistics for each link
- **Link Management**: List, view stats, and delete links
- **Redirection**: Automatic redirection from short URLs to original URLs (HTTP 302)
- **Health Check**: `/healthz` endpoint for system monitoring
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Tech Stack

### Backend

- **Node.js** with **Express.js** - RESTful API server
- **Prisma ORM** - Database ORM with migrations
- **PostgreSQL** - Relational database (via Neon)
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### Frontend

- **React 19** - UI library
- **Vite** - Fast build tool and dev server
- **CSS3** - Styling with gradients and animations

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Neon account)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <https://github.com/Swastik007sharma/TinyLink.git>
cd TinyLink
```

### 2. Backend Setup

```bash
cd server

# Install dependencies

npm install

# Create .env file

cp example.env .env

# Edit .env and add your DATABASE_URL

# DATABASE_URL="postgresql://user:password@host:5432/database"

# Run migrations

npx prisma migrate dev

# Generate Prisma Client

npx prisma generate

# Start the server

npm run dev
```

The backend server will start on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies

npm install

# Start the development server

npm run dev
```

The frontend will start on `http://localhost:5173`

## 📡 API Endpoints

### Health Check

```req
GET /healthz
```

Returns server health status

**Response:**

```json
{
"ok": true,
"version": "1.0"
}
```

### Create Short Link

```req
POST /api/links
Content-Type: application/json
```

**Request Body:**

```json
{
"url": "<https://example.com/very/long/url>",
"customCode": "my-code" // Optional
}
```

**Response (201):**

```json
{
"shortCode": "abc123",
"originalUrl": "<https://example.com/very/long/url>",
"shortUrl": "<http://localhost:3000/abc123>"
}
```

**Error (409) - Custom code already exists:**

```json
{
"error": "Custom code already exists"
}
```

### List All Links

```req
GET /api/links
```

**Response (200):**

```json
[
   {
   "id": 1,
   "shortCode": "abc123",
   "originalUrl": "https://example.com/page",
   "clicks": 42,
   "lastClickedAt": "2025-11-22T10:30:00Z",
   "createdAt": "2025-11-21T15:00:00Z"
   }
]
```

### Get Link Statistics

```req
GET /api/links/:code
```

**Response (200):**

```json
{
"shortCode": "abc123",
"originalUrl": "<https://example.com/page>",
"clicks": 42,
"lastClickedAt": "2025-11-22T10:30:00Z",
"createdAt": "2025-11-21T15:00:00Z"
}
```

**Error (404):**

```json
{
"error": "Short code not found"
}
```

### Delete Link

```req
DELETE /api/links/:code
```

**Response (204):** No content

**Error (404):**

```json
{
"error": "Short code not found"
}
```

### Redirect to Original URL

```req
GET /:code
```

Redirects to the original URL (HTTP 302) and increments click count.

**Error (404):**

```json
{
"error": "Short code not found"
}
```

## 🗄️ Database Schema

```prisma
model Url {
id Int @id @default(autoincrement())
shortCode String @unique @db.VarChar(10)
originalUrl String @db.Text
clicks Int @default(0)
lastClickedAt DateTime?
createdAt DateTime @default(now())

@@index([shortCode])
}
```

## 📁 Project Structure

```tree
TinyLink/
├── server/ # Backend
│ ├── prisma/
│ │ ├── migrations/ # Database migrations
│ │ └── schema.prisma # Prisma schema
│ ├── prisma.config.ts # Prisma configuration
│ ├── index.js # Express server
│ ├── package.json
│ └── .env # Environment variables
│
└── client/ # Frontend
├── src/
│ ├── components/
│ │ ├── UrlShortener.jsx
│ │ ├── LinksList.jsx
│ │ └── StatsView.jsx
│ ├── App.jsx
│ ├── App.css
│ └── main.jsx
├── package.json
└── vite.config.js
```

## 🧪 Testing

### Manual Testing

1. **Create a short link:**

   - Open <http://localhost:5173>
   - Enter a URL and click "Shorten URL"
   - Copy the generated short link

2. **Test redirection:**

   - Paste the short link in a new tab
   - Verify it redirects to the original URL

3. **View statistics:**

   - Click "📊 Stats" button on any link
   - Verify click count increases

4. **Delete a link:**
   - Click 🗑️ button and confirm
   - Verify link is removed

### API Testing with curl

```bash

# Create a link

curl -X POST <http://localhost:3000/api/links> \\
-H "Content-Type: application/json" \\
-d '{"url": "<https://example.com"}>'

# Get all links

curl <http://localhost:3000/api/links>

# Get stats

curl <http://localhost:3000/api/links/abc123>

# Test redirect

curl -I <http://localhost:3000/abc123>
```

## 🔧 Environment Variables

Create a `.env` file in the `server` directory:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
PORT=3000
```

## 🚢 Deployment

### Backend (Render)

[server](https://tinylink-g4z3.onrender.com)

### Frontend (Vercel)

[Live link](https://tiny-link-theta-red.vercel.app/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

### Swastik Sharma

- GitHub: [@Swastik007sharma](https://github.com/Swastik007sharma)

## 🙏 Acknowledgments

- React Team for the amazing library
- Prisma for the excellent ORM
- Neon for PostgreSQL hosting
- Vite for the blazing-fast build tool
