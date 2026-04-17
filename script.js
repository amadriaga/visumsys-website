// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Stripe Payment Integration
// Replace 'YOUR_PUBLISHABLE_KEY' with your actual Stripe publishable key
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
const elements = stripe.elements();

// Create card element
const cardElement = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#1e293b',
            '::placeholder': {
                color: '#64748b',
            },
        },
        invalid: {
            color: '#ef4444',
        },
    },
});

// Mount card element
cardElement.mount('#card-element');

// Handle card validation errors
cardElement.on('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Handle payment form submission
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
    paymentForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const submitButton = document.getElementById('submit-payment');
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';

        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;

        try {
            // Create payment intent on your server
            // This is a placeholder - you'll need to implement the server-side endpoint
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100), // Convert to cents
                    description: description,
                }),
            });

            const { clientSecret } = await response.json();

            // Confirm the payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                }
            });

            if (error) {
                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = error.message;
                paymentForm.insertBefore(errorDiv, paymentForm.firstChild);
                setTimeout(() => errorDiv.remove(), 5000);
            } else if (paymentIntent.status === 'succeeded') {
                // Show success message
                const successDiv = document.createElement('div');
                successDiv.className = 'success-message';
                successDiv.textContent = 'Payment successful! Thank you.';
                paymentForm.insertBefore(successDiv, paymentForm.firstChild);
                
                // Reset form
                paymentForm.reset();
                cardElement.clear();
                
                setTimeout(() => successDiv.remove(), 5000);
            }
        } catch (error) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'An error occurred. Please try again.';
            paymentForm.insertBefore(errorDiv, paymentForm.firstChild);
            setTimeout(() => errorDiv.remove(), 5000);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Process Payment';
        }
    });
}

// Handle contact form submission with Formspree
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        // Formspree will handle the submission
        // You can add custom success/error handling here if needed
        const submitButton = contactForm.querySelector('.btn-submit');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
    });
}
