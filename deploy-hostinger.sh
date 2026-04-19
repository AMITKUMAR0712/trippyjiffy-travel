#!/bin/bash

# ============================================
# Hostinger Frontend Deployment Script
# ============================================

echo "🚀 Starting Hostinger Deployment..."

# Navigate to your Frontend directory
# Adjust path based on your actual directory structure
cd /home/your_hostinger_username/public_html/Frontend

echo "📥 Pulling latest code from GitHub..."
git pull origin master

echo "📦 Installing dependencies..."
npm install --production

echo "🔨 Building production bundle..."
npm run build

echo "📂 Copying build to web root..."
# Option A: If build output is 'dist' folder
cp -r dist/* /home/your_hostinger_username/public_html/

# Option B: Or copy to specific public folder
# cp -r dist/* /home/your_hostinger_username/public_html/assets/

echo "🧹 Clearing cache..."
# Optional: Clear any cache if applicable
rm -rf /tmp/vite-* 2>/dev/null || true

echo "✅ Deployment Complete!"
echo "🌐 Visit: https://trippyjiffy.com"
echo ""
echo "📋 Verify deployment:"
echo "   1. Open browser console (F12)"
echo "   2. Check for errors"
echo "   3. Try navigating different pages"
echo "   4. Look for 'c.map' or '/undefined' errors - should be GONE ✓"
