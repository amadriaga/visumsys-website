# Visum Systems Website - Complete Deployment Guide

This guide documents the complete setup process for deploying a static website with Stripe payment integration and Formspree contact form using Cloudflare Pages.

## Project Overview

- **Website**: Visum Systems LLC business site
- **Domain**: visumsys.com
- **Hosting**: Cloudflare Pages (NOT Workers - Workers don't support serverless functions)
- **Payment Processing**: Stripe
- **Contact Form**: Formspree
- **Repository**: https://github.com/amadriaga/visumsys-website

---

## Prerequisites

1. GitHub account
2. Cloudflare account (free tier works)
3. Stripe account (test mode for development)
4. Formspree account (free tier works)
5. Custom domain (optional but recommended)

---

## Step 1: Create Website Files

### Required Files Structure:
```
visumsys-website/
├── index.html          # Main website HTML
├── style.css           # Styles
├── script.js           # Client-side JavaScript (Stripe frontend)
├── functions/
│   └── create-payment-intent.js  # Cloudflare Pages Function (backend)
├── logo.png            # 200x200px logo
├── favicon.png         # 64x64px favicon
└── README.md
```

### Key Components:

**index.html**:
- Hero section with company info
- About section
- Services section
- Contact form (Formspree integration)
- Payment form (Stripe integration)
- Responsive design

**script.js**:
- Initialize Stripe with publishable key: `const stripe = Stripe('pk_test_...')`
- Mount card element
- Handle payment form submission
- POST to `/create-payment-intent` endpoint

**functions/create-payment-intent.js** (CRITICAL - This is what makes Pages required):
```javascript
export async function onRequestPost(context) {
  const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);
  // ... payment intent creation logic
}
```

---

## Step 2: Set Up GitHub Repository

1. Create new GitHub repository: `visumsys-website`
2. Initialize local git repository:
   ```powershell
   cd visumsys-website
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/visumsys-website.git
   git push -u origin main
   ```

---

## Step 3: Get Third-Party Service Credentials

### Formspree Setup:
1. Go to https://formspree.io/
2. Create account (free tier)
3. Create new form
4. Get form ID (e.g., `maqaonba`)
5. Update `index.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Stripe Setup:
1. Go to https://dashboard.stripe.com/
2. Create account
3. Stay in **Test mode** (toggle in top right)
4. Go to **Developers → API keys**
5. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)
6. Update `script.js` with publishable key
7. **Keep secret key for Cloudflare Pages environment variables!**

---

## Step 4: Deploy to Cloudflare Pages

### IMPORTANT: Use Pages, NOT Workers!
- **Workers** (with static assets only) = Cannot use environment variables or serverless functions
- **Pages** = Full Jamstack platform with serverless functions support

### Deployment Steps:

1. **Go to Cloudflare Dashboard**
   - Navigate to **Workers & Pages**
   - Click **Create application**

2. **Select Pages Tab**
   - Click **"Looking to deploy Pages? Get started"** if you see the Workers page
   - OR look for tabs at the top and click **Pages**

3. **Connect to Git**
   - Click **"Import an existing Git repository"**
   - Click **"Continue with GitHub"**
   - Authorize Cloudflare to access your repository
   - Select repository: `YOUR_USERNAME/visumsys-website`

4. **Configure Build Settings**
   - **Project name**: `visumsys-website` (or your choice)
   - **Production branch**: `main`
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/`
   - **Root directory**: (leave empty)
   - Click **"Save and Deploy"**

5. **Wait for Deployment**
   - First deployment takes ~1-2 minutes
   - You'll get a URL like: `visumsys-website.pages.dev`

---

## Step 5: Configure Environment Variables

**This is why Pages is required - Workers can't do this!**

1. In your Pages project, go to **Settings**
2. Find **Environment variables** section
3. Click **Add variable**
4. Enter:
   - **Variable name**: `STRIPE_SECRET_KEY`
   - **Value**: `sk_test_YOUR_SECRET_KEY_HERE`
   - **Environment**: Production (and Preview if you want)
5. Click **Save**

**CRITICAL**: Never commit secret keys to Git! Always use environment variables.

---

## Step 6: Add Custom Domain

### If domain is registered with Cloudflare:

1. In Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `visumsys.com`)
4. Cloudflare will automatically configure DNS
5. If you have an existing Worker using this domain:
   - First go to the old Worker → Settings → Delete the Worker
   - OR remove the domain from the Worker's Domains & Routes
6. Wait 5-15 minutes for DNS propagation
7. Domain status should change to **Active** with **SSL enabled**

### If domain is registered elsewhere:

1. In Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain
4. Cloudflare will show DNS records to add:
   - **Type**: CNAME
   - **Name**: `@`
   - **Target**: `your-project.pages.dev`
5. Add these records to your DNS provider
6. Click **Check DNS records**
7. Wait for verification (can take up to 24 hours)

---

## Step 7: Test Everything

### Test Contact Form:
1. Visit your website
2. Scroll to contact section
3. Fill out form and submit
4. Check email for submission
5. Check Formspree dashboard for entries

### Test Stripe Payments:
1. Visit payment section
2. Enter amount and description
3. Use test card: **4242 4242 4242 4242**
4. Expiry: Any future date (e.g., `12/28`)
5. CVC: Any 3 digits (e.g., `123`)
6. Click **Process Payment**
7. Should see success message
8. Check Stripe dashboard → Payments (in Test mode)

---

## Going Live with Real Payments

When ready for production:

1. **Stripe - Activate Live Mode**:
   - Complete Stripe account verification
   - Go to **Developers → API keys**
   - Switch to **Live mode**
   - Copy live keys (start with `pk_live_...` and `sk_live_...`)

2. **Update Cloudflare Pages**:
   - Go to **Settings → Environment variables**
   - Update `STRIPE_SECRET_KEY` with live secret key: `sk_live_...`
   - Save and redeploy

3. **Update Website Code**:
   - Edit `script.js`
   - Replace test publishable key with live key: `pk_live_...`
   - Commit and push to GitHub
   - Cloudflare Pages will auto-deploy

4. **Test with Real Card**:
   - Use actual credit card (small amount)
   - Verify payment appears in Stripe Live mode dashboard
   - Verify you can refund if needed

---

## Troubleshooting

### "Variables cannot be added to a Worker that only has static assets"
- **Problem**: You deployed to Workers instead of Pages
- **Solution**: Create new Pages project, delete old Worker

### Payment processing fails with 404 error
- **Problem**: `/create-payment-intent` endpoint not found
- **Check**: 
  - File is at `functions/create-payment-intent.js` (not `function/` or other path)
  - Environment variable `STRIPE_SECRET_KEY` is set
  - Deployed to Pages (not Workers)

### Domain shows "Unable to edit this record as this has been configured as read only"
- **Problem**: Domain still attached to another Worker/Pages project
- **Solution**: 
  - Delete old Worker/Pages project, OR
  - Remove domain from old project first

### Custom domain not activating
- **Problem**: DNS not configured correctly
- **Solution**:
  - Check DNS records point to `your-project.pages.dev`
  - Wait 15-30 minutes for propagation
  - Use `nslookup yourdomain.com` to verify DNS

### Payments succeed but not showing in Stripe
- **Problem**: Wrong API mode or keys
- **Solution**:
  - Verify you're checking correct mode (Test vs Live) in Stripe dashboard
  - Verify publishable and secret keys match the same mode

---

## File Updates and Redeployment

Cloudflare Pages automatically redeploys when you push to GitHub:

```powershell
# Make changes to files
git add .
git commit -m "Description of changes"
git push origin main

# Cloudflare Pages will automatically:
# 1. Detect the push
# 2. Build and deploy
# 3. Update your site (usually within 1-2 minutes)
```

---

## Architecture Summary

```
Browser → visumsys.com (DNS) → Cloudflare Pages
                                      ↓
                      ┌──────────────────────────────┐
                      │    Static Assets             │
                      │    (HTML, CSS, JS, images)   │
                      └──────────────────────────────┘
                                      ↓
Contact Form → Formspree.io (external service)
                                      ↓
Payment Form → /create-payment-intent (Pages Function)
                      ↓
               env.STRIPE_SECRET_KEY
                      ↓
               Stripe API → Process payment
```

---

## Key Differences: Workers vs Pages

| Feature | Workers (static assets) | Pages |
|---------|------------------------|-------|
| Static files | ✅ Yes | ✅ Yes |
| Environment variables | ❌ No | ✅ Yes |
| Serverless functions | ❌ No | ✅ Yes (`/functions` folder) |
| Custom domains | ✅ Yes | ✅ Yes |
| Git integration | ✅ Yes | ✅ Yes |
| Use case | Simple CDN hosting | Full Jamstack apps |

**For Stripe integration, you MUST use Pages!**

---

## Cost Breakdown (as of 2026)

- **Cloudflare Pages**: FREE (500 builds/month, unlimited requests)
- **Formspree**: FREE tier (50 submissions/month)
- **Stripe**: FREE (2.9% + 30¢ per successful transaction)
- **Domain**: ~$10-15/year (varies by registrar and TLD)

Total monthly cost for low-traffic site: **~$1/month** (just the domain)

---

## Security Best Practices

1. ✅ **Never commit secret keys to Git**
2. ✅ **Use environment variables for all API keys**
3. ✅ **Keep test and live keys separate**
4. ✅ **Use Cloudflare's proxy (orange cloud) for DDoS protection**
5. ✅ **Enable SSL/TLS (automatic with Cloudflare)**
6. ✅ **Regularly update dependencies**
7. ✅ **Monitor Stripe dashboard for suspicious activity**
8. ✅ **Set up Stripe webhooks for payment confirmations (advanced)**

---

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Formspree Documentation](https://help.formspree.io/)

---

## Support

For issues with:
- **Cloudflare**: https://community.cloudflare.com/
- **Stripe**: https://support.stripe.com/
- **Formspree**: https://help.formspree.io/

---

**Last Updated**: April 17, 2026  
**Tested Platform**: Cloudflare Pages with Stripe integration  
**Status**: Production-ready ✅
