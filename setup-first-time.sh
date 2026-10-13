#!/usr/bin/env sh
set -e
npm install
npx wrangler login
printf '\nSet your private Admin token:\n'
npx wrangler secret put ADMIN_TOKEN
printf '\nSet your Resend API key:\n'
npx wrangler secret put RESEND_API_KEY
printf '\nSecrets saved. You can now run: npm run deploy\n'
