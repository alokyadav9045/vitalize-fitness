# Vitalize Fitness - Production Deployment Guide

## Pre-Deployment Checklist

- [x] All tests passing (16/16)
- [x] No linting errors
- [x] Production build successful
- [x] Environment variables configured
- [x] MongoDB Atlas connection verified
- [x] Cloudinary API keys obtained
- [x] JWT secret generated
- [x] CORS and security headers configured

## Environment Variables (Required on Vercel)

Set these environment variables in your Vercel project settings:

```env
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/vitalize-fitness?retryWrites=true&w=majority
JWT_SECRET=[generate-a-strong-32-character-random-string]
CLOUDINARY_CLOUD_NAME=[your-cloud-name]
CLOUDINARY_API_KEY=[your-api-key]
CLOUDINARY_API_SECRET=[your-api-secret]
NODE_ENV=production
LOG_LEVEL=info
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## Deployment Steps

### 1. Prepare Your Repository

```bash
# Ensure all changes are committed
git status

# Push to GitHub/GitLab
git push origin main
```

### 2. Create Vercel Project

1. Visit [https://vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure project settings:
   - Framework: Next.js
   - Node Version: 18.x
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Add Environment Variables

In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add all required variables (see above)
3. Mark sensitive variables as encrypted

### 4. Deploy

```bash
# Option 1: Push to main branch (auto-deploys)
git push origin main

# Option 2: Deploy from Vercel CLI
vercel deploy --prod
```

## Post-Deployment Verification

### 1. Health Checks

```bash
# Check API health
curl https://your-domain.com/api/health

# Check admin login
curl https://your-domain.com/admin/login
```

### 2. Test Core Features

- [ ] Admin login works
- [ ] Dashboard loads real-time data
- [ ] File uploads work (gallery, trainers, partners)
- [ ] Member management functional
- [ ] Reports generate correctly
- [ ] Settings save properly

### 3. Monitor Logs

In Vercel Dashboard:

1. Go to Deployments
2. Click on your deployment
3. View logs for errors

### 4. Setup Monitoring

- [x] Error tracking via console.error
- [ ] Consider adding: Sentry, LogRocket, or similar
- [ ] Setup alerts for API failures

## Database Seeding (First Time)

After deployment, seed the database:

```bash
curl -X POST https://your-domain.com/api/seed \
  -H "Content-Type: application/json"
```

## Security Best Practices

- [x] JWT secret is strong and unique
- [x] MongoDB URI uses Atlas with IP whitelist
- [x] Cloudinary API secret not exposed in client code
- [x] Environment variables not committed to git
- [x] CORS properly configured
- [x] Input validation on all API routes
- [ ] Enable rate limiting (consider Vercel Pro)
- [ ] Setup HTTPS (auto with Vercel)
- [ ] Enable Content Security Policy (CSP) headers

## Performance Optimization

- [x] Next.js Image component used for optimization
- [x] API routes are serverless
- [x] Real-time updates via SSE
- [x] Database connection pooling enabled
- [ ] Consider adding: Redis for caching
- [ ] Enable Vercel Analytics

## Troubleshooting

### Database Connection Issues

- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist includes Vercel IPs
- Enable network access from anywhere (0.0.0.0/0) for testing

### Cloudinary Upload Failures

- Verify API credentials are correct
- Check Cloudinary account has valid API access
- Ensure environment variables are properly set

### SSE Connection Issues

- Check browser console for errors
- Verify API route `/api/sse` is accessible
- Ensure long-lived connections are supported

### JWT Authentication Failures

- Verify JWT_SECRET matches between routes
- Check token expiration time
- Ensure localStorage is available in browser

## Rollback Procedure

If issues occur:

1. In Vercel Dashboard, go to Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Atlas](https://docs.atlas.mongodb.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)

## Success Indicators

After deployment, verify:

- ✅ Site loads without errors
- ✅ Admin dashboard displays metrics
- ✅ Real-time updates work (SSE)
- ✅ File uploads complete successfully
- ✅ API responses are fast (<200ms)
- ✅ No console errors in browser
- ✅ All 16 tests still pass locally

## Contact Support

For deployment issues, check:

1. Vercel logs
2. Browser DevTools console
3. Network tab for failed requests
4. MongoDB Atlas activity logs
