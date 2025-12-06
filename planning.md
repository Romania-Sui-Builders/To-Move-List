## Builder Forge Hackathon — On-Chain Coordination & Work Management System (React + TypeScript + Sui Move)

This is a fully specified build guide for agentic AIs or a 5-person team to deliver a Trello-like, on-chain coordination system in ~10 hours. It merges product, Move, front-end, and ops details to fit contest judging (technical depth, creativity, UX, completeness, pitch-ready demo).

---

## 🚀 VPS Deployment Status - tomovelist.iseethereaper.com

### Completed Deployment Steps ✅

**1. DNS Configuration**
- ✅ Domain: `iseethereaper.com` → A record: `89.44.137.22`
- ✅ Subdomain: `tomovelist.iseethereaper.com` → A record: `89.44.137.22`

**2. VPS Preparation**
- ✅ VPS IP: `89.44.137.22`
- ✅ Root SSH access configured
- ✅ Nginx installed (`apt install -y nginx`)
- ✅ Default folder structure restored

**3. Nginx Reverse Proxy**
- ✅ Config created: `/etc/nginx/sites-available/tomovelist.iseethereaper.com`
- ✅ Proxy pass to `http://127.0.0.1:3000`
- ✅ Symlink enabled in `/etc/nginx/sites-enabled/`
- ✅ Nginx tested and reloaded

**4. SSL Certificate (HTTPS)**
- ✅ Certbot installed (`apt install -y certbot python3-certbot-nginx`)
- ✅ Certificate issued for `tomovelist.iseethereaper.com`
- ✅ HTTPS fully functional
- ✅ Auto-renewal scheduled

**5. GitHub Deploy Key**
- ✅ SSH keypair generated (`ssh-keygen -t ed25519`)
- ✅ Public key added to GitHub (Romania-Sui-Builders)
- ✅ Authentication verified (`ssh -T git@github.com`)

**6. Repository Cloned**
- ✅ Project directory: `/var/www/tomovelist`
- ✅ Repository cloned via SSH: `git@github.com:Romania-Sui-Builders/To-Move-List.git`

**7. Node.js Environment**
- ✅ Node + npm installed (`apt install -y nodejs npm`)

### Pending Deployment Steps ⏳

**8. Pull Latest Changes**
```bash
cd /var/www/tomovelist
git pull origin frontend
```

**9. Install Dependencies**
```bash
cd /var/www/tomovelist/scripts
npm install
```

**10. Configure Environment Variables**
```bash
cd /var/www/tomovelist/scripts
nano .env
```
Add the following:
```env
VITE_PACKAGE_ID=0x1
VITE_SUI_NETWORK=testnet
```
(Will update `VITE_PACKAGE_ID` after deploying Move contract)

**11. Build React Application**
```bash
cd /var/www/tomovelist/scripts
npm run build
```
This creates a `dist/` folder with production-ready static files.

**12. Install Serve (Static File Server)**
```bash
npm install -g serve
```

**13. Test the Build Locally**
```bash
serve -s dist -l 3000
```
Visit `http://89.44.137.22:3000` to verify. Press Ctrl+C to stop.

**14. Create Systemd Service**
```bash
nano /etc/systemd/system/tomovelist.service
```

Add this content:
```ini
[Unit]
Description=To-Move-List React App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/tomovelist/scripts/dist
ExecStart=/usr/bin/npx serve -s . -l 3000
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=tomovelist

[Install]
WantedBy=multi-user.target
```

**15. Enable and Start Service**
```bash
systemctl daemon-reload
systemctl enable tomovelist
systemctl start tomovelist
systemctl status tomovelist
```

**16. Verify Deployment**
- Visit: `https://tomovelist.iseethereaper.com`
- Should see the React app with wallet connect button

**17. Deploy Move Contract (Optional - for full functionality)**

First, install Sui CLI on VPS:
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

Or download binary:
```bash
wget https://github.com/MystenLabs/sui/releases/latest/download/sui-ubuntu-x86_64.tgz
tar -xzf sui-ubuntu-x86_64.tgz
mv sui /usr/local/bin/
```

Setup Sui wallet:
```bash
sui client
# Follow prompts to create new address or import existing
sui client switch --env testnet
sui client faucet  # Get testnet tokens
```

Build and publish:
```bash
cd /var/www/tomovelist/move/board
sui move build
sui client publish --gas-budget 100000000
```

Copy the `Package ID` from output and update `.env`:
```bash
cd /var/www/tomovelist/scripts
nano .env
# Update VITE_PACKAGE_ID=<your-package-id>
```

Rebuild and restart:
```bash
npm run build
systemctl restart tomovelist
```

**18. Monitoring and Logs**
```bash
# View logs
journalctl -u tomovelist -f

# Check status
systemctl status tomovelist

# Restart if needed
systemctl restart tomovelist
```

**19. Future Updates**
```bash
cd /var/www/tomovelist
git pull origin frontend
cd scripts
npm install
npm run build
systemctl restart tomovelist
```

---

## ✅ TypeScript Integration Scripts - COMPLETED

The `/scripts` directory is now fully set up with:

- ✅ TypeScript integration layer with Sui SDK
- ✅ Helper functions for board and task operations
- ✅ E2E integration tests
- ✅ Environment configuration and validation
- ✅ React + Vite frontend with Tailwind CSS
- ✅ Notion-style kanban board UI
- ✅ dApp Kit wallet integration
- ✅ Clean documentation (README.md)

**Folder Status:**
- ✅ `/scripts` - React frontend (Vite + dApp Kit + Tailwind)
- ✅ `/scripts/src/components` - BoardList, BoardView, TaskCard, Modals, Analytics
- ✅ `/scripts/src/hooks` - useBoard, useTransactions
- ✅ `/scripts/trello-clone` - Original Trello clone template (not yet integrated)
- ✅ `/move/board` - Move smart contracts
- ⏳ VPS deployment in progress

---

## 1. Product Scope

### 1.1 Elevator Summary
- Boards, members, and tasks live on-chain; membership and role capabilities enforced in Move.
- Two roles shipped: Contributor (create/update tasks) and Admin (config + membership); a verifier address finalizes tasks to `Verified`/`Failed`.
- Workflow: To-Do → In-Progress → Awaiting-Check → Verified/Failed (configurable).
- Rewards/analytics derive from verified work; optional zkLogin + gas sponsorship removes wallet friction.
- Optional client-side encryption for sensitive descriptions; optional indexer + charts for insights.

### 1.2 Non-Goals (v1)
- No real token payouts (keep to test “coin balance” field if needed).
- Only shallow subtasks (one parent_id).
- Minimal notifications (toasts/banners only).

### 1.3 Success Metrics
- Core flows work on-chain: create board, add member, create/update/assign task, request check, verifier finalizes.
- Move tests + Jest e2e green; demo in ≤5 minutes with explorer links.
- UX clean: wallet connect, fast reads, clear statuses, analytics snapshot.

### 1.4 Feature Table
- Core: Board creation, membership roles, task CRUD, assignments, status transitions, stats, Clock timestamps.
- Bonus: Configurable workflow, comments, subtasks, tags/milestones, Display metadata, upgrade stub, zkLogin + sponsorship, SuiNS names, indexer-driven charts.

---

## 2. Architecture Overview
- **On-chain (Move)**: Board (shared), Membership map, Workflow, Tasks under Board via dynamic fields / Tables, Comments (child objects), Display metadata, Clock timestamps, UpgradeCap.
- **Front end (React/TS)**: Vite/Next-like SPA; `@mysten/dapp-kit` + `@mysten/sui` for wallet, queries, and programmable transactions; Tailwind/shadcn for UI; Recharts/Chart.js for analytics.
- **Verification service (optional)**: Holds verifier key; gets CI webhook; hashes report; calls `report_result`.
- **Indexing (optional)**: Sui GraphQL RPC or custom indexer (`sui-indexer-alt-framework`) for fast queries and charts.
- **Data access note**: Dynamic fields allow heterogenous on-demand storage; Tables give typed maps. Both supported on Sui (docs accessed 2025-12-05).

---

## 3. Data Model (Move)

### 3.1 Core Types
- `struct Board has key { id: UID, name: String, description: String, owner: address, verifier: address, project_weight: u64, members: Table<address, u8>, tasks: Table<u64, ID>, seq: u64, workflow: Workflow, stats: BoardStats }`
- `struct BoardStats has store { todo: u64, in_prog: u64, await_check: u64, verified: u64, failed: u64, overdue: u64 }`
- `struct Workflow has store { statuses: vector<u8>, transitions: Table<u8, vector<u8>> }`
- `struct Task has key { id: UID, title: String, description_cipher: vector<u8>, category: u8, status: u8, weight_pct: u8, assignees: vector<address>, due_ts_ms: u64, parent_id: option::Option<u64>, commit_hash: vector<u8>, proof_hash: vector<u8>, created_at_ms: u64, updated_at_ms: u64 }`
- `struct AdminCap has key { id: UID, board: ID }` (admin-only actions).
- Optional `struct Comment has key { id: UID, task_id: u64, author: address, body: String, created_at_ms: u64 }` stored under Task via dynamic fields.

### 3.2 Invariants
- `name`/`title` non-empty; length caps to avoid gas spikes.
- `weight_pct` per task small; board total should stay ≤100 if used for progress calc.
- `status` must be allowed by `workflow.statuses`; transitions enforced via `workflow.transitions`.
- Assignee vector length capped (e.g., ≤10) and deduped.

### 3.3 Storage Patterns
- Board stores tasks by `tasks: Table<u64, ID>` (task id → child Task object) or dynamic field keyed by task id; both avoid giant vectors.
- Comments/subtasks as dynamic fields on Task to keep core object small.
- `Clock` (`0x6`) used to stamp created/updated/due times (docs accessed 2025-12-05).

### 3.4 Events (for indexers/analytics)
- `BoardCreated { board, owner }`
- `MemberUpdated { board, user, role }`
- `TaskCreated { board, task_id, status, weight_pct, category }`
- `TaskUpdated { board, task_id, prev_status, next_status }`
- `TaskVerified { board, task_id, assignees, weight_pct, proof_hash }`

---

## 4. Access Control
- Roles: `0=none`, `1=contributor`, `2=admin`; stored in `Board.members`.
- **Admin** (holds `AdminCap` + role=2): membership edits, workflow edits, upgrade actions.
- **Contributor** (role=1): create/update tasks, request check, add comments.
- **Verifier**: only `board.verifier` may call `report_result`.
- Enforce via helper funcs: `assert_role_at_least(board, addr, min_role)`; gate verifier by address equality.

---

## 5. Core Flows (Move Entrypoints)

```move
module proofrello::board {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self as tx, TxContext, sender};
    use sui::clock::{Self as clk, Clock};
    use sui::table::{Self as t, Table};
    use sui::event;

    const ROLE_NONE: u8 = 0;
    const ROLE_CONTRIB: u8 = 1;
    const ROLE_ADMIN: u8 = 2;
    const ST_TODO: u8 = 0;
    const ST_INPROG: u8 = 1;
    const ST_AWAIT: u8 = 2;
    const ST_VERIFIED: u8 = 3;
    const ST_FAILED: u8 = 4;

    public entry fun create_board(
        name: String,
        description: String,
        verifier: address,
        project_weight: u64,
        ctx: &mut TxContext
    ): (Board, AdminCap) { /* init members table, workflow defaults, stats, seq=0; add creator as admin */ }

    public entry fun set_member_role(
        board: &mut Board, _cap: &AdminCap, who: address, role: u8
    ) { /* role in {0,1,2}; update table; emit MemberUpdated */ }

    public entry fun create_task(
        board: &mut Board,
        title: String,
        description_cipher: vector<u8>,
        category: u8,
        weight_pct: u8,
        due_ts_ms: u64,
        parent_id: option::Option<u64>,
        clock: &Clock,
        ctx: &mut TxContext
    ) { /* require contributor+; status=ST_TODO; seq+=1; insert task; stats.todo++; emit TaskCreated */ }

    public entry fun start_task(
        board: &mut Board, task_id: u64, clock: &Clock
    ) { /* contributor+; transition TODO->INPROG; stats update; emit TaskUpdated */ }

    public entry fun request_check(
        board: &mut Board, task_id: u64, commit_hash: vector<u8>, clock: &Clock
    ) { /* contributor+; INPROG->AWAIT; stash commit_hash; emit TaskUpdated */ }

    public entry fun report_result(
        board: &mut Board, task_id: u64, passed: bool, proof_hash: vector<u8>, clock: &Clock
    ) { /* sender()==board.verifier; AWAIT->VERIFIED/FAILED; update stats; emit TaskVerified */ }
}
```

---

## 6. Optional / Bonus Features
- **Configurable workflow**: Admin updates `Workflow.statuses` and `transitions`; UI renders chips accordingly.
- **Subtasks**: `parent_id` links; UI nests cards; optional dynamic field `task -> child_id`.
- **On-chain comments**: Append-only `Comment` child objects under Task.
- **Display metadata**: Set Display templates for Board/Task (title, summary, image URL) for wallets/explorers (docs accessed 2025-12-05).
- **Contract upgradeability**: Keep `UpgradeCap`; optional policy that issues `UpgradeTicket` gated by AdminCap (docs accessed 2025-12-05).
- **Client-side encryption**: Task description stored as ciphertext; per-board symmetric key shared off-chain via ECIES; decrypt in UI; keep keys off-chain.

---

## 7. Storage & Data Access Notes
- Dynamic fields and Tables are recommended for variable-size collections and pagination (docs accessed 2025-12-05).
- Keep vectors short to avoid gas blowups; enforce max lengths for text and assignees.
- Timestamps via `Clock` object (`0x6`) for created/updated/due.

---

## 8. Security & Privacy
- Public chain data: do not store secrets plaintext; prefer optional ciphertext for descriptions.
- Verifier key stays server-side (KMS if possible); rotate by updating `board.verifier`.
- Spam: only members create tasks; admins can remove members; optionally cap tasks per member.
- Upgrade risk: keep `UpgradeCap` in safe address; optional timelock process.

---

## 9. Identity, Onboarding, Sponsorship (Bonus)
- **zkLogin**: OAuth-backed auth with unlinkable on-chain address; submit tx via zkLogin flow (docs accessed 2025-12-05).
- **Gas sponsorship**: Enoki or Shinami Gas Station to sponsor user tx; fallback to normal wallet gas.
- **Names**: Resolve SuiNS for invites (e.g., `alice.sui`, `dev@team.sui`).

---

## 10. Front-End Spec (React/TS)
- **Libraries**: `@mysten/dapp-kit`, `@mysten/sui`, Tailwind/shadcn, Recharts/Chart.js.
- **Screens**:
  - Boards list: fetch via GraphQL or RPC; create board modal.
  - Board view: Columns (To-Do / In-Progress / Awaiting-Check / Verified / Failed); task cards show title, assignees, weight, due, status; decrypt description if key exists.
  - Members: invite by address/SuiNS; set role.
  - Analytics: status counts, per-member verified counts, overdue list.
- **Hooks**: `useBoard(boardId)`, `useTasks(boardId)`, `useTask(taskId)`, `useMembers(boardId)`.
- **Tx building**: use `Transaction`/`TransactionBlock`; include Board object id, task id, strings/bytes, and `0x6` Clock (docs accessed 2025-12-05).
- **UX**: optimistic toasts, show tx digest + explorer link, retry on failure; avoid purple bias, keep bold intentional design.

---

## 11. Verification Service (Backend)
- Holds verifier key/address from Board.
- Endpoint `/ci-report`: `{ task_id, status, report }` → `proof_hash = sha256(report)` → call `report_result(board, task_id, passed, proof_hash, Clock)`.
- Minimal Node/Express sketch (sign/execute via `@mysten/sui.js` Transaction); store secrets securely.

---

## 12. Analytics & Charts
- On-chain counters: Board.stats for O(1) reads.
- Overdue: `due_ts_ms < now && status in {todo, in_prog, await}`.
- Indexer-driven (optional): GraphQL for tasks by status, per-user verified counts, velocity (verified per day).
- Velocity/Completion: completion = sum(weight_pct where status=verified) / 100.

---

## 13. Tests
- **Move unit tests**: `sui move test` with `#[test_only]` + `test_scenario` (docs accessed 2025-12-05). Cover role checks, task creation validation, status transitions, stats, events, verifier gating.
- **TS integration (Jest)**: localnet/devnet; flow: create board → add member → create task → start → request check → verifier finalize → query stats; assert role enforcement and counts.

---

## 14. Upgrade & Ops
- Keep `UpgradeCap` safe; optional custom policy (K-of-N) via `UpgradeTicket`.
- Tag package with Display metadata for better explorer UX.
- If storing large reports, consider Walrus PoA and store only PoA hash (docs accessed 2025-12-05).

---

## 15. zkLogin + Sponsorship Wiring (Optional)
- zkLogin auth → obtain signature inputs → submit tx with sponsored gas.
- Enoki bundles zkLogin + sponsorship; Shinami Gas Station is alternative (docs accessed 2025-12-05).
- Identity UX: show SuiNS names where resolved; fallback to addresses.

---

## 16. Deliverables Checklist (Judging Alignment)
- **Technical (30%)**: Board shared object, dynamic fields/Tables, capabilities, Clock timestamps, Display metadata, upgrade stub, Move tests.
- **Creativity (20%)**: Configurable workflow, comments/subtasks, zkLogin + sponsorship, indexer/charts.
- **Pitch (10%)**: 3-minute live flow, 2-minute insights + roadmap; have explorer links.
- **Completeness (25%)**: Full read/write front-end, verifier flow.
- **UX (15%)**: Clear columns/cards, responsive, charts, decrypt when key present.

---

## 17. Team Plan (10 Hours)
- **Move dev (3.5h)**: structs, create_board, member ops, task ops, verifier finalize, events, Display, Clock wiring.
- **Move tests (1.5h)**: happy path + role rejections with `test_scenario`.
- **Front-end A (2.0h)**: Board UI, columns, forms.
- **Front-end B (2.0h)**: DApp Kit wiring, reads, tx mutations, optional zkLogin.
- **Verifier service (0.8h)**: POST webhook → hash → `report_result`.
- **Polish (0.2h)**: Charts, analytics counters, screenshots/backup demo.

---

## 18. API Contracts (Front-End ↔ Move)
- `create_board(name, description, verifier, weight) -> (board_id, admin_cap_id)`; emits `BoardCreated`.
- `set_member_role(board, AdminCap, addr, role)`; emits `MemberUpdated`.
- `create_task(board, title, description_cipher, category, weight_pct, due, parent)`; emits `TaskCreated`.
- `start_task(board, id)`; emits `TaskUpdated`.
- `request_check(board, id, commit_hash)`; emits `TaskUpdated`.
- `report_result(board, id, passed, proof_hash)` (verifier only); emits `TaskVerified`.

---

## 19. Analytics Formulas (UI)
- Completion % = `sum(weight_pct where status=verified) / 100`.
- Overdue count = tasks with `due_ts_ms < now` and status ∈ {todo, in_prog, await_check}.
- Per-user verified count = count of `TaskVerified` grouped by assignee.
- Velocity = verified per day (from events or indexer).

---

## 20. Installation & Commands
- Move: `sui move build`; `sui move test -g` (verbose) — Sui CLI supports both (docs accessed 2025-12-05).
- Front-end: `pnpm i @mysten/dapp-kit @mysten/sui recharts`; `pnpm dev`.
- Verifier: `pnpm i express @mysten/sui`; `node verifier.js`.

---

## 21. Risks & Mitigations
- Spam tasks: members-only creation; admin quotas.
- Verifier compromise: rotate verifier address; keep key in server-side KMS.
- Upgrade risk: wrap UpgradeCap with policy + timelock if time allows.
- Privacy: default plaintext; allow optional encryption; remind users chain data is public.

---

## 22. Indexer Notes (Optional)
- Prefer GraphQL RPC for structured queries/pagination (indexer-backed Postgres; docs accessed 2025-12-05).
- Custom indexer: `sui-indexer-alt-framework` into Postgres + REST/GraphQL for charts.

---

## 23. Agentic Execution Checklist
- [ ] Publish Move package; capture package id.
- [ ] Create board with verifier address; store admin cap.
- [ ] Add member (contrib) and admin (if multiple).
- [ ] Create task; start; request check; verifier finalizes.
- [ ] Read stats; render analytics; show explorer links.
- [ ] Run `sui move test`; run Jest e2e.

---

## 24. Demo Script (≤5 minutes)
1) Connect wallet (or zkLogin), show board list, create board.
2) Add member, set role; show member list.
3) Create task with due date; start task; request check with commit hash.
4) Run verifier endpoint (or mocked button) to finalize; show status update.
5) Show analytics: counts, completion %, overdue; open explorer link for Task object.
