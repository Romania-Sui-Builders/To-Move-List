# Quick Start Guide - One Page Reference

## ⚡ Installation (5 minutes)

```powershell
# 1. Install dependencies
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts

# Use npm (recommended for WSL users) or pnpm (in PowerShell)
npm install
# Or in PowerShell: pnpm install

# 2. Setup environment
Copy-Item .env.example .env
notepad .env  # Fill in your details

# 3. Build Move contracts
cd ..\move\board
sui move build
sui move test
```

## 🚀 Deploy & Test (10 minutes)

```powershell
# 1. Switch to testnet
sui client switch --env testnet

# 2. Get tokens
sui client faucet

# 3. Publish package
sui client publish --gas-budget 100000000
# ⚠️ Copy Package ID from output!

# 4. Update .env with Package ID
cd ..\..\scripts
notepad .env  # Add PACKAGE_ID=0x...

# 5. Run tests
npm test
```

## 📝 Essential Commands

### Sui CLI
```powershell
sui client active-env              # Check network
sui client switch --env testnet    # Switch to testnet
sui client faucet                  # Get tokens
sui client gas                     # Check balance
sui client active-address          # Your address
sui move build                     # Build contracts
sui move test                      # Test contracts
sui client publish --gas-budget 100000000  # Deploy
```

### Package Manager Scripts
```powershell
pnpm install      # Install dependencies (recommended)
npm install       # Or use npm
pnpm test         # Run tests
pnpm run dev      # Development mode
pnpm run build    # Build TypeScript
```

## 🔑 Environment Variables (.env)

```env
SUI_NETWORK=testnet
PACKAGE_ID=0x...          # From publish output
USER_SECRET_KEY=suiprivkey...  # From: sui keytool export
ADMIN_ADDRESS=0x...       # From: sui client active-address
```

## 📂 Project Structure

```
To-Move-List/
├── move/board/           # Smart contracts
│   ├── sources/
│   │   └── board.move   # Main contract
│   └── tests/
│       └── board_tests.move
├── scripts/             # TypeScript integration ← YOU ARE HERE
│   ├── src/
│   │   ├── helpers/     # Board & Task helpers
│   │   ├── tests/       # E2E tests
│   │   └── *.ts        # Config files
│   └── package.json
└── app/                 # React frontend (next step)
```

## ✅ Verification Steps

1. `npm install` completes without errors
2. `.env` file exists with all variables filled
3. `sui move build` succeeds
4. `sui move test` passes
5. `sui client faucet` gives you tokens
6. `sui client publish` returns Package ID
7. `npm test` passes all tests

## 🎯 What Each File Does

- **boardHelpers.ts**: Create boards, add members
- **taskHelpers.ts**: Create tasks, update status, assign
- **e2e.test.ts**: Integration tests for all operations
- **env.ts**: Load and validate environment variables
- **suiClient.ts**: Configure Sui blockchain connection
- **signer.ts**: Wallet signing utilities

## 🆘 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| "sui: command not found" | Install Sui CLI: `cargo install --locked --git https://github.com/MystenLabs/sui.git sui` |
| "Insufficient gas" | Run `sui client faucet` and wait 15 seconds |
| "Package not found" | Check `PACKAGE_ID` in `.env` matches published package |
| Tests timeout | Increase timeout in `jest.config.js` to `60000` |
| Import errors | Run `npm install` again |

## 🔄 Development Workflow

```powershell
# Make changes to Move contracts
cd move\board
sui move build

# Test changes
sui move test

# If tests pass, upgrade on-chain
sui client upgrade --gas-budget 100000000

# Run TypeScript tests
cd ..\..\scripts
npm test
```

## 🌐 Useful Links

- [Sui Explorer](https://suiexplorer.com/?network=testnet) - View transactions
- [Sui Docs](https://docs.sui.io/) - Official documentation
- [Sui Discord](https://discord.gg/sui) - Community support

## 📋 Next Steps

1. ✅ Complete this setup
2. 🎨 Build React frontend in `app/` directory
3. 🚀 Deploy to mainnet
4. 🏆 Demo at hackathon!

---

**Need more details?** See:
- `README.md` - Full documentation
- `COMMANDS.md` - Detailed command guide
