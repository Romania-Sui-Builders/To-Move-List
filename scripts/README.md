# ✅ Icarus

On-chain task management powered by Sui blockchain. A Notion-style kanban board where tasks, roles, and verification all happen on-chain. Hosted at icarus.iseethereaper.com.

![Icarus](https://img.shields.io/badge/Sui-Blockchain-blue?style=flat-square) ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)

## ✨ Features

- **🔗 On-Chain Tasks** - All tasks stored on Sui blockchain
- **📋 Kanban Board** - Notion-style columns (To Do → In Progress → Awaiting Check → Done)
- **👥 Role-Based Access** - Contributors, Admins, and Verifiers
- **✓ Task Verification** - Verifiers approve completed work
- **📊 Analytics** - Track progress with charts and stats
- **🔐 Wallet Connect** - Connect any Sui wallet

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
scripts/
├── src/
│   ├── components/     # React components
│   │   ├── BoardList.tsx
│   │   ├── BoardView.tsx
│   │   ├── TaskCard.tsx
│   │   ├── CreateBoardModal.tsx
│   │   ├── CreateTaskModal.tsx
│   │   └── Analytics.tsx
│   ├── hooks/          # Custom React hooks
│   │   ├── useBoard.ts
│   │   └── useTransactions.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   ├── constants.ts    # App constants
│   ├── types.ts        # TypeScript types
│   └── index.css       # Tailwind styles
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── package.json        # Dependencies
```

## ⚙️ Configuration

Create a `.env.local` file:

```env
VITE_PACKAGE_ID=0x...  # Your deployed Move package ID
VITE_SUI_NETWORK=testnet
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |

## 📜 Smart Contract

The Move smart contract is in `../move/board/`. Deploy it first:

```bash
cd ../move/board
sui move build
sui client publish --gas-budget 100000000
```

Copy the Package ID to your `.env.local` file.

## 🎨 Task Statuses

| Status | Color | Description |
|--------|-------|-------------|
| 📋 To Do | Blue | New tasks |
| 🔄 In Progress | Yellow | Being worked on |
| ⏳ Awaiting Check | Purple | Submitted for review |
| ✅ Done | Green | Verified complete |
| ❌ Failed | Red | Verification failed |

## 📄 License

MIT

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
