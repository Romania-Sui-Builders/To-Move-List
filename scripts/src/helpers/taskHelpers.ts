import { Transaction } from '@mysten/sui/transactions';
import { suiClient } from '../suiClient';
import { getSigner } from '../signer';
import { config } from '../env';

/**
 * Create a new task on a board
 * @param boardId - The board ID
 * @param title - Task title
 * @param description - Task description
 * @param category - Task category (0-255)
 * @param weightPct - Weight percentage (0-100)
 * @param dueTsMs - Due timestamp in milliseconds (optional)
 * @returns Transaction digest and created task ID
 */
export async function createTask(
  boardId: string,
  title: string,
  description: string,
  category: number = 0,
  weightPct: number = 10,
  dueTsMs?: number
): Promise<{ digest: string; taskId: string }> {
  const tx = new Transaction();

  // Get Clock object (0x6 is the Clock singleton)
  const clock = tx.object('0x6');

  const args = [
    tx.object(boardId),
    tx.pure.string(title),
    tx.pure.vector('u8', Array.from(Buffer.from(description))), // description_cipher
    tx.pure.u8(category),
    tx.pure.u8(weightPct),
    tx.pure.u64(dueTsMs || 0),
    clock,
  ];

  tx.moveCall({
    target: `${config.packageId}::board::create_task`,
    arguments: args,
  });

  const signer = getSigner();
  const result = await suiClient.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: {
      showEffects: true,
      showObjectChanges: true,
      showEvents: true,
    },
  });

  console.log('✅ Task created:');
  console.log(`   Digest: ${result.digest}`);
  console.log(`   Status: ${result.effects?.status.status}`);

  // Extract task ID from events or object changes
  const taskId = extractTaskId(result);
  console.log(`   Task ID: ${taskId}`);

  return {
    digest: result.digest,
    taskId: taskId!,
  };
}

/**
 * Update task status
 * @param boardId - The board ID
 * @param taskId - The task ID (sequence number)
 * @param newStatus - New status (0=TODO, 1=IN_PROGRESS, 2=AWAITING_CHECK, 3=VERIFIED, 4=FAILED)
 */
export async function updateTaskStatus(
  boardId: string,
  taskId: number,
  newStatus: number
): Promise<{ digest: string }> {
  const tx = new Transaction();
  const clock = tx.object('0x6');

  tx.moveCall({
    target: `${config.packageId}::board::update_task_status`,
    arguments: [
      tx.object(boardId),
      tx.pure.u64(taskId),
      tx.pure.u8(newStatus),
      clock,
    ],
  });

  const signer = getSigner();
  const result = await suiClient.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: {
      showEffects: true,
    },
  });

  console.log('🔄 Task status updated:');
  console.log(`   Digest: ${result.digest}`);
  console.log(`   Status: ${result.effects?.status.status}`);
  console.log(`   Task ID: ${taskId}`);
  console.log(`   New Status: ${getStatusName(newStatus)}`);

  return { digest: result.digest };
}

/**
 * Assign a task to a user
 * @param boardId - The board ID
 * @param taskId - The task ID
 * @param assigneeAddress - Address to assign
 */
export async function assignTask(
  boardId: string,
  taskId: number,
  assigneeAddress: string
): Promise<{ digest: string }> {
  const tx = new Transaction();
  const clock = tx.object('0x6');

  tx.moveCall({
    target: `${config.packageId}::board::assign_task`,
    arguments: [
      tx.object(boardId),
      tx.pure.u64(taskId),
      tx.pure.address(assigneeAddress),
      clock,
    ],
  });

  const signer = getSigner();
  const result = await suiClient.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: {
      showEffects: true,
    },
  });

  console.log('👷 Task assigned:');
  console.log(`   Digest: ${result.digest}`);
  console.log(`   Status: ${result.effects?.status.status}`);
  console.log(`   Task ID: ${taskId}`);
  console.log(`   Assignee: ${assigneeAddress}`);

  return { digest: result.digest };
}

/**
 * Request verification for a task
 * @param boardId - The board ID
 * @param taskId - The task ID
 * @param proofHash - Hash of the proof/evidence
 * @param commitHash - Git commit hash (optional)
 */
export async function requestVerification(
  boardId: string,
  taskId: number,
  proofHash: string,
  commitHash: string = ''
): Promise<{ digest: string }> {
  const tx = new Transaction();
  const clock = tx.object('0x6');

  tx.moveCall({
    target: `${config.packageId}::board::request_check`,
    arguments: [
      tx.object(boardId),
      tx.pure.u64(taskId),
      tx.pure.vector('u8', Array.from(Buffer.from(proofHash))),
      tx.pure.vector('u8', Array.from(Buffer.from(commitHash))),
      clock,
    ],
  });

  const signer = getSigner();
  const result = await suiClient.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: {
      showEffects: true,
    },
  });

  console.log('🔍 Verification requested:');
  console.log(`   Digest: ${result.digest}`);
  console.log(`   Status: ${result.effects?.status.status}`);
  console.log(`   Task ID: ${taskId}`);

  return { digest: result.digest };
}

/**
 * Get task details by looking up the task object
 */
export async function getTaskDetails(boardId: string, taskId: number) {
  const board = await suiClient.getObject({
    id: boardId,
    options: {
      showContent: true,
    },
  });

  if (board.data?.content?.dataType !== 'moveObject') {
    throw new Error('Board not found');
  }

  const fields = board.data.content.fields as any;
  const tasks = fields.tasks;

  // If using Table, we need to query the dynamic field
  const taskObjectId = tasks.fields?.id?.id;
  if (taskObjectId) {
    const dynamicField = await suiClient.getDynamicFieldObject({
      parentId: taskObjectId,
      name: {
        type: 'u64',
        value: taskId.toString(),
      },
    });

    if (dynamicField.data?.content?.dataType === 'moveObject') {
      return dynamicField.data.content.fields;
    }
  }

  throw new Error('Task not found');
}

/**
 * Helper to extract task ID from transaction result
 */
function extractTaskId(result: any): string | undefined {
  // Try to get from events first
  const events = result.events || [];
  for (const event of events) {
    if (event.type?.includes('TaskCreated')) {
      return event.parsedJson?.task_id;
    }
  }

  // Fallback: try object changes
  const objectChanges = result.objectChanges || [];
  for (const change of objectChanges) {
    if (change.type === 'created' && change.objectType?.includes('Task')) {
      return change.objectId;
    }
  }

  return undefined;
}

/**
 * Helper to get human-readable status name
 */
function getStatusName(status: number): string {
  const statuses = ['TODO', 'IN_PROGRESS', 'AWAITING_CHECK', 'VERIFIED', 'FAILED'];
  return statuses[status] || 'UNKNOWN';
}
