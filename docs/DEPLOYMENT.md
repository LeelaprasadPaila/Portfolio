# 🚢 Deployment Guide

> Production deployment checklist and procedures for Sprint 4.

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] ESLint passes with no errors
- [ ] Build completes successfully
- [ ] No broken links
- [ ] All images optimized
- [ ] Environment variables configured

### Performance
- [ ] Lighthouse Performance: 95-100
- [ ] Lighthouse Accessibility: 100
- [ ] Lighthouse Best Practices: 100
- [ ] Lighthouse SEO: 100
- [ ] Core Web Vitals passing
- [ ] Bundle size optimized
- [ ] Images compressed
- [ ] Fonts optimized

### SEO
- [ ] Meta tags complete
- [ ] Open Graph tags set
- [ ] Twitter Cards configured
- [ ] Structured data validated
- [ ] Sitemap.xml submitted
- [ ] robots.txt configured
- [ ] Canonical URLs set
- [ ] 404 page working

### Security
- [ ] Environment variables secured
- [ ] No secrets in code
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSP headers set
- [ ] X-Frame-Options set
- [ ] Input validation implemented

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast validated
- [ ] Focus management working
- [ ] Skip links functional
- [ ] ARIA labels complete

### PWA
- [ ] Manifest valid
- [ ] Service worker registered
- [ ] Offline mode tested
- [ ] Install prompt working
- [ ] Icons configured

## 🏗️ Build Process

### 1. Environment Setup

```bash
# Clone repository
git clone https://github.com/LeelaprasadPaila/Portfolio.git
cd Portfolio/parallax-portfolio

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### 2. Environment Variables

Required for production:

```env
# API Configuration
VITE_API_URL=https://your-api-domain.com/api
VITE_STORAGE_URL=https://your-api-domain.com/uploads

# Analytics (Optional but recommended)
VITE_GA_ID=G-XXXXXXXXXX
VITE_PLAUSIBLE_DOMAIN=yourdomain.com
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxx
VITE_CLARITY_ID=xxxxxxxxxx

# Application
VITE_APP_URL=https://leelaprasad.dev
VITE_APP_NAME=Paila Leela Prasad Portfolio
```

### 3. Build Commands

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

### 4. Build Output

After `npm run build`, the `dist/` folder contains:

```
dist/
├── assets/
│   ├── js/           # JavaScript bundles (chunked)
│   ├── css/          # CSS files (split)
│   └── images/       # Optimized images
├── index.html        # Entry point
├── manifest.json     # PWA manifest
└── sw.js            # Service worker
```

## 🌐 Deployment Platforms

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or use vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Or use netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### GitHub Pages

```bash
# Install gh-pages
npm i -g gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy

# Or manually:
npm run build
git add dist/
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

### AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t portfolio .
docker run -p 80:80 portfolio
```

## 🔧 Nginx Configuration

```nginx
# /etc/nginx/sites-available/portfolio
server {
    listen 80;
    server_name leelaprasad.dev www.leelaprasad.dev;
    root /var/www/portfolio/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json image/svg+xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache";
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /env\. {
        deny all;
    }
}
```

## 🔒 Security Headers

### Content Security Policy

```html
<!-- Add to index.html or server config -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://plausible.io https://app.posthog.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
    font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://your-api-domain.com https://www.google-analytics.com https://plausible.io https://app.posthog.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
">
```

### Additional Headers

```nginx
# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

## 📊 Post-Deployment

### 1. Verify Deployment

```bash
# Check if site is accessible
curl -I https://leelaprasad.dev

# Test HTTPS
curl -I https://leelaprasad.dev

# Check security headers
curl -I https://leelaprasad.dev | grep -i "security\|x-"
```

### 2. Submit to Search Engines

```bash
# Google Search Console
# 1. Verify domain ownership
# 2. Submit sitemap: https://leelaprasad.dev/sitemap.xml
# 3. Request indexing for key pages

# Bing Webmaster Tools
# 1. Verify domain ownership
# 2. Submit sitemap: https://leelaprasad.dev/sitemap.xml

# Other search engines
# - Submit to DuckDuckGo
# - Submit to Baidu (if targeting China)
```

### 3. Configure Analytics

```javascript
// Verify analytics are working
// Check real-time reports in:
// - Google Analytics
// - Plausible
// - PostHog
// - Microsoft Clarity
```

### 4. Test Performance

```bash
# Run Lighthouse
npm install -g lighthouse
lighthouse https://leelaprasad.dev --view

# Or use Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Run audit
```

### 5. Monitor

```bash
# Set up monitoring
# - Uptime monitoring (UptimeRobot, Pingdom)
# - Error tracking (Sentry)
# - Performance monitoring (New Relic, Datadog)
# - Log aggregation (LogRocket, LogDNA)
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 🐛 Troubleshooting

### Common Issues

1. **White screen after deployment**
   - Check browser console for errors
   - Verify all routes are configured
   - Check base path in vite.config.js

2. **Assets not loading**
   - Verify asset paths are correct
   - Check CDN configuration
   - Ensure proper MIME types

3. **Service worker not registering**
   - Check HTTPS is enabled
   - Verify sw.js is in public folder
   - Check browser console for errors

4. **Slow performance**
   - Run Lighthouse audit
   - Check bundle size
   - Optimize images
   - Enable gzip compression

5. **SEO issues**
   - Validate structured data
   - Check meta tags
   - Submit sitemap
   - Verify robots.txt

## 📈 Monitoring & Maintenance

### Regular Tasks

- [ ] Weekly: Check analytics reports
- [ ] Weekly: Review error logs
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review performance metrics
- [ ] Quarterly: Security audit
- [ ] Quarterly: Accessibility audit

### Alerts to Set Up

- [ ] Site downtime alerts
- [ ] Error rate spikes
- [ ] Performance degradation
- [ ] Broken link detection
- [ ] SSL certificate expiration

## 🎯 Success Metrics

### Performance Targets
- Lighthouse Performance: 95-100
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100
- LCP: < 2.5s
- INP: < 200ms
- CLS: < 0.1

### Business Metrics
- Page load time: < 3s
- Bounce rate: < 40%
- Average session duration: > 2 minutes
- Mobile traffic: > 50%
- Conversion rate: Track and improve

---

**Last Updated:** Sprint 4 - Production Readiness