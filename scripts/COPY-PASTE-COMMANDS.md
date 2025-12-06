# 🚀 Complete Command Reference - Copy & Paste Ready

## Phase 1: Initial Setup (2 minutes)

### Install Dependencies
```powershell
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts
pnpm install  # Faster and more efficient
# Or: npm install
```

### Create Environment File
```powershell
Copy-Item .env.example .env
notepad .env
```

**Fill in .env with:**
```env
SUI_NETWORK=testnet
PACKAGE_ID=0x...
USER_SECRET_KEY=suiprivkey...
ADMIN_ADDRESS=0x...
```

---

## Phase 2: Get Your Wallet Info (1 minute)

### Show Your Address
```powershell
sui client active-address
```
Copy this to `ADMIN_ADDRESS` in `.env`

### Export Private Key
```powershell
sui keytool export --key-identity <your-address-from-above>
```
Copy the output (starts with `suiprivkey`) to `USER_SECRET_KEY` in `.env`

---

## Phase 3: Network Setup (1 minute)

### Check Network
```powershell
sui client active-env
```

### Switch to Testnet (if needed)
```powershell
sui client switch --env testnet
```

### Get Testnet Tokens
```powershell
sui client faucet
```
Wait 15 seconds, then verify:
```powershell
sui client gas
```

---

## Phase 4: Build & Test Move Contracts (2 minutes)

### Navigate to Move Package
```powershell
cd C:\Users\raul\Documents\GitHub\To-Move-List\move\board
```

### Build
```powershell
sui move build
```

### Test
```powershell
sui move test
```

---

## Phase 5: Deploy to Sui (3 minutes)

### Publish Package
```powershell
sui client publish --gas-budget 100000000
```

**⚠️ IMPORTANT:** This will output a lot of information. Look for:

```
╭───────────────────────────────────────────────────╮
│ Package ID │ 0x1234567890abcdef... │
╰───────────────────────────────────────────────────╯
```

**Copy the Package ID!**

### Update Environment
```powershell
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts
notepad .env
```

Update the line:
```env
PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
```

---

## Phase 6: Run Tests (2 minutes)

### Execute Integration Tests
```powershell
npm test
```

Expected output:
```
PASS  src/tests/e2e.test.ts
  Board Operations
    ✓ should create a new board
    ✓ should retrieve board details
    ✓ should add a member to the board
  Task Operations
    ✓ should create a new task
    ✓ should update task status to IN_PROGRESS
    ✓ should assign task to user
    ✓ should update task status to AWAITING_CHECK
    ✓ should request verification for task
```

---

## Quick Reference Commands

### Check Status
```powershell
# Current network
sui client active-env

# Your address
sui client active-address

# Your balance
sui client gas

# View an object
sui client object <object-id>
```

### Build & Deploy
```powershell
# Build Move code
sui move build

# Run Move tests
sui move test

# Publish new package
sui client publish --gas-budget 100000000

# Upgrade existing package
sui client upgrade --gas-budget 100000000
```

### TypeScript Operations
```powershell
# Run all tests
pnpm test  # Or: npm test

# Run in watch mode
pnpm run test:watch

# Development mode
pnpm run dev

# Build TypeScript
pnpm run build
```

### Tailwind CSS Styling
```powershell
# Tailwind is pre-configured with Sui branding
# Use custom classes:
# - btn-primary, btn-secondary (buttons)
# - card (containers)
# - badge-todo, badge-verified (status badges)
# - input-field (form inputs)
```

---

## Complete Fresh Start (All Commands)

Copy and paste this entire block if starting fresh:

```powershell
# 1. Setup
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts
pnpm install  # Or: npm install
Copy-Item .env.example .env

# 2. Build Move contracts
cd ..\move\board
sui move build
sui move test

# 3. Check network & get tokens
sui client active-env
sui client switch --env testnet
sui client faucet
Start-Sleep -Seconds 15
sui client gas

# 4. Get wallet info
Write-Host "Your Address:" -ForegroundColor Yellow
sui client active-address
Write-Host "`nYour Private Key (copy this to .env):" -ForegroundColor Yellow
sui keytool export

# 5. Deploy (COPY PACKAGE ID FROM OUTPUT!)
sui client publish --gas-budget 100000000

# 6. Update .env (do this manually with the Package ID)
cd ..\..\scripts
notepad .env

# 7. Run tests
pnpm test  # Or: npm test
```

---

## Verification Checklist

Run these to verify everything is working:

```powershell
# ✓ Dependencies installed?
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts
pnpm list --depth=0  # Or: npm list --depth=0

# ✓ Environment configured?
Get-Content .env

# ✓ Move contracts build?
cd ..\move\board
sui move build

# ✓ On correct network?
sui client active-env

# ✓ Have gas tokens?
sui client gas

# ✓ Tests pass?
cd ..\..\scripts
pnpm test  # Or: npm test
```

---

## Troubleshooting Commands

### Reset Everything
```powershell
# Clear node modules
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json, pnpm-lock.yaml -ErrorAction SilentlyContinue
pnpm install  # Or: npm install

# Clean Move build
cd ..\move\board
Remove-Item -Recurse -Force build
sui move build
```

### Check Connection
```powershell
# Test RPC connection
Invoke-WebRequest -Uri "https://fullnode.testnet.sui.io:443" -Method Get

# Check Sui version
sui --version
```

### Get More Tokens
```powershell
# Request multiple times if needed
sui client faucet
Start-Sleep -Seconds 15
sui client faucet
Start-Sleep -Seconds 15
sui client faucet
```

---

## View Results on Explorer

After running tests, view your objects on Sui Explorer:

```powershell
# Get your address
$address = sui client active-address

# Print explorer link
Write-Host "View your objects: https://suiexplorer.com/address/$address?network=testnet" -ForegroundColor Green
```

Or manually visit:
- Testnet: https://suiexplorer.com/?network=testnet
- Search for your address or package ID

---

## Next: Build Frontend

Once tests pass, build the React frontend:

```powershell
cd C:\Users\raul\Documents\GitHub\To-Move-List\app

# Create React app with Sui dApp Kit
npm create @mysten/dapp

# Follow prompts:
# - App name: to-move-list-ui
# - Template: react-client-dapp
# - Install dependencies: Yes
```

---

## Pro Tips

1. **Save Important IDs**: Keep your Package ID, Board IDs in a notepad
2. **Use Watch Mode**: `npm run test:watch` for continuous testing
3. **Check Explorer**: Always verify transactions on Sui Explorer
4. **Gas Buffer**: Use higher gas budget if transactions fail
5. **Network Stability**: Testnet can be slow; be patient

---

## Success! 🎉

When you see all tests passing, you're ready to:
1. ✅ Build the frontend UI
2. ✅ Connect wallet in browser
3. ✅ Create and manage tasks on-chain
4. ✅ Demo your dApp!

**Happy Building! 🚀**
