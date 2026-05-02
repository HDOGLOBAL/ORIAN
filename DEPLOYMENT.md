# Deployment Guide for Dokploy

This guide will help you deploy the Comet Assistant E-commerce project on Dokploy.

## Prerequisites

1. A Dokploy instance running
2. MongoDB database (can be external or containerized)
3. Domain name (optional, for production)

## Deployment Steps

### 1. Connect Repository to Dokploy

1. Log in to your Dokploy dashboard
2. Click "New Project" or "Add Repository"
3. Connect your GitHub repository: `https://github.com/rahul19106070/comet-assistant-project.git`
4. Select the `main` branch

### 2. Configure Environment Variables

In the Dokploy project settings, add the following environment variables:

```env
# Database Configuration
MONGODB_URI=mongodb://your-mongodb-host:27017/comet-ecommerce
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/comet-ecommerce

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
```

### 3. Configure Build Settings

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: `3000`
- **Dockerfile**: Use the provided Dockerfile

### 4. Database Setup

#### Option A: External MongoDB (Recommended for Production)

1. Use MongoDB Atlas or any external MongoDB service
2. Update the `MONGODB_URI` environment variable with your connection string

#### Option B: Containerized MongoDB

1. In Dokploy, create a new service for MongoDB
2. Use the `mongo:7.0` image
3. Set up persistent volumes for data storage
4. Configure the connection string accordingly

### 5. Domain Configuration (Optional)

1. In Dokploy, configure your domain name
2. Set up SSL certificates (Let's Encrypt is recommended)
3. Update the `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` environment variables

### 6. Deploy

1. Click "Deploy" in your Dokploy project
2. Monitor the build logs for any issues
3. Once deployed, your application will be available at the configured URL

## Post-Deployment Setup

### 1. Admin Account

1. Access your deployed application
2. Navigate to `/auth/login`
3. Create an admin account through the registration process
4. Update the user's `isAdmin` field to `true` in the database

### 2. Initial Data

1. Log in to the admin dashboard
2. Add categories and manufacturers
3. Add products to your catalog
4. Configure payment settings

## Monitoring and Maintenance

### 1. Logs

- Monitor application logs in Dokploy dashboard
- Check for any errors or warnings

### 2. Database Backups

- Set up regular MongoDB backups
- Test restore procedures

### 3. Updates

- To update the application, push changes to the main branch
- Dokploy will automatically rebuild and redeploy

## Troubleshooting

### Common Issues

1. **Build Failures**: Check build logs for missing dependencies or configuration issues
2. **Database Connection**: Verify MongoDB connection string and network access
3. **Environment Variables**: Ensure all required environment variables are set
4. **Port Configuration**: Make sure the application is configured to use port 3000

### Support

For issues specific to Dokploy, refer to the [Dokploy documentation](https://dokploy.com/docs).

## Security Considerations

1. Use strong, unique secrets for `NEXTAUTH_SECRET`
2. Keep your Stripe keys secure and use live keys only in production
3. Regularly update dependencies
4. Monitor for security vulnerabilities
5. Use HTTPS in production
6. Implement proper CORS policies if needed
