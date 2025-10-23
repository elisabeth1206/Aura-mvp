# AURA — MVP with Daily Free Limit + Pro CTA

This is a minimal deployable starter for AURA:
- 5 free chat requests per day (localStorage)
- Modal CTA to upgrade to **AURA Pro**
- Serverless function calls OpenAI Chat Completions
- No database yet (keeps it free & simple)

## Quick Deploy (Vercel)
1) Create a project at https://vercel.com/new and drag-drop this folder.
2) In Project → Settings → Environment Variables add:
   - `OPENAI_API_KEY` = your key (server only)
3) Redeploy. Visit your live URL.
4) Edit `/public/index.html` and set:
   - `window.AURA_PRO_LINK = "REPLACE_WITH_STRIPE_PAYMENT_LINK"`
     (You can paste a Stripe Payment Link later.)

## Where to Customize
- `/public/main.js`: daily limit (`DAILY_LIMIT`), quests text
- `/api/coach.js`: coach personas, model, rules
- `/public/styles.css`: colors/branding

## Notes
- The free-uses counter resets daily by comparing `new Date().toDateString()`.
- Because we use localStorage, counts are per-browser (good enough for MVP).
