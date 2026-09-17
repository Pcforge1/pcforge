PCForge starter site

WHAT'S INCLUDED
- PC part picker
- Live build total
- $75 assembly/testing fee
- Stripe Checkout redirect
- Supabase parts + order database
- Supabase checkout Edge Function
- Supabase Stripe webhook Edge Function

YOUR SUPABASE PROJECT
https://oasckbwthiavmyuhmyiz.supabase.co

IMPORTANT SETUP
1. In Supabase Edge Function secrets, set:
   STRIPE_SECRET_KEY=your Stripe test secret key
   STRIPE_WEBHOOK_SECRET=your Stripe webhook signing secret
   SUPABASE_SERVICE_ROLE_KEY=your Supabase service-role key

2. The checkout function is:
   /functions/v1/pc-checkout

3. The webhook function is:
   /functions/v1/pc-stripe-webhook

4. In Stripe Test mode, create a webhook endpoint pointing to:
   https://oasckbwthiavmyuhmyiz.supabase.co/functions/v1/pc-stripe-webhook
   Enable checkout.session.completed.

5. Serve this folder from any static host. For local testing:
   python3 -m http.server 3000

6. IMPORTANT: because Stripe keys and business accounts involve legal/payment requirements, have a parent/guardian handle the Stripe account if required by Stripe's age/account rules.

CUSTOMIZE
- Change the $75 build fee in app.js and the database RPC if you want a different fee.
- Replace the sample parts/prices in Supabase with the real inventory you intend to sell.
- Rename PCForge in index.html when you choose your final brand.
