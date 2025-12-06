# 🐛 Troubleshooting PNPM & Tailwind Installation

## Issue 1: PNPM Permission Errors on WSL

### Problem
```
ERR_PNPM_EACCES  EACCES: permission denied, rename...
```

### Solutions

#### Solution A: Use npm instead (Recommended for WSL)
```bash
# Remove pnpm installation
rm -rf node_modules
rm -f pnpm-lock.yaml

# Use npm
npm install
```

#### Solution B: Fix WSL Permissions
```bash
# Run with sudo (not recommended but works)
sudo pnpm install

# Or fix the permissions
sudo chown -R $(whoami) node_modules
sudo chmod -R u+w node_modules
```

#### Solution C: Install in Windows (Not WSL)
```powershell
# Run in PowerShell (Windows), not WSL
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts
pnpm install
```

---

## Issue 2: Tailwind CLI Not Found

### Problem
```
sh: 1: tailwindcss: not found
```

### Solution: Use npx

The scripts have been updated to use `npx tailwindcss` instead of just `tailwindcss`.

```bash
# Build CSS (now works)
pnpm run build:css
# Or with npm:
npm run build:css

# Watch mode
pnpm run watch:css
# Or with npm:
npm run watch:css
```

---

## Recommended Workflow for WSL Users

### 1. Use npm instead of pnpm
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build CSS
npm run build:css

# Build everything
npm run build:all
```

### 2. Or use pnpm in Windows PowerShell
```powershell
# Open PowerShell (not WSL)
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts

# Install with pnpm
pnpm install

# Run commands
pnpm test
pnpm run build:css
```

---

## Quick Fix Commands

### Clean and Reinstall with npm
```bash
cd /mnt/c/Users/raul/Documents/GitHub/To-Move-List/scripts

# Clean up
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml

# Install with npm
npm install

# Test it works
npm test
```

### Build Tailwind CSS
```bash
# Using the script (recommended)
npm run build:css

# Or directly with npx
npx tailwindcss -i ./src/styles/tailwind.css -o ./dist/styles/tailwind.css

# Watch mode for development
npm run watch:css
```

---

## Why This Happens

### PNPM + WSL Issue
- WSL (Windows Subsystem for Linux) has permission issues with symlinks
- pnpm uses symlinks heavily for efficiency
- Windows filesystem permissions conflict with Linux permissions

### Tailwind CLI Issue
- `tailwindcss` command needs to be in PATH or called via `npx`
- Using `npx tailwindcss` ensures it uses the local installation

---

## Best Practice for Your Setup

Since you're using WSL, I recommend:

### Option 1: Use npm (Simplest)
```bash
# In WSL
npm install
npm test
npm run build:css
```

### Option 2: Use pnpm in PowerShell (Fastest)
```powershell
# In Windows PowerShell
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts
pnpm install
pnpm test
pnpm run build:css
```

---

## Verification Steps

After fixing, verify everything works:

```bash
# 1. Dependencies installed
npm list --depth=0

# 2. Can build CSS
npm run build:css

# 3. Tests pass
npm test

# 4. TypeScript builds
npm run build
```

Expected output for `build:css`:
```
Done in 291ms
```

You should see a new file: `dist/styles/tailwind.css`

---

## Alternative: Skip Tailwind Build for Now

If you just want to run tests and don't need the compiled CSS yet:

```bash
# Just install and test
npm install
npm test

# Skip CSS build - it's only needed for UI components
```

The TypeScript integration tests don't require Tailwind CSS, so you can continue development without it.

---

## Updated Commands

All npm scripts now use `npx` for better compatibility:

```json
{
  "scripts": {
    "build:css": "npx tailwindcss -i ./src/styles/tailwind.css -o ./dist/styles/tailwind.css",
    "watch:css": "npx tailwindcss -i ./src/styles/tailwind.css -o ./dist/styles/tailwind.css --watch"
  }
}
```

This ensures the Tailwind CLI is always found, even in WSL environments.

---

## Quick Start (Fixed)

```bash
# Clean start with npm
cd /mnt/c/Users/raul/Documents/GitHub/To-Move-List/scripts
rm -rf node_modules package-lock.json pnpm-lock.yaml
npm install

# Run tests
npm test

# Build everything
npm run build:all

# Or just TypeScript (skip CSS)
npm run build
```

That's it! You're ready to continue. 🚀
