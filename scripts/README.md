# TypeScript Integration Scripts & Tests

This directory contains TypeScript integration scripts and E2E tests for the To-Move-List dApp. It provides helper functions to interact with the Sui blockchain and the Move smart contracts.

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js & npm/pnpm**: Version 18+ recommended
2. **Sui CLI**: Install from [Sui Documentation](https://docs.sui.io/build/install)
3. **A Sui Wallet**: With testnet/devnet SUI tokens for gas fees

## 🎨 Styling with Tailwind CSS

This project includes Tailwind CSS for styling. The configuration includes:

- **Custom Sui color palette** (`sui-blue`, `sui-dark`, `sui-light`)
- **Pre-built component classes** (buttons, cards, badges, inputs)
- **Task status badges** for visual status indication
- **PostCSS** for processing Tailwind directives

## 🚀 Quick Start

### Step 1: Install Dependencies

```powershell
# Navigate to scripts directory
cd scripts

# Install dependencies (choose one):
npm install
# OR
pnpm install
# OR
yarn install

# Tailwind CSS is now installed and configured!
# Custom styles available in src/styles/tailwind.css
```

### Step 2: Set Up Environment

```powershell
# Copy the example environment file
Copy-Item .env.example .env

# Edit the .env file with your details
notepad .env
```

**Required environment variables:**
- `SUI_NETWORK`: Network to use (testnet, devnet, localnet, mainnet)
- `PACKAGE_ID`: Your deployed Move package ID
- `USER_SECRET_KEY`: Your wallet private key

**Optional variables:**
- `BOARD_REGISTRY_ID`: Shared board registry object ID
- `ADMIN_ADDRESS`: Admin wallet address
- `SUI_RPC_URL`: Custom RPC endpoint

### Step 3: Build the Move Package

```powershell
# Navigate to the Move package directory
cd ../move/board

# Build the Move package
sui move build

# Run Move tests
sui move test
```

### Step 4: Deploy to Sui Network

```powershell
# Make sure you're using the correct network
sui client active-env

# Switch network if needed
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet

# Check your addresses
sui client addresses

# Switch to the address you want to deploy from
sui client switch --address <your-address>

# Request testnet tokens (if on testnet)
sui client faucet

# Publish the package
sui client publish --gas-budget 100000000
```

**Important:** After publishing, copy the Package ID from the output and update your `.env` file!

Example output:
```
╭──────────────────────────────────────────────────────────╮
│ Package ID │ 0x1234567890abcdef...                      │
╰──────────────────────────────────────────────────────────╯
```

### Step 5: Initialize the Board Registry (if needed)

If your Move package has an `init` function that creates shared objects, they'll be created automatically during publish. Look for shared object IDs in the publish output and add them to your `.env` file.

### Step 6: Run Tests

```powershell
# Navigate back to scripts directory
cd ../../scripts

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Available Commands

### Development Commands

```powershell
# Install dependencies
npm install

# Run development script
npm run dev

# Build TypeScript
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

### Sui CLI Commands

```powershell
# Network Management
sui client active-env                    # Show active network
sui client envs                          # List all networks
sui client new-env --alias <name> --rpc <url>  # Add new network
sui client switch --env <network>        # Switch network

# Account Management
sui client addresses                     # List addresses
sui client active-address                # Show active address
sui client switch --address <address>    # Switch address
sui client new-address <scheme>          # Create new address (ed25519/secp256k1)

# Getting Tokens
sui client faucet                        # Request testnet tokens
sui client gas                           # Show gas objects

# Package Management
sui move build                           # Build Move package
sui move test                            # Run Move tests
sui client publish --gas-budget 100000000  # Publish package
sui client upgrade --gas-budget 100000000  # Upgrade package

# Object Queries
sui client object <object-id>            # Get object details
sui client objects <address>             # List objects owned by address
sui client dynamic-field <parent-id>     # Query dynamic fields

# Transaction Execution
sui client call --package <pkg-id> --module <module> --function <fn> --args <args>
```

## 🏗️ Project Structure

```
scripts/
├── src/
│   ├── helpers/
│   │   ├── boardHelpers.ts    # Board operations (create, add members)
│   │   └── taskHelpers.ts     # Task operations (create, update, assign)
│   ├── tests/
│   │   └── e2e.test.ts        # End-to-end integration tests
│   ├── styles/
│   │   └── tailwind.css       # Tailwind CSS with custom Sui theme
│   ├── env.ts                 # Environment configuration
│   ├── suiClient.ts           # Sui client setup
│   ├── signer.ts              # Wallet signer utilities
│   └── index.ts               # Main exports
├── .env.example               # Example environment file
├── .gitignore                 # Git ignore rules
├── jest.config.js             # Jest test configuration
├── package.json               # Node.js dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── README.md                  # This file
└── TAILWIND-GUIDE.md          # Complete Tailwind usage guide
```

## 🔧 Helper Functions

### Board Operations

```typescript
import { createBoard, addMember, getBoardDetails } from './helpers/boardHelpers';

// Create a new board
const { boardId } = await createBoard(
  'My Board',
  'Board description',
  verifierAddress
);

// Add a member with role (1=Contributor, 2=Admin)
await addMember(boardId, memberAddress, 1);

// Get board details
const details = await getBoardDetails(boardId);
```

### Task Operations

```typescript
import {
  createTask,
  updateTaskStatus,
  assignTask,
  requestVerification,
} from './helpers/taskHelpers';

// Create a task
const { taskId } = await createTask(
  boardId,
  'Task Title',
  'Task description',
  0,        // category
  10,       // weight percentage
  dueDate   // timestamp in ms
);

// Update status (0=TODO, 1=IN_PROGRESS, 2=AWAITING_CHECK, 3=VERIFIED, 4=FAILED)
await updateTaskStatus(boardId, taskId, 1);

// Assign task
await assignTask(boardId, taskId, assigneeAddress);

// Request verification
await requestVerification(boardId, taskId, proofHash, commitHash);
```

## 🧪 Testing Strategy

The E2E tests cover:

1. **Board Operations**
   - Creating boards
   - Adding members
   - Querying board details

2. **Task Operations**
   - Creating tasks
   - Updating task status
   - Assigning tasks
   - Requesting verification

3. **Full Workflow**
   - Complete task lifecycle from creation to verification

Run tests with:
```powershell
npm test
```

## 🔐 Security Notes

- **Never commit your `.env` file** - it contains your private key!
- Use a separate wallet for testing/development
- Keep your private keys secure
- Verify transaction details before signing

## 🐛 Troubleshooting

### "Cannot find module '@mysten/sui'"

Run `npm install` to install dependencies.

### "Missing required environment variable"

Check your `.env` file has all required variables set correctly.

### PNPM Permission Errors on WSL

If you get `EACCES` errors with pnpm in WSL, use npm instead:
```bash
rm -rf node_modules pnpm-lock.yaml
npm install
```

Or run pnpm in Windows PowerShell instead of WSL.

### "tailwindcss: command not found"

Scripts have been updated to use `npx tailwindcss`. If issues persist:
```bash
npm run build:css  # Uses npx automatically
```

See `TROUBLESHOOTING.md` for complete solutions.

### "Insufficient gas"

Request more tokens:
```powershell
sui client faucet
```

### "Package not found"

Ensure you've published your Move package and updated `PACKAGE_ID` in `.env`.

### "Object not found"

- Verify the object ID is correct
- Check you're on the right network
- Ensure the object wasn't deleted or transferred

### Tests timing out

Increase Jest timeout in `jest.config.js`:
```javascript
testTimeout: 60000, // 60 seconds
```

## 📚 Resources

- [Sui Documentation](https://docs.sui.io/)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [Move Language Book](https://move-book.com/)
- [Sui Move by Example](https://examples.sui.io/)
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [PNPM](https://pnpm.io/) - Fast, disk space efficient package manager

## 🎨 Tailwind CSS

This project includes Tailwind CSS with custom Sui branding:

- **Custom colors**: `sui-blue`, `sui-dark`, `sui-light`
- **Pre-built components**: buttons, cards, badges, inputs
- **Task status badges**: Color-coded for each status
- **Responsive utilities**: Mobile-first design

See `TAILWIND-GUIDE.md` for complete styling documentation.

## 🎯 Next Steps

After running the integration tests successfully:

1. **Build the React Frontend** - See `../app/README.md`
2. **Deploy to Testnet** - Test with real network conditions
3. **Set up CI/CD** - Automate testing and deployment
4. **Add More Tests** - Cover edge cases and error scenarios

## 📞 Support

For issues or questions:
- Check the [Sui Discord](https://discord.gg/sui)
- Review [Sui GitHub Discussions](https://github.com/MystenLabs/sui/discussions)
- Open an issue in this repository
