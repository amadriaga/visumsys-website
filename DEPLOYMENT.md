# Deployment Guide for visumsys.com

## Quick Start Checklist

- [ ] Set up Formspree account and get form ID
- [ ] Set up Stripe account and get API keys
- [ ] Configure environment variables
- [ ] Deploy to Cloudflare Pages
- [ ] Configure custom domain (visumsys.com)
- [ ] Set up email routing for info@visumsys.com
- [ ] Test contact form
- [ ] Test payment processing (use test mode first)

## Detailed Steps

### Step 1: Formspree Configuration

1. Create account at https://formspree.io
2. Create a new form for "Contact Form"
3. Copy the form endpoint (looks like: `https://formspree.io/f/xpznabcd`)
4. Update `index.html` line 115:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   Replace `YOUR_FORM_ID` with your actual form ID (e.g., `xpznabcd`)

### Step 2: Stripe Configuration

1. Create account at https://stripe.com
2. Get your API keys from Dashboard → Developers → API keys
   - **Test Mode**: Use for testing (pk_test_... and sk_test_...)
   - **Live Mode**: Use for production (pk_live_... and sk_live_...)

3. Update `script.js` line 16:
   ```javascript
   const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
   ```
   Replace with your actual publishable key

4. Store secret key as environment variable (never commit to Git)

### Step 3: Deploy to Cloudflare Pages

#### Option A: Using Git Integration (Recommended)

1. Create a GitHub repository:
   ```bash
   cd visumsys-website
   git init
   git add .
   git commit -m "Initial commit - Visum Systems website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/visumsys-website.git
   git push -u origin main
   ```

2. Go to Cloudflare Dashboard (https://dash.cloudflare.com)
3. Navigate to "Workers & Pages" → "Pages"
4. Click "Create a project" → "Connect to Git"
5. Select your repository
6. Configure build settings:
   - **Project name**: visumsys-website
   - **Build command**: (leave empty)
   - **Build output directory**: /
7. Click "Save and Deploy"

#### Option B: Using Wrangler CLI

1. Install Wrangler:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Deploy:
   ```bash
   wrangler pages deploy visumsys-website
   ```

### Step 4: Set Environment Variables

1. In Cloudflare Pages project settings
2. Go to "Settings" → "Environment variables"
3. Add variable:
   - **Variable name**: `STRIPE_SECRET_KEY`
   - **Value**: Your Stripe secret key (sk_test_... or sk_live_...)
   - **Environment**: Production (and Preview if testing)
4. Click "Save"

### Step 5: Configure Custom Domain

1. In your Cloudflare Pages project
2. Go to "Custom domains"
3. Click "Set up a custom domain"
4. Enter: `visumsys.com`
5. Follow DNS instructions:
   - Add CNAME record: `visumsys.com` → `your-project.pages.dev`
   - Add CNAME record: `www` → `your-project.pages.dev`

6. If visumsys.com is already on Cloudflare:
   - DNS records will be added automatically
   - Wait for SSL certificate provisioning (usually < 1 minute)

### Step 6: Configure Email Routing

1. In Cloudflare Dashboard, select your domain `visumsys.com`
2. Go to "Email" → "Email Routing"
3. Click "Get started" (if not already enabled)
4. Add destination address (your personal email)
5. Create custom address:
   - **Custom address**: info@visumsys.com
   - **Destination**: your-personal-email@example.com
6. Verify destination email

### Step 7: Testing

#### Test Contact Form:
1. Go to https://visumsys.com
2. Navigate to Contact section
3. Fill out and submit the form
4. Check your email for the message
5. Check Formspree dashboard for submissions

#### Test Payments (Test Mode):
1. Use Stripe test card numbers:
   - **Success**: 4242 4242 4242 4242
   - **Decline**: 4000 0000 0000 0002
   - Use any future expiry date, any CVC, any ZIP
2. Enter an amount and description
3. Submit payment
4. Check Stripe Dashboard → Payments

#### Test Email:
1. Send test email to info@visumsys.com
2. Check your destination email

### Step 8: Go Live

1. Switch Stripe to Live mode:
   - Update `script.js` with live publishable key (`pk_live_...`)
   - Update environment variable with live secret key (`sk_live_...`)
   - Commit and push changes

2. Monitor:
   - Cloudflare Analytics
   - Stripe Dashboard
   - Formspree submissions

## DNS Configuration

If visumsys.com is currently at GoDaddy and you want to use Cloudflare:

1. **Transfer domain to Cloudflare** (Recommended):
   - Go to Cloudflare Dashboard → Domain Registration
   - Click "Transfer Domain"
   - Follow transfer instructions
   - Benefits: Better pricing, integrated management

2. **Or use Cloudflare nameservers**:
   - Add domain to Cloudflare (Free plan is fine)
   - Update nameservers at GoDaddy to Cloudflare's nameservers
   - Wait for DNS propagation (24-48 hours)

## Troubleshooting

### Contact Form Issues
- Check Formspree form ID is correct
- Verify form is active in Formspree dashboard
- Check browser console for errors

### Payment Issues
- Verify Stripe keys are correct (test vs live)
- Check environment variable is set
- Check browser console for errors
- Verify payment intent endpoint is responding

### Domain Issues
- Verify DNS records are correct
- Wait for SSL certificate (can take up to 24 hours)
- Check Cloudflare DNS propagation

### Email Issues
- Verify email routing is enabled
- Check destination email is verified
- Check spam folder

## Maintenance

### Update Content
1. Edit HTML/CSS/JS files
2. Commit and push to Git
3. Cloudflare Pages will auto-deploy

### Monitor Performance
- Cloudflare Analytics: Traffic and performance
- Stripe Dashboard: Payment metrics
- Formspree Dashboard: Form submissions

### Security
- Keep Stripe keys secure
- Use environment variables for secrets
- Enable Cloudflare security features
- Monitor for suspicious activity

## Support Contacts

- **Cloudflare Support**: https://dash.cloudflare.com/support
- **Stripe Support**: https://support.stripe.com
- **Formspree Support**: https://help.formspree.io

## Estimated Costs

- **Domain**: ~$10-15/year (Cloudflare) or ~$20/year (GoDaddy)
- **Cloudflare Pages**: Free
- **Formspree**: Free (up to 50 submissions/month)
- **Stripe**: 2.9% + $0.30 per transaction
- **Email Routing**: Free

**Total**: Effectively free except transaction fees!
