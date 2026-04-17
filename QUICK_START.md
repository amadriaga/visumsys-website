# Quick Start: Deploy to Cloudflare Pages

## Step 1: Push to GitHub (5 minutes)

```bash
cd visumsys-website
git init
git add .
git commit -m "Initial commit - Visum Systems LLC website"
```

Create a new repository on GitHub:
1. Go to https://github.com/new
2. Name it: `visumsys-website`
3. Make it **Public** or **Private** (your choice)
4. **Don't** initialize with README
5. Click "Create repository"

Then push your code:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/visumsys-website.git
git push -u origin main
```

## Step 2: Deploy to Cloudflare Pages (3 minutes)

1. Go to https://dash.cloudflare.com
2. Click **Workers & Pages** → **Pages**
3. Click **Create a project** → **Connect to Git**
4. Select your `visumsys-website` repository
5. Configure build:
   - **Project name**: visumsys-website
   - **Build command**: (leave empty)
   - **Build output directory**: /
6. Click **Save and Deploy**

Wait ~1 minute for deployment to complete!

## Step 3: Add Your Domain (2 minutes)

1. In your project, click **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `visumsys.com`
4. Click **Continue**
5. Cloudflare will automatically configure DNS
6. Wait for SSL certificate (~1 minute)

## Step 4: Set Stripe Secret Key (1 minute)

1. Go to your project **Settings** → **Environment variables**
2. Click **Add variable**
3. Variable name: `STRIPE_SECRET_KEY`
4. Value: (paste your Stripe secret key)
5. Select **Production** environment
6. Click **Save**

## Step 5: Configure Formspree (2 minutes)

1. Sign up at https://formspree.io
2. Create a new form
3. Copy your form ID (e.g., `xpznabcd`)
4. Update `index.html` line 115:
   ```html
   <form action="https://formspree.io/f/xpznabcd" method="POST">
   ```
5. Commit and push:
   ```bash
   git add index.html
   git commit -m "Add Formspree form ID"
   git push
   ```

## Step 6: Set Up Email Routing (3 minutes)

1. In Cloudflare Dashboard, select `visumsys.com`
2. Go to **Email** → **Email Routing**
3. Click **Get started**
4. Add your personal email as destination
5. Verify your email
6. Create custom address:
   - Address: `info@visumsys.com`
   - Destination: your-email@example.com

## Step 7: Get Stripe Keys (2 minutes)

1. Go to https://dashboard.stripe.com
2. Click **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_...`)
4. Update `script.js` line 16:
   ```javascript
   const stripe = Stripe('pk_test_YOUR_KEY');
   ```
5. Commit and push:
   ```bash
   git add script.js
   git commit -m "Add Stripe publishable key"
   git push
   ```

## Done! 🎉

Your website is live at:
- https://visumsys.com
- https://www.visumsys.com

## Test Everything

✅ Visit your website  
✅ Submit a test contact form  
✅ Send test email to info@visumsys.com  
✅ Test payment with card: 4242 4242 4242 4242  

---

**Total time: ~18 minutes**
**Total cost: $0/month** (+ Stripe transaction fees)
