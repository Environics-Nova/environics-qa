# Deployment Guide

This guide covers deployment procedures for the Environics QA application.

## Deployment Options

### 1. Lovable.dev (Current)

The application is currently deployed via Lovable.dev platform.

**Deployment URL:** https://lovable.dev/projects/fe87d1a6-977e-4114-acde-f10cb15b0202

#### Deployment Process

1. **Via Lovable Platform**:
   - Navigate to the Lovable project
   - Click on "Share" → "Publish"
   - Changes are automatically deployed

2. **Via Git Push**:
   - Make changes locally
   - Commit and push to the repository
   - Lovable automatically detects and deploys changes

### 2. Manual Static Hosting

Deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## Building for Production

### Create Production Build

```bash
# Build the application
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Output

```
dist/
├── assets/
│   ├── index-[hash].js      # Main application bundle
│   ├── index-[hash].css     # Compiled styles
│   └── [other assets]       # Images, fonts, etc.
├── index.html               # Entry HTML file
└── vite.svg                 # Favicon
```

### Build Configuration

**Production optimizations:**
- Code minification
- Tree shaking (dead code elimination)
- CSS purging (unused Tailwind classes removed)
- Asset optimization
- Source maps (optional)

### Environment-Specific Builds

```bash
# Production build
npm run build

# Development build (with source maps)
npm run build:dev
```

## Deployment Platforms

### Netlify

#### Option 1: Git Integration

1. **Connect Repository**:
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Connect your Git repository
   - Select branch (main/master)

2. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Deploy**:
   - Click "Deploy site"
   - Netlify automatically builds and deploys
   - Subsequent pushes trigger automatic deploys

#### Option 2: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the application
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Custom Domain

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

### Vercel

#### Option 1: Git Integration

1. **Connect Repository**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import Git repository

2. **Project Settings**:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Deploy**:
   - Click "Deploy"
   - Automatic deployments on push

#### Option 2: CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Build
npm run build

# Deploy
vercel --prod
```

### GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/environics-qa"
   }
   ```

3. **Update vite.config.ts**:
   ```typescript
   export default defineConfig({
     base: '/environics-qa/', // Repository name
     plugins: [react()],
   });
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: gh-pages branch
   - Save

### AWS S3 + CloudFront

1. **Build Application**:
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**:
   - Go to AWS S3
   - Create bucket
   - Enable static website hosting
   - Set index document: `index.html`

3. **Upload Files**:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name/ --delete
   ```

4. **Configure CloudFront**:
   - Create CloudFront distribution
   - Origin: S3 bucket
   - Default root object: `index.html`
   - Error pages: Redirect 404 to `index.html` (for SPA routing)

5. **Configure DNS**:
   - Add CNAME record pointing to CloudFront distribution

### Docker Deployment

#### Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Create nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Build and Run

```bash
# Build image
docker build -t environics-qa .

# Run container
docker run -p 80:80 environics-qa
```

#### Docker Compose

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## Environment Variables

### Development

Create `.env.development`:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development
```

### Production

Create `.env.production`:

```env
VITE_API_URL=https://api.environics-qa.com
VITE_APP_ENV=production
```

### Using Environment Variables

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const isProd = import.meta.env.PROD;
const isDev = import.meta.env.DEV;
```

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests pass: `npm test`
- [ ] Linter passes: `npm run lint`
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] No console.log statements in production code

### Testing

- [ ] Manual testing completed
- [ ] All critical user flows work
- [ ] Responsive design tested
- [ ] Cross-browser testing done
- [ ] No broken links

### Performance

- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Lazy loading implemented where appropriate
- [ ] Lighthouse score acceptable

### Security

- [ ] No sensitive data in code
- [ ] Environment variables configured
- [ ] Dependencies up to date: `npm audit`
- [ ] HTTPS enabled
- [ ] Security headers configured

### SEO & Metadata

- [ ] Page titles set
- [ ] Meta descriptions added
- [ ] Favicon configured
- [ ] robots.txt created (if needed)

## Post-Deployment

### Verify Deployment

1. **Check deployment URL**
   - Visit the deployed site
   - Verify home page loads

2. **Test critical paths**
   - Create a project
   - Navigate between pages
   - Check QA/QC processes
   - Verify questionnaires

3. **Check browser console**
   - No JavaScript errors
   - No 404 errors for assets

4. **Test on different devices**
   - Desktop browsers
   - Mobile devices
   - Tablets

### Monitor Application

1. **Error Tracking**
   - Set up Sentry or similar
   - Monitor for runtime errors

2. **Analytics**
   - Google Analytics
   - Track user behavior
   - Monitor page views

3. **Performance Monitoring**
   - Use Lighthouse CI
   - Monitor Core Web Vitals
   - Track bundle sizes

### Rollback Procedure

If deployment fails:

1. **Lovable.dev**:
   - Use platform's rollback feature
   - Or revert Git commit and redeploy

2. **Other platforms**:
   ```bash
   git revert HEAD
   git push
   # Platform auto-deploys previous version
   ```

3. **Manual hosting**:
   - Deploy previous `dist/` backup
   - Or rebuild from previous commit

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linter
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=dist
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
image: node:18-alpine

stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm test

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  only:
    - main
  script:
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=dist
  environment:
    name: production
    url: https://environics-qa.com
```

## Domain Configuration

### Custom Domain Setup

1. **Purchase domain** from registrar (GoDaddy, Namecheap, etc.)

2. **Configure DNS records**:

   For Netlify/Vercel:
   ```
   Type: A
   Name: @
   Value: [Platform IP]

   Type: CNAME
   Name: www
   Value: [Platform domain]
   ```

   For CloudFront:
   ```
   Type: A (Alias)
   Name: @
   Value: [CloudFront distribution]

   Type: CNAME
   Name: www
   Value: [CloudFront distribution]
   ```

3. **Enable HTTPS**:
   - Most platforms auto-provision SSL
   - Or use Let's Encrypt

4. **Test domain**:
   ```bash
   # Check DNS propagation
   nslookup environics-qa.com

   # Test HTTPS
   curl -I https://environics-qa.com
   ```

## Performance Optimization

### Bundle Analysis

```bash
# Install analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
});

# Build and analyze
npm run build
```

### Optimization Techniques

1. **Code Splitting**
   - Route-based splitting (already implemented)
   - Component lazy loading

2. **Asset Optimization**
   - Image compression
   - SVG optimization
   - Font subsetting

3. **Caching Strategy**
   - Cache static assets
   - Set appropriate cache headers
   - Use CDN for assets

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### 404 on Refresh

Configure server to serve `index.html` for all routes (SPA routing).

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Rebuild after changing .env files
- Check variable is accessed correctly: `import.meta.env.VITE_VAR_NAME`

### Large Bundle Size

- Analyze bundle with visualizer
- Remove unused dependencies
- Implement code splitting
- Lazy load heavy components

---

*For more information, see [Architecture](./architecture.md) and [Development Setup](./development-setup.md)*
