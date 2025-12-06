# 🎯 Command Line Execution Plan for To-Move-List dApp

This document provides the exact sequence of commands you need to run to set up and test the project.

## 📋 Phase 1: Initial Setup

### 1.1 Install Dependencies

```powershell
# Navigate to scripts directory
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts

# Install packages (pnpm recommended for speed)
pnpm install
# Or: npm install

# Verify installation
pnpm list --depth=0
# Or: npm list --depth=0
```

Expected output: All dependencies installed without errors.
**Note:** Tailwind CSS is now included for styling!

---

## 🔧 Phase 2: Environment Configuration

### 2.1 Create Environment File

```powershell
# Copy the example file
Copy-Item .env.example .env

# Open in editor
notepad .env
```

### 2.2 Fill in Environment Variables

You need to fill these in `.env`:

```env
SUI_NETWORK=testnet
PACKAGE_ID=0x...  # Will get this after publishing
USER_SECRET_KEY=suiprivkey...  # Your wallet private key
ADMIN_ADDRESS=0x...  # Your wallet address
```

To get your private key and address, run:

```powershell
# Show your active address
sui client active-address

# Export private key (KEEP THIS SECRET!)
sui keytool export --key-identity <your-address>
```

---

## 🏗️ Phase 3: Move Package Setup

### 3.1 Navigate to Move Package

```powershell
# From project root
cd C:\Users\raul\Documents\GitHub\To-Move-List\move\board
```

### 3.2 Build Move Package

```powershell
# Build the package
sui move build

# If successful, you'll see:
# "Build Successful"
```

### 3.3 Run Move Tests

```powershell
# Run tests
sui move test

# Expected: All tests pass (if implemented)
```

---

## 🌐 Phase 4: Sui Network Configuration

### 4.1 Check Current Network

```powershell
# See active network
sui client active-env

# List all networks
sui client envs
```

### 4.2 Add/Switch to Testnet (if needed)

```powershell
# Add testnet if not exists
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

# Switch to testnet
sui client switch --env testnet
```

### 4.3 Get Testnet Tokens

```powershell
# Request testnet SUI tokens (may need to run multiple times)
sui client faucet

# Wait 10-15 seconds, then check balance
sui client gas

# You should see gas objects with balances
```

---

## 🚀 Phase 5: Deploy Smart Contracts

### 5.1 Publish to Sui

```powershell
# Still in C:\Users\raul\Documents\GitHub\To-Move-List\move\board

# Publish the package (adjust gas budget if needed)
sui client publish --gas-budget 100000000

# IMPORTANT: This takes 30-60 seconds
# Watch for "Published Objects" section in output
```

### 5.2 Capture Important Information

From the publish output, copy:

1. **Package ID**: Look for `Package ID │ 0x...`
2. **Shared Objects**: Look for objects with `Shared` in the Owner column
   - This might be your Board Registry or similar

Example output to look for:
```
╭──────────────────────────────────────────────────────╮
│ Object Changes                                        │
├──────────────────────────────────────────────────────┤
│ Created Objects:                                      │
│  ┌──                                                  │
│  │ ObjectID: 0xabc123...                             │
│  │ Owner: Shared                                      │
│  │ ObjectType: 0x...::board::BoardRegistry           │
│  └──                                                  │
╰──────────────────────────────────────────────────────╯
```

### 5.3 Update Environment File

```powershell
# Go back to scripts directory
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts

# Edit .env file
notepad .env

# Update these values:
# PACKAGE_ID=0x... (from publish output)
# BOARD_REGISTRY_ID=0x... (if you have a shared registry object)
```

---

## 🧪 Phase 6: Run Integration Tests

### 6.1 Run TypeScript Tests

```powershell
# Should still be in scripts directory
# C:\Users\raul\Documents\GitHub\To-Move-List\scripts

# Run all tests
npm test

# Expected output:
# ✓ Board Operations
#   ✓ should create a new board
#   ✓ should retrieve board details
#   ✓ should add a member to the board
# ✓ Task Operations
#   ✓ should create a new task
#   ✓ should update task status to IN_PROGRESS
#   ...
```

### 6.2 Development Mode (Optional)

```powershell
# Run dev script
npm run dev

# This will run src/index.ts
```

---

## 🎨 Phase 7: Frontend Setup (Next Step)

### 7.1 Navigate to App Directory

```powershell
cd C:\Users\raul\Documents\GitHub\To-Move-List\app
```

### 7.2 Check if App Exists

```powershell
# List directory contents
ls

# If README.md exists, follow its instructions
# If empty, you need to create the React app first
```

### 7.3 Create React App (if needed)

```powershell
# Using Mysten's dApp template
npm create @mysten/dapp

# Answer prompts:
# - App name: to-move-list-ui
# - Template: react-client-dapp
# - Install dependencies: Yes
```

---

## 🔄 Common Workflows

### Starting Fresh

```powershell
# 1. Clean and rebuild Move package
cd C:\Users\raul\Documents\GitHub\To-Move-List\move\board
sui move build --force

# 2. Run Move tests
sui move test

# 3. Run TypeScript tests
cd ..\..\scripts
npm test
```

### After Code Changes

```powershell
# 1. Rebuild Move package
cd C:\Users\raul\Documents\GitHub\To-Move-List\move\board
sui move build

# 2. Run Move tests
sui move test

# 3. Upgrade package (if already published)
sui client upgrade --gas-budget 100000000

# 4. Update PACKAGE_ID in .env if needed

# 5. Run TypeScript tests
cd ..\..\scripts
npm test
```

### Checking On-Chain State

```powershell
# View an object
sui client object <object-id>

# List your objects
sui client objects <your-address>

# Call a view function (read-only)
sui client call --package <pkg-id> --module board --function get_board_stats --args <board-id>
```

---

## 📊 Verification Checklist

Use this checklist to verify everything works:

- [ ] Dependencies installed (`npm install` in scripts/)
- [ ] `.env` file created with all variables
- [ ] Move package builds successfully (`sui move build`)
- [ ] Move tests pass (`sui move test`)
- [ ] Connected to testnet (`sui client active-env`)
- [ ] Have testnet SUI tokens (`sui client gas`)
- [ ] Package published successfully
- [ ] `PACKAGE_ID` updated in `.env`
- [ ] TypeScript tests pass (`npm test`)
- [ ] Can create boards and tasks

---

## 🆘 Quick Troubleshooting

### Problem: "sui: command not found"

**Solution:**
```powershell
# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

### Problem: "Insufficient gas"

**Solution:**
```powershell
# Request more tokens
sui client faucet

# Wait 15 seconds and try again
```

### Problem: "Package not found"

**Solution:**
- Verify `PACKAGE_ID` in `.env` matches published package
- Ensure you're on the correct network

### Problem: TypeScript errors during npm install

**Solution:**
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problem: Tests timeout

**Solution:**
- Increase `testTimeout` in `jest.config.js` to `60000`
- Check network connectivity
- Verify RPC endpoint is responsive

---

## 🎯 Success Metrics

You've successfully completed setup when:

1. ✅ `npm test` passes all tests
2. ✅ You can view your board on [Sui Explorer](https://suiexplorer.com/?network=testnet)
3. ✅ Tasks are created and updated successfully
4. ✅ No error messages in terminal

---

## 📞 Next Steps

1. **Implement Move Functions**: Fill in the Move contract functions in `board.move`
2. **Run Tests**: Iterate until all tests pass
3. **Build Frontend**: Create React UI in `app/` directory
4. **Deploy & Demo**: Prepare for hackathon demo

Good luck! 🚀
