@echo off
echo ====================================================
echo  VISHU HOME TUITION - CLOUDFLARE DEPLOYMENT
echo ====================================================
echo [1/2] Compiling latest frontend build...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Build failed! Please check errors above.
  pause
  exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Deploying Worker and Assets to Cloudflare...
call npx wrangler deploy
echo.
pause

