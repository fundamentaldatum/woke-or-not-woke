#!/bin/bash

# Woke or Not Woke - Deployment Script.
# This script builds the application and provides instructions for deploying to Cloudflare Pages

echo "🚀 Building Woke or Not Woke for deployment..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo ""
  echo "📋 Deployment Instructions:"
  echo "1. Commit and push these changes to your GitHub repository:"
  echo "   git add ."
  echo "   git commit -m \"Prepare for Cloudflare Pages deployment\""
  echo "   git push origin main"
  echo ""
  echo "2. In Cloudflare Pages dashboard:"
  echo "   - Ensure build command is set to: npm run build"
  echo "   - Ensure build output directory is set to: dist"
  echo "   - Ensure environment variable VITE_CONVEX_URL is set correctly"
  echo ""
  echo "3. After deployment, configure custom domains:"
  echo "   - wokeornotwoke.org"
  echo "   - wokeornotwoke.com"
  echo ""
  echo "🎉 Your application should now be deployed to Cloudflare Pages!"
else
  echo "❌ Build failed. Please fix the errors and try again."
fi
