# Visum Systems, LLC Website

Professional website for Visum Systems, LLC at visumsys.com

## Features

- **Responsive Design**: Works on all devices
- **Contact Form**: Integrated with Formspree for email handling
- **Payment Processing**: Stripe integration for secure payments
- **Modern UI**: Clean, professional design

## Setup Instructions

### 1. Formspree Setup

1. Go to [Formspree.io](https://formspree.io)
2. Sign up for a free account
3. Create a new form
4. Copy your form endpoint
5. In `index.html`, replace `YOUR_FORM_ID` with your actual Formspree form ID:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### 2. Stripe Setup

1. Go to [Stripe.com](https://stripe.com) and create an account
2. Get your publishable key from the Dashboard
3. In `script.js`, replace `pk_test_YOUR_PUBLISHABLE_KEY` with your actual key:
   ```javascript
   const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
   ```

### 3. Server-Side Payment Processing

For Stripe payments to work, you need a server-side endpoint. You can use:

#### Option A: Cloudflare Workers

Create a Worker at `workers/payment.js`:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'POST' && new URL(request.url).pathname === '/create-payment-intent') {
    const { amount, description } = await request.json()
    
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `amount=${amount}&currency=usd&description=${encodeURIComponent(description)}`,
    })
    
    const paymentIntent = await response.json()
    
    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return new Response('Not found', { status: 404 })
}
```

#### Option B: Cloudflare Pages Functions

Create `functions/create-payment-intent.js`:

```javascript
export async function onRequestPost(context) {
  const { amount, description } = await context.request.json()
  
  const response = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${context.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `amount=${amount}&currency=usd&description=${encodeURIComponent(description)}`,
  })
  
  const paymentIntent = await response.json()
  
  return new Response(JSON.stringify({
    clientSecret: paymentIntent.client_secret
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

### 4. Deploy to Cloudflare Pages

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Navigate to Pages
4. Click "Create a project"
5. Connect your Git repository
6. Configure build settings:
   - Build command: (leave empty for static site)
   - Build output directory: `/`
7. Add environment variables:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
8. Click "Save and Deploy"

### 5. Configure Custom Domain

1. In Cloudflare Pages, go to your project
2. Click on "Custom domains"
3. Add `visumsys.com` and `www.visumsys.com`
4. Follow DNS setup instructions

### 6. Email Configuration

To receive emails at info@visumsys.com:

1. In Cloudflare Dashboard, go to Email Routing
2. Add `visumsys.com` as a domain
3. Create a route: info@visumsys.com → your-personal-email@example.com
4. Verify domain ownership

## File Structure

```
visumsys-website/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # JavaScript (Stripe & interactions)
├── README.md           # This file
└── functions/          # (Optional) Cloudflare Pages Functions
    └── create-payment-intent.js
```

## Customization

### Update Content

Edit `index.html` to update:
- Company information
- Services offered
- Contact details

### Change Colors

Edit `style.css` CSS variables in `:root`:
```css
:root {
    --primary-color: #2563eb;  /* Main brand color */
    --primary-dark: #1e40af;   /* Darker shade */
    /* ... */
}
```

### Add Pages

Create new HTML files and link them in the navigation.

## Security Notes

- Never commit your Stripe secret key to version control
- Use environment variables for sensitive data
- Test payments using Stripe test mode first
- Enable HTTPS (automatic with Cloudflare Pages)

## Support

For issues or questions, contact info@visumsys.com
