# Comet Assistant E-commerce Project

Full-stack e-commerce application built with Next.js, MongoDB, and Stripe.

## Tech Stack

- **Frontend (FE):** Next.js 16, React 19, Tailwind CSS
- **Backend (BE):** Custom Node.js server (`server.js`) with Socket.IO for real-time chat, Next.js API Routes, NextAuth.js v5
- **Database (DB):** MongoDB 7.0, Mongoose ODM
- **Payments:** Stripe
- **Email:** Resend
- **Translation:** DeepL (primary) + Google Translate (fallback)
- **Image Hosting:** ImgBB
- **Deployment:** Dokploy, Docker, PM2

## Quick Start (New Branch)

```bash
git clone <repository-url>

cd ORIAN

npm install

cp .env.example .env.local

# Edit .env.local with your values

npm run dev
```

Open http://localhost:3000

> **Note:** This project uses a custom server (`node server.js`) instead of `next dev`, because Socket.IO is integrated directly into the server for real-time support chat.

## Prerequisites

- Node.js 22+
- Docker & Docker Compose (optional, for easy setup)
- npm


## Running the Project

### Option 1: Docker Compose (recommended)

Starts the app (FE + BE) and database (DB) together.

```bash
cp .env.example .env

# Edit .env with your values

docker-compose up -d
```

- **App (FE + BE):** http://localhost:3000
- **MongoDB (DB):** localhost:27017

### Option 2: Local Development

**1. Start MongoDB (DB)**

```bash
docker run -d --name orian-mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -v mongodb_data:/data/db mongo:7.0
```

**2. Configure environment**

```bash
cp .env.example .env.local

# Database Configuration
MONGODB_URI=mongodb://mongodb:27017/comet-ecommerce
# For external MongoDB (MongoDB Atlas or external service)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/comet-ecommerce

# NextAuth.js Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here

# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=noreply@yourdomain.com

# Image Upload (ImgBB)
NEXT_PUBLIC_imageBB_key=your_imgbb_api_key_here

# Translation APIs - DeepL is used first, Google is fallback
DEEPL_API_KEY=your_deepl_api_key_here
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here

# MongoDB Configuration (for docker-compose)
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password
MONGO_DATABASE=comet-ecommerce
```

Edit `.env.local` and set `MONGODB_URI`:

```
MONGODB_URI=mongodb://admin:password@localhost:27017/comet-ecommerce?authSource=admin
```

**3. Install dependencies and start (FE + BE)**

```bash
npm install
npm run dev
```

App available at http://localhost:3000

**4. Seed admin user (optional)**

```bash
node seed.js
```

### Production

```bash
npm run build
npm start
```

## Verifying the Setup

After running `npm run dev`, verify each layer is working:

| Layer | What to check | How |
|-------|---------------|-----|
| **FE (Frontend)** | Page loads correctly | Open http://localhost:3000 - you should see the e-commerce interface |
| **BE (Backend)** | API routes respond | Open http://localhost:3000/api/socket - you should get a JSON response or 200/404 status |
| **DB (Database)** | MongoDB is connected | Load a page that fetches data (e.g. product catalog) - if products appear, the DB is connected |

### Common Issues

| Error | Cause |
|-------|-------|
| `ECONNREFUSED` on MongoDB | MongoDB is down or port is blocked |
| Port 3000 already in use | Another process is using the port |
| `NEXTAUTH_SECRET` warning | The value in `.env.local` is a placeholder - works for dev but not for production |
| Module factory not available (HMR) | Delete `.next` folder and restart: `Remove-Item -Recurse -Force .next` |

## Deployment

### Dokploy

1. Connect your GitHub repository to Dokploy
2. Set environment variables in the Dokploy dashboard
3. Configure: Build command `npm run build`, Start command `npm start`, Port `3000`

### PM2 (VPS)

```bash
npm ci
npm run build
pm2 start npm --name "orian" -- start
pm2 save
```

### Docker

```bash
docker build -t orian-app .
docker run -p 3000:3000 -e MONGODB_URI="mongodb://..." orian-app
```

## Project Structure

```
app/                # Next.js pages and API routes (App Router with route groups: (admin), (main))
components/         # React components (home, shop, auth, checkout, chatbot, seo, etc.)
models/             # Mongoose models (users, products, orders, categories, messages, etc.)
database/           # MongoDB queries, connection, and country data
service/            # Database connection utility (mongo.js)
lib/                # Core libraries (dbConnect.js, socketio.js)
utils/              # Utility functions (SEO, translation, email, PDF, slugify, etc.)
providers/          # React context providers (Cart, Toast, SupportStatus, Currency, Domain)
shared/             # Shared UI components
action/             # Server actions
auth.js             # NextAuth v5 configuration
server.js           # Custom Node.js server (Socket.IO + Next.js)
seed.js             # Database seeding script (admin user)
```
