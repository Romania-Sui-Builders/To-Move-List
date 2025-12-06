#!/bin/bash
# PNPM Setup Script for WSL
# This script fixes permission issues when using pnpm in WSL

echo "🔧 Setting up PNPM for WSL..."

# Check if we're in WSL
if ! grep -q microsoft /proc/version; then
    echo "⚠️  This script is designed for WSL. Run it in WSL, not Windows PowerShell."
    exit 1
fi

# Get the current directory
PROJECT_DIR="/mnt/c/Users/raul/Documents/GitHub/To-Move-List/scripts"

echo "📂 Working directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || exit 1

# Clean existing installations
echo "🧹 Cleaning existing node_modules..."
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml

# Fix permissions on the project directory
echo "🔐 Fixing permissions..."
sudo chown -R $(whoami):$(whoami) .
chmod -R u+w .

# Install pnpm if not already installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Configure pnpm for WSL
echo "⚙️  Configuring pnpm for WSL..."
pnpm config set store-dir ~/.pnpm-store
pnpm config set package-import-method copy

# Install dependencies
echo "📥 Installing dependencies with pnpm..."
pnpm install --no-frozen-lockfile

# Verify installation
if [ -d "node_modules" ]; then
    echo "✅ Installation successful!"
    echo ""
    echo "You can now run:"
    echo "  pnpm test"
    echo "  pnpm run build:css"
    echo "  pnpm run build"
else
    echo "❌ Installation failed. Try running with sudo:"
    echo "  sudo bash setup-pnpm-wsl.sh"
fi
