# Example Usage Scripts

This file contains example scripts you can run to interact with your deployed contracts.

## Setup

First, ensure your `.env` file is properly configured with:
- `PACKAGE_ID`: Your deployed package ID
- `USER_SECRET_KEY`: Your wallet private key
- `SUI_NETWORK`: The network you're using (testnet recommended)

## Example 1: Create a Board

```typescript
import { createBoard } from './helpers/boardHelpers';
import { getAddress } from './signer';

async function example1() {
  const myAddress = getAddress();
  
  const result = await createBoard(
    'My First Board',
    'A board for managing my hackathon tasks',
    myAddress  // verifier address
  );
  
  console.log('Board created!');
  console.log('Board ID:', result.boardId);
  console.log('Transaction:', result.digest);
  
  return result.boardId;
}

example1();
```

## Example 2: Create Multiple Tasks

```typescript
import { createTask } from './helpers/taskHelpers';

async function example2(boardId: string) {
  const tasks = [
    {
      title: 'Implement user authentication',
      description: 'Add wallet connection and session management',
      category: 0,
      weight: 15,
    },
    {
      title: 'Design dashboard UI',
      description: 'Create wireframes and implement main dashboard',
      category: 1,
      weight: 20,
    },
    {
      title: 'Write documentation',
      description: 'Document API endpoints and user flows',
      category: 2,
      weight: 10,
    },
  ];
  
  const taskIds = [];
  
  for (const task of tasks) {
    const dueDate = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
    
    const result = await createTask(
      boardId,
      task.title,
      task.description,
      task.category,
      task.weight,
      dueDate
    );
    
    console.log(`Created task: ${task.title}`);
    taskIds.push(result.taskId);
  }
  
  return taskIds;
}
```

## Example 3: Complete Task Workflow

```typescript
import {
  createTask,
  updateTaskStatus,
  assignTask,
  requestVerification,
} from './helpers/taskHelpers';
import { getAddress } from './signer';

async function example3(boardId: string) {
  const myAddress = getAddress();
  
  // 1. Create task
  console.log('1️⃣ Creating task...');
  const { taskId } = await createTask(
    boardId,
    'Fix bug in login flow',
    'Users are getting stuck on the login screen',
    0, // category: bug
    10 // weight
  );
  
  // 2. Start working on it
  console.log('2️⃣ Moving to IN_PROGRESS...');
  await updateTaskStatus(boardId, parseInt(taskId), 1);
  
  // 3. Assign to yourself
  console.log('3️⃣ Assigning to myself...');
  await assignTask(boardId, parseInt(taskId), myAddress);
  
  // 4. Complete the work
  console.log('4️⃣ Completing work...');
  // ... do the actual work ...
  
  // 5. Move to awaiting check
  console.log('5️⃣ Moving to AWAITING_CHECK...');
  await updateTaskStatus(boardId, parseInt(taskId), 2);
  
  // 6. Submit proof
  console.log('6️⃣ Requesting verification...');
  await requestVerification(
    boardId,
    parseInt(taskId),
    'proof-hash-from-ipfs',
    'git-commit-abc123'
  );
  
  console.log('✅ Task workflow completed!');
}
```

## Example 4: Query Board State

```typescript
import { getBoardDetails } from './helpers/boardHelpers';
import { suiClient } from './suiClient';

async function example4(boardId: string) {
  // Get board details
  const board = await getBoardDetails(boardId);
  
  console.log(' Board Information:');
  console.log('  Name:', board.name);
  console.log('  Description:', board.description);
  console.log('  Owner:', board.owner);
  console.log('  Verifier:', board.verifier);
  
  if (board.stats) {
    console.log('\n Statistics:');
    console.log('  TODO:', board.stats.todo || 0);
    console.log('  In Progress:', board.stats.in_prog || 0);
    console.log('  Awaiting Check:', board.stats.await_check || 0);
    console.log('  Verified:', board.stats.verified || 0);
    console.log('  Failed:', board.stats.failed || 0);
  }
}
```

## Example 5: Add Team Members

```typescript
import { addMember } from './helpers/boardHelpers';

async function example5(boardId: string) {
  const teamMembers = [
    { address: '0x1234...', role: 1, name: 'Alice (Contributor)' },
    { address: '0x5678...', role: 1, name: 'Bob (Contributor)' },
    { address: '0x9abc...', role: 2, name: 'Carol (Admin)' },
  ];
  
  for (const member of teamMembers) {
    await addMember(boardId, member.address, member.role);
    console.log(`✅ Added ${member.name}`);
  }
}
```

## Running Examples

Save any example to a file like `examples/my-example.ts` and run:

```powershell
npx ts-node examples/my-example.ts
```

Or add them to your test files to run with Jest.

## Tips

1. **Always check transaction status**: Look for `status: 'success'` in outputs
2. **Save important IDs**: Store board and task IDs for later use
3. **Handle errors**: Wrap calls in try-catch blocks
4. **Gas considerations**: Each transaction costs gas
5. **Wait for confirmation**: Transactions take a few seconds to finalize

## Full Example Script

Here's a complete script that sets up a board with tasks:

```typescript
// examples/setup-board.ts
import { createBoard, addMember } from './helpers/boardHelpers';
import { createTask } from './helpers/taskHelpers';
import { getAddress } from './signer';

async function main() {
  const myAddress = getAddress();
  
  // 1. Create board
  console.log('Creating board...');
  const { boardId } = await createBoard(
    'Hackathon Project Board',
    'Tasks for the Builder Forge Hackathon',
    myAddress
  );
  console.log(`✅ Board created: ${boardId}\n`);
  
  // 2. Add tasks
  console.log('Creating tasks...');
  const tasks = [
    'Implement smart contracts',
    'Build frontend',
    'Write tests',
    'Deploy to testnet',
  ];
  
  for (const title of tasks) {
    await createTask(boardId, title, `Task: ${title}`, 0, 10);
    console.log(`  ✅ ${title}`);
  }
  
  console.log('\n🎉 Board setup complete!');
  console.log(`View your board: https://suiexplorer.com/object/${boardId}?network=testnet`);
}

main().catch(console.error);
```

Run it:
```powershell
npx ts-node examples/setup-board.ts
```

---

## Styling with Tailwind CSS

The project includes Tailwind CSS with custom Sui-themed components:

```typescript
// Example: Using Tailwind classes in your code

// Status badge helper
function getStatusBadgeClass(status: number): string {
  const badges = [
    'badge badge-todo',           // 0: TODO
    'badge badge-in-progress',    // 1: IN_PROGRESS  
    'badge badge-awaiting-check', // 2: AWAITING_CHECK
    'badge badge-verified',       // 3: VERIFIED
    'badge badge-failed',         // 4: FAILED
  ];
  return badges[status] || 'badge';
}

// Button styles
const primaryButton = 'btn-primary';
const secondaryButton = 'btn-secondary';

// Card container
const cardStyle = 'card';

// Input field
const inputStyle = 'input-field';
```

### Custom Sui Colors

```typescript
// Available in tailwind.config.js:
colors: {
  'sui-blue': '#4DA2FF',
  'sui-dark': '#1F1F1F', 
  'sui-light': '#F7F9FB',
}

// Usage example:
<div className="bg-sui-blue text-white">Sui Branded Element</div>
```

### Pre-built Components

- **Buttons**: `btn-primary`, `btn-secondary`
- **Cards**: `card`  
- **Inputs**: `input-field`
- **Badges**: `badge-todo`, `badge-verified`, etc.

Import styles:
```typescript
import './styles/tailwind.css';
```
