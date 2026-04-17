// Cloudflare Pages Function for Stripe Payment Intent
// This creates a payment intent on the server side

export async function onRequestPost(context) {
  // Get request data
  const { amount, description } = await context.request.json()
  
  // Validate amount
  if (!amount || amount < 50) {
    return new Response(JSON.stringify({
      error: 'Invalid amount. Minimum is $0.50'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Create payment intent with Stripe
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: 'usd',
        description: description || 'Payment to Visum Systems, LLC',
        'automatic_payment_methods[enabled]': 'true',
      }).toString(),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to create payment intent')
    }
    
    const paymentIntent = await response.json()
    
    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
