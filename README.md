# Comet Assistant E-commerce Project

This is a [Next.js](https://nextjs.org/) e-commerce project built with modern technologies and optimized for deployment on Dokploy.

🚀 **Auto-deployment test - Updated at:** $(date)

## Features

- **Modern E-commerce Platform**: Full-featured online store with product catalog
- **Multi-language Support**: English, Portuguese, Spanish, French
- **Product Search & Filtering**: Advanced search with manufacturer, category, and subcategory filters
- **Shopping Cart**: Full cart functionality with Euro currency support
- **Admin Dashboard**: Complete admin panel for managing products, orders, and users
- **Responsive Design**: Mobile-friendly interface
- **Payment Integration**: Stripe payment processing
- **User Authentication**: NextAuth.js integration
- **Database**: MongoDB with Mongoose ODM

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/comet-ecommerce

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=noreply@yourdomain.com

# Image Upload (ImgBB)
NEXT_PUBLIC_imageBB_key=your_imgbb_api_key_here
```

## Deployment on Dokploy

This project is configured for Dokploy deployment. To deploy:

1. Connect your GitHub repository to Dokploy
2. Set up the environment variables in Dokploy dashboard
3. Configure MongoDB database connection
4. Deploy the application

## Technical Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB with Mongoose
- **Payment**: Stripe
- **Email**: Resend
- **Deployment**: Dokploy

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
