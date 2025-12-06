# 🗺️ Command Execution Flowchart

This is your visual guide to executing all commands in the correct order.

## 📍 START HERE

```
┌─────────────────────────────────────────────────────────────────┐
│                     🎯 STEP 1: SETUP                            │
│  Location: C:\Users\raul\Documents\GitHub\To-Move-List\scripts  │
│                                                                  │
│  Commands:                                                       │
│    pnpm install  # Or: npm install                               │
│    Copy-Item .env.example .env                                   │
│    notepad .env                                                  │
│                                                                  │
│  Expected: ✅ Dependencies installed, .env file created         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                  🔑 STEP 2: GET WALLET INFO                     │
│  Location: Any directory                                         │
│                                                                  │
│  Commands:                                                       │
│    sui client active-address                                     │
│    sui keytool export --key-identity <address>                   │
│                                                                  │
│  Action:                                                         │
│    Copy address → ADMIN_ADDRESS in .env                         │
│    Copy private key → USER_SECRET_KEY in .env                   │
│                                                                  │
│  Expected: ✅ .env file has wallet info                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                 🌐 STEP 3: NETWORK SETUP                        │
│  Location: Any directory                                         │
│                                                                  │
│  Commands:                                                       │
│    sui client active-env                                         │
│    sui client switch --env testnet                               │
│    sui client faucet                                             │
│    (wait 15 seconds)                                             │
│    sui client gas                                                │
│                                                                  │
│  Expected: ✅ On testnet with gas tokens                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│             🏗️ STEP 4: BUILD MOVE CONTRACTS                     │
│  Location: ..\move\board                                         │
│                                                                  │
│  Commands:                                                       │
│    cd C:\Users\raul\Documents\GitHub\To-Move-List\move\board    │
│    sui move build                                                │
│    sui move test                                                 │
│                                                                  │
│  Expected: ✅ Build successful, tests pass                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│              🚀 STEP 5: DEPLOY TO SUI                           │
│  Location: ..\move\board                                         │
│                                                                  │
│  Commands:                                                       │
│    sui client publish --gas-budget 100000000                     │
│                                                                  │
│  Action:                                                         │
│    ⚠️ WAIT for output (30-60 seconds)                           │
│    📋 COPY Package ID from output                               │
│                                                                  │
│  Expected: ✅ Transaction successful, Package ID obtained       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│            ✏️ STEP 6: UPDATE ENVIRONMENT                        │
│  Location: ..\..\scripts                                         │
│                                                                  │
│  Commands:                                                       │
│    cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts       │
│    notepad .env                                                  │
│                                                                  │
│  Action:                                                         │
│    Update: PACKAGE_ID=0xYOUR_PACKAGE_ID                         │
│    Save and close                                                │
│                                                                  │
│  Expected: ✅ .env has Package ID                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                 🧪 STEP 7: RUN TESTS                            │
│  Location: scripts                                               │
│                                                                  │
│  Commands:                                                       │
│    npm test                                                      │
│                                                                  │
│  Expected: ✅ All tests pass                                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
                    ┌──────┴──────┐
                    │             │
              [Success]      [Failure]
                    │             │
                    ↓             ↓
        ┌──────────────┐    ┌─────────────┐
        │   🎉 DONE!   │    │ Troubleshoot│
        │              │    │ See below ↓ │
        └──────────────┘    └─────────────┘
```

---

## 🔄 Alternative Paths

### Path A: If You Need More Tokens

```
sui client gas
     │
     ↓
[Balance < 1 SUI?]
     │
     ↓ YES
sui client faucet
     │
     ↓
Start-Sleep -Seconds 15
     │
     ↓
sui client gas
     │
     ↓
[Still low?]
     │
     ↓ YES
Repeat faucet command
```

### Path B: If Build Fails

```
sui move build
     │
     ↓
[Build failed?]
     │
     ↓ YES
Read error message
     │
     ↓
[Syntax error?]
     │
     ↓ YES
Fix code in sources/board.move
     │
     ↓
sui move build (retry)
```

### Path C: If Tests Fail

```
npm test
     │
     ↓
[Tests failed?]
     │
     ↓ YES
Check error message
     │
     ├─→ [Package not found?] → Check PACKAGE_ID in .env
     │
     ├─→ [Gas error?] → Run sui client faucet
     │
     ├─→ [Network error?] → Check sui client active-env
     │
     └─→ [Other error?] → Read error details
```

---

## 🎯 Decision Tree

```
Start
  │
  ├─→ [First time?]
  │    └─→ YES → Follow STEP 1-7 above
  │
  ├─→ [Already published?]
  │    └─→ YES → Only run: npm test
  │
  ├─→ [Code changed?]
  │    └─→ YES → STEP 4: Build → STEP 5: Deploy → STEP 7: Test
  │
  └─→ [New feature?]
       └─→ YES → Edit code → STEP 4 → STEP 5 → STEP 7
```

---

## 📊 Time Estimates

| Step | Estimated Time | Can Fail? |
|------|---------------|-----------|
| 1. Setup | 2 minutes | ❌ No |
| 2. Wallet Info | 1 minute | ❌ No |
| 3. Network | 2 minutes | ⚠️ Maybe (faucet) |
| 4. Build | 1 minute | ✅ Yes (syntax) |
| 5. Deploy | 2 minutes | ✅ Yes (gas) |
| 6. Update .env | 30 seconds | ❌ No |
| 7. Test | 2 minutes | ✅ Yes (config) |
| **TOTAL** | **~10 minutes** | |

---

## 🔍 Verification Points

At each step, verify success:

```
Step 1: npm install
  ✓ Check: node_modules/ folder exists
  ✓ Check: No error messages

Step 2: Wallet info
  ✓ Check: sui client active-address shows address
  ✓ Check: .env has USER_SECRET_KEY filled

Step 3: Network
  ✓ Check: sui client active-env shows "testnet"
  ✓ Check: sui client gas shows objects with balance

Step 4: Build
  ✓ Check: Output says "Build Successful"
  ✓ Check: build/ folder created

Step 5: Deploy
  ✓ Check: Transaction succeeds
  ✓ Check: Package ID shown in output

Step 6: Update
  ✓ Check: .env has PACKAGE_ID=0x...

Step 7: Test
  ✓ Check: All tests pass (green checkmarks)
  ✓ Check: No test failures
```

---

## 🚨 Common Error Paths

### Error: "sui: command not found"
```
Error Detected
     ↓
Install Sui CLI
     ↓
cargo install --locked --git https://github.com/MystenLabs/sui.git sui
     ↓
Retry command
```

### Error: "Insufficient gas"
```
Error Detected
     ↓
sui client faucet
     ↓
Wait 15 seconds
     ↓
sui client gas (verify)
     ↓
Retry command
```

### Error: "Package not found"
```
Error Detected
     ↓
Check PACKAGE_ID in .env
     ↓
[Correct?]
  ├─→ NO → Update with correct ID
  └─→ YES → Check network (sui client active-env)
```

### Error: "Tests timeout"
```
Error Detected
     ↓
Edit jest.config.js
     ↓
Set: testTimeout: 60000
     ↓
Retry: npm test
```

---

## 📈 Success Flow

```
     START
       ↓
  Install deps
       ↓
  Setup .env
       ↓
  Get wallet info
       ↓
  Setup network
       ↓
  Build contracts
       ↓
  Deploy to Sui
       ↓
  Update .env
       ↓
  Run tests
       ↓
    SUCCESS! 🎉
       ↓
  Build frontend (next)
```

---

## 🎮 Command Cheat Sheet

### Most Used
```powershell
pnpm install             # Install dependencies (recommended)
npm install              # Alternative
pnpm test                # Run tests
sui move build           # Build Move code
sui client publish       # Deploy to Sui
sui client faucet        # Get tokens
```

### Status Checks
```powershell
sui client active-env    # Current network
sui client gas           # Token balance
sui client active-address # Your address
npm list --depth=0       # Installed packages
```

### Navigation
```powershell
cd C:\Users\raul\Documents\GitHub\To-Move-List\scripts  # Scripts dir
cd ..\move\board         # Move dir
cd ..\..\scripts         # Back to scripts
```

---

## 🎯 What to Do When

### When Starting Fresh
→ Follow STEP 1-7 in order

### When Code Changes
→ STEP 4 (Build) → STEP 5 (Deploy) → STEP 7 (Test)

### When Testing Only
→ STEP 7 (npm test)

### When Network Issues
→ STEP 3 (Network Setup)

### When Gas Issues
→ sui client faucet → wait → retry

---

## 📞 Help Decision Tree

```
Need help?
    │
    ├─→ [Setup issue?] → Read: COMMANDS.md
    │
    ├─→ [Quick question?] → Check: QUICKSTART.md
    │
    ├─→ [Code example?] → See: EXAMPLES.md
    │
    ├─→ [Architecture?] → Read: PROJECT-STRUCTURE.md
    │
    └─→ [Commands?] → Use: COPY-PASTE-COMMANDS.md
```

---

## 🏁 Final Checklist

Before moving to frontend, verify:

- [ ] npm install completed
- [ ] .env file configured
- [ ] Move contracts build
- [ ] Package deployed
- [ ] All tests pass
- [ ] Can see objects on Sui Explorer

If all checked: **You're ready for the frontend! 🚀**

---

## 🎬 Next Steps After Success

```
Tests Pass ✅
     ↓
Build React App
     ↓
Integrate with Scripts
     ↓
Deploy Frontend
     ↓
Demo Ready! 🎉
```

Good luck! 🍀
