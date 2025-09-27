#!/bin/bash

# Git Fit Template - Quick Setup Script
# This script helps you quickly set up your own fitness tracking app

echo "🏋️‍♂️ Git Fit Template - Quick Setup"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "mini-app/package.json" ]; then
    echo "❌ Error: Please run this script from the root of the Git Fit template directory"
    exit 1
fi

echo "📋 Setup Checklist:"
echo "1. Fork this repository on GitHub"
echo "2. Clone your fork locally"
echo "3. Run this setup script"
echo "4. Configure environment variables"
echo "5. Set up GitHub OAuth app"
echo "6. Deploy to Xnode"
echo ""

# Create environment file if it doesn't exist
if [ ! -f "mini-app/.env.local" ]; then
    echo "📝 Creating environment file..."
    cp env.template mini-app/.env.local
    echo "✅ Created mini-app/.env.local"
    echo "⚠️  Please edit mini-app/.env.local with your configuration"
else
    echo "✅ Environment file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
cd mini-app
npm install
cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit mini-app/.env.local with your configuration"
echo "2. Create a GitHub OAuth app at: https://github.com/settings/applications/new"
echo "3. Create a repository for workout data"
echo "4. Run 'npm run dev' to test locally"
echo "5. Deploy to Xnode with 'nix run'"
echo ""
echo "📚 Documentation:"
echo "- README.md - Main documentation"
echo "- CUSTOMIZATION.md - Customization guide"
echo "- ARCHITECTURE.md - Technical architecture"
echo ""
echo "🚀 Ready to get fit with Git!"
