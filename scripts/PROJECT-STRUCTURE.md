# 📁 Project Structure & File Overview

## Directory Tree

```
To-Move-List/
│
├── move/board/                    # Sui Move Smart Contracts
│   ├── sources/
│   │   └── board.move            # Main contract (boards, tasks, members)
│   ├── tests/
│   │   └── board_tests.move      # Move unit tests
│   └── Move.toml                 # Move package manifest
│
├── scripts/                       # TypeScript Integration ⭐ CURRENT
│   ├── src/
│   │   ├── helpers/
│   │   │   ├── boardHelpers.ts   # Board CRUD operations
│   │   │   └── taskHelpers.ts    # Task CRUD operations
│   │   ├── tests/
│   │   │   └── e2e.test.ts      # Integration tests
│   │   ├── env.ts               # Environment config loader
│   │   ├── suiClient.ts         # Sui RPC client setup
│   │   ├── signer.ts            # Wallet/keypair management
│   │   └── index.ts             # Main exports
│   ├── .env.example             # Environment template
│   ├── .gitignore               # Git ignore rules
│   ├── jest.config.js           # Jest test config
│   ├── package.json             # Node dependencies
│   ├── tsconfig.json            # TypeScript config
│   ├── README.md                # Full documentation
│   ├── COMMANDS.md              # Detailed command guide
│   ├── QUICKSTART.md            # One-page quick reference
│   ├── EXAMPLES.md              # Usage examples
│   ├── COPY-PASTE-COMMANDS.md   # Ready-to-run commands
│   └── PROJECT-STRUCTURE.md     # This file
│
├── app/                          # React Frontend (To Be Built)
│   └── README.md                # Frontend instructions
│
├── planning.md                   # Full project specification
├── README.md                     # Main project readme
└── LICENSE                       # License file
```

## 🎯 What Each Component Does

### Move Contracts (`/move/board/`)

The blockchain layer - defines the on-chain data structures and business logic.

**Key Concepts:**
- **Board**: Container for tasks, members, and permissions
- **Task**: Work items with status, assignees, and verification
- **Members**: Role-based access control (Contributor, Admin)
- **Workflow**: Configurable task states and transitions

### TypeScript Scripts (`/scripts/`) ⭐

The integration layer - connects frontend to blockchain.

**Core Files:**

#### Configuration
- `env.ts` - Loads and validates `.env` variables
- `suiClient.ts` - Configures Sui RPC connection
- `signer.ts` - Manages wallet keypair for signing

#### Helpers
- `boardHelpers.ts`:
  - `createBoard()` - Deploy new board
  - `addMember()` - Add user with role
  - `getBoardDetails()` - Query board state

- `taskHelpers.ts`:
  - `createTask()` - Create new task
  - `updateTaskStatus()` - Change task state
  - `assignTask()` - Assign to user
  - `requestVerification()` - Submit for review
  - `getTaskDetails()` - Query task state

#### Tests
- `e2e.test.ts` - Full workflow integration tests

### React Frontend (`/app/`)

The user interface layer - provides web UI for users.

**To Be Built With:**
- `@mysten/create-dapp` - Bootstrap tool
- `@mysten/dapp-kit` - Wallet connection
- React + Vite - UI framework

## 📊 Data Flow

```
User Action (Browser)
       ↓
React Frontend (app/)
       ↓
TypeScript Helpers (scripts/src/helpers/)
       ↓
Sui SDK (@mysten/sui)
       ↓
Sui RPC Endpoint
       ↓
Sui Blockchain
       ↓
Move Smart Contracts (move/board/)
```

## 🔄 Development Workflow

### 1. Develop Move Contracts
```
Edit: move/board/sources/board.move
Test: sui move test
Build: sui move build
```

### 2. Deploy to Blockchain
```
Deploy: sui client publish
Result: Package ID + Object IDs
```

### 3. Update Environment
```
Edit: scripts/.env
Add: PACKAGE_ID=0x...
```

### 4. Test Integration
```
Run: npm test
Verify: All tests pass
```

### 5. Build Frontend
```
Create: React app in app/
Connect: Use helpers from scripts/
Deploy: Host on Vercel/Netlify
```

## 📦 Key Dependencies

### Move (`Move.toml`)
- **Sui Framework**: Core blockchain types
- **Standard Library**: Basic utilities

### TypeScript (`package.json`)
- **@mysten/sui** `^1.14.0` - Sui SDK
- **dotenv** `^16.4.5` - Environment variables
- **jest** `^29.7.0` - Testing framework
- **typescript** `^5.3.3` - Type safety
- **tailwindcss** `^3.4.0` - Utility-first CSS framework
- **autoprefixer** `^10.4.16` - PostCSS plugin
- **postcss** `^8.4.32` - CSS transformation

### React (To Be Added)
- **@mysten/dapp-kit** - Wallet connection
- **react** - UI library
- **vite** - Build tool

## 🗂️ File Purposes by Category

### Configuration Files
| File | Purpose |
|------|---------|
| `.env` | Secret keys and addresses |
| `tsconfig.json` | TypeScript compiler settings |
| `jest.config.js` | Test runner configuration |
| `package.json` | Dependencies and scripts |
| `Move.toml` | Move package manifest |

### Source Files
| File | Purpose |
|------|---------|
| `board.move` | Smart contract logic |
| `boardHelpers.ts` | Board operation wrappers |
| `taskHelpers.ts` | Task operation wrappers |
| `suiClient.ts` | Blockchain connection |
| `signer.ts` | Transaction signing |

### Test Files
| File | Purpose |
|------|---------|
| `board_tests.move` | Move unit tests |
| `e2e.test.ts` | Integration tests |

### Documentation Files
| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `COMMANDS.md` | Step-by-step guide |
| `QUICKSTART.md` | Quick reference |
| `EXAMPLES.md` | Code examples |
| `COPY-PASTE-COMMANDS.md` | Ready commands |
| `PROJECT-STRUCTURE.md` | This file |

## 🎨 Frontend Structure (Future)

When you build the React app, it will look like:

```
app/
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx
│   │   ├── BoardList.tsx
│   │   ├── BoardView.tsx
│   │   ├── TaskCard.tsx
│   │   └── CreateTask.tsx
│   ├── hooks/
│   │   ├── useBoards.ts
│   │   └── useTasks.ts
│   ├── utils/
│   │   └── sui.ts              # Import from ../scripts/src/
│   └── App.tsx
├── package.json
└── vite.config.ts
```

## 🔐 Security Notes

### Never Commit
- `.env` file (contains private keys)
- `node_modules/` (can be reinstalled)
- Private keys in any form

### Always Gitignore
```
.env
.env.local
node_modules/
*.key
*.pem
```

## 🚀 Quick Navigation

### Starting Development
1. Read: `QUICKSTART.md`
2. Follow: `COPY-PASTE-COMMANDS.md`
3. Reference: `README.md`

### Understanding Code
1. Check: `EXAMPLES.md`
2. Read: Source file comments
3. Run: `npm test` to see it work

### Debugging Issues
1. Check: `COMMANDS.md` troubleshooting section
2. Verify: Environment variables in `.env`
3. Test: Run `sui client gas` to check connection

## 📈 Complexity Levels

### Beginner Friendly
- ✅ Running commands from `COPY-PASTE-COMMANDS.md`
- ✅ Using helper functions
- ✅ Reading board/task data

### Intermediate
- 🟡 Modifying Move contracts
- 🟡 Adding new helper functions
- 🟡 Writing custom tests

### Advanced
- 🔴 Implementing custom workflows
- 🔴 Adding dynamic fields
- 🔴 Building indexer integration

## 🎯 Current Progress

- ✅ Move contract scaffold
- ✅ TypeScript integration complete
- ✅ E2E tests implemented
- ✅ Documentation comprehensive
- ⏳ Move functions (need implementation)
- ⏳ React frontend (to be built)
- ⏳ Deployment pipeline (to be built)

## 📞 Getting Help

### Documentation Order
1. `QUICKSTART.md` - Fast start
2. `COPY-PASTE-COMMANDS.md` - Copy commands
3. `COMMANDS.md` - Detailed steps
4. `README.md` - Full docs
5. `EXAMPLES.md` - Code samples

### External Resources
- [Sui Docs](https://docs.sui.io/)
- [Move Book](https://move-book.com/)
- [Sui Examples](https://examples.sui.io/)
- [Sui Discord](https://discord.gg/sui)

---

**You Are Here:** `/scripts` - TypeScript integration layer

**Next Step:** Implement Move functions in `/move/board/sources/board.move`

**Final Step:** Build React UI in `/app`
