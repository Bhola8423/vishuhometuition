@echo off
npm install
npx wrangler login
echo.
echo Set your private Admin token:
npx wrangler secret put ADMIN_TOKEN
echo.
echo Set your Resend API key:
npx wrangler secret put RESEND_API_KEY
echo.
echo Secrets saved. You can now run: npm run deploy
pause
