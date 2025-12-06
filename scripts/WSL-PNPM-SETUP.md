# Using PNPM in WSL (Windows Subsystem for Linux)

## Quick Setup

Run this in WSL:

```bash
cd /mnt/c/Users/raul/Documents/GitHub/To-Move-List/scripts

# Make the setup script executable
chmod +x setup-pnpm-wsl.sh

# Run the setup script
bash setup-pnpm-wsl.sh
```

## Manual Setup (Alternative)

If the script doesn't work, follow these steps:

### 1. Configure PNPM for WSL

```bash
# Set pnpm to use copy mode instead of hardlinks
pnpm config set package-import-method copy

# Set a Linux-friendly store directory
pnpm config set store-dir ~/.pnpm-store
```

### 2. Clean and Install

```bash
cd /mnt/c/Users/raul/Documents/GitHub/To-Move-List/scripts

# Remove existing installations
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml

# Fix permissions
sudo chown -R $(whoami):$(whoami) .
chmod -R u+w .

# Install with pnpm
pnpm install --no-frozen-lockfile
```

### 3. If Permission Errors Persist

```bash
# Install with elevated permissions
sudo pnpm install --no-frozen-lockfile

# Then fix ownership
sudo chown -R $(whoami):$(whoami) node_modules
```

## Why WSL Has Issues with PNPM

1. **Symlink Permissions**: PNPM uses symlinks, which can have permission issues between Windows and Linux filesystems
2. **Cross-filesystem Operations**: WSL accessing Windows drives (`/mnt/c/`) can cause permission conflicts
3. **File System Differences**: NTFS doesn't fully support Linux permissions

## Solution: Use Copy Mode

The key is configuring pnpm to use **copy mode** instead of hardlinks:

```bash
pnpm config set package-import-method copy
```

This makes pnpm copy files instead of creating links, avoiding permission issues.

## Verify Setup

After installation, verify it works:

```bash
# Check pnpm config
pnpm config list

# Should show:
# package-import-method=copy
# store-dir=/home/yourusername/.pnpm-store

# Test installation
pnpm list --depth=0

# Run tests
pnpm test

# Build CSS
pnpm run build:css
```

## Alternative: Use Native Linux Path

For best results, clone your repo to a native Linux path:

```bash
# Clone to WSL home directory instead of /mnt/c/
cd ~
git clone https://github.com/Romania-Sui-Builders/To-Move-List.git
cd To-Move-List/scripts

# Configure pnpm
pnpm config set package-import-method copy

# Install
pnpm install

# This will work much better!
```

## Commands After Setup

Once configured, use these commands in WSL:

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build TypeScript
pnpm run build

# Build CSS
pnpm run build:css

# Build everything
pnpm run build:all

# Watch CSS changes
pnpm run watch:css

# Development mode
pnpm run dev
```

## Troubleshooting

### Error: "EACCES: permission denied"

```bash
# Fix ownership
sudo chown -R $(whoami):$(whoami) /mnt/c/Users/raul/Documents/GitHub/To-Move-List/scripts

# Retry installation
pnpm install
```

### Error: "ENOENT: no such file or directory"

```bash
# Ensure you're in the correct directory
cd /mnt/c/Users/raul/Documents/GitHub/To-Move-List/scripts
pwd

# Verify package.json exists
ls -la package.json
```

### Still Having Issues?

Use the native Linux filesystem:

```bash
# Copy project to Linux home
cp -r /mnt/c/Users/raul/Documents/GitHub/To-Move-List ~/To-Move-List
cd ~/To-Move-List/scripts

# Install
pnpm install

# Work from here instead
```

## Best Practices

1. ✅ **Use copy mode**: `pnpm config set package-import-method copy`
2. ✅ **Store in Linux path**: Keep pnpm store in `~/.pnpm-store`
3. ✅ **Fix permissions**: Run `sudo chown -R $(whoami):$(whoami) .` if needed
4. ✅ **Use native paths**: Clone to `~/` instead of `/mnt/c/` when possible

## Performance Note

Using `copy` mode is slightly slower than hardlinks but ensures compatibility with WSL. The trade-off is worth it for stability.
