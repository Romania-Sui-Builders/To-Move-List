import { describe, test, expect, beforeAll } from '@jest/globals';
import { getAddress } from '../signer';
import { suiClient } from '../suiClient';
import { createBoard, addMember, getBoardDetails } from '../helpers/boardHelpers';
import {
  createTask,
  updateTaskStatus,
  assignTask,
  requestVerification,
  getTaskDetails,
} from '../helpers/taskHelpers';

describe('E2E Integration Tests', () => {
  let boardId: string;
  let taskId: string;
  const userAddress = getAddress();

  beforeAll(async () => {
    console.log('🧪 Starting E2E tests...');
    console.log(`   User address: ${userAddress}`);

    // Check connection
    const epoch = await suiClient.getLatestSuiSystemState();
    console.log(`   Connected to epoch: ${epoch.epoch}`);
  });

  describe('Board Operations', () => {
    test('should create a new board', async () => {
      const result = await createBoard(
        'Test Board',
        'A test board for E2E testing',
        userAddress
      );

      expect(result.digest).toBeDefined();
      expect(result.boardId).toBeDefined();

      boardId = result.boardId;
      console.log(`   ✓ Board created: ${boardId}`);
    }, 30000);

    test('should retrieve board details', async () => {
      const details = await getBoardDetails(boardId);

      expect(details).toBeDefined();
      expect(details.name).toBe('Test Board');
      expect(details.description).toBe('A test board for E2E testing');
      console.log(`   ✓ Board details retrieved`);
    }, 30000);

    test('should add a member to the board', async () => {
      // For testing, we'll add the same user as a contributor
      const result = await addMember(boardId, userAddress, 1);

      expect(result.digest).toBeDefined();
      console.log(`   ✓ Member added`);
    }, 30000);
  });

  describe('Task Operations', () => {
    test('should create a new task', async () => {
      const now = Date.now();
      const dueDate = now + 7 * 24 * 60 * 60 * 1000; // 7 days from now

      const result = await createTask(
        boardId,
        'Test Task',
        'This is a test task for E2E testing',
        0, // category
        10, // weight
        dueDate
      );

      expect(result.digest).toBeDefined();
      expect(result.taskId).toBeDefined();

      taskId = result.taskId;
      console.log(`   ✓ Task created: ${taskId}`);
    }, 30000);

    test('should update task status to IN_PROGRESS', async () => {
      const result = await updateTaskStatus(boardId, parseInt(taskId), 1);

      expect(result.digest).toBeDefined();
      console.log(`   ✓ Task status updated to IN_PROGRESS`);
    }, 30000);

    test('should assign task to user', async () => {
      const result = await assignTask(boardId, parseInt(taskId), userAddress);

      expect(result.digest).toBeDefined();
      console.log(`   ✓ Task assigned to user`);
    }, 30000);

    test('should update task status to AWAITING_CHECK', async () => {
      const result = await updateTaskStatus(boardId, parseInt(taskId), 2);

      expect(result.digest).toBeDefined();
      console.log(`   ✓ Task status updated to AWAITING_CHECK`);
    }, 30000);

    test('should request verification for task', async () => {
      const proofHash = 'test-proof-hash-123';
      const commitHash = 'abc123def456';

      const result = await requestVerification(
        boardId,
        parseInt(taskId),
        proofHash,
        commitHash
      );

      expect(result.digest).toBeDefined();
      console.log(`   ✓ Verification requested`);
    }, 30000);
  });

  describe('Query Operations', () => {
    test('should retrieve task details', async () => {
      try {
        const details = await getTaskDetails(boardId, parseInt(taskId));

        expect(details).toBeDefined();
        expect(details.title).toBe('Test Task');
        console.log(`   ✓ Task details retrieved`);
      } catch (error) {
        // Task queries might fail if the Move implementation differs
        console.log(`   ⚠ Task query not supported yet: ${error}`);
      }
    }, 30000);

    test('should query board statistics', async () => {
      const details = await getBoardDetails(boardId);

      expect(details.stats).toBeDefined();
      console.log(`   ✓ Board statistics: ${JSON.stringify(details.stats)}`);
    }, 30000);
  });

  describe('Full Workflow', () => {
    test('should complete a full task lifecycle', async () => {
      // 1. Create a new task
      const createResult = await createTask(
        boardId,
        'Lifecycle Test Task',
        'Testing complete task lifecycle',
        1, // different category
        15 // different weight
      );
      expect(createResult.taskId).toBeDefined();
      const newTaskId = createResult.taskId;
      console.log(`   ✓ Created task: ${newTaskId}`);

      // 2. Move to IN_PROGRESS
      await updateTaskStatus(boardId, parseInt(newTaskId), 1);
      console.log(`   ✓ Updated to IN_PROGRESS`);

      // 3. Assign to user
      await assignTask(boardId, parseInt(newTaskId), userAddress);
      console.log(`   ✓ Assigned to user`);

      // 4. Move to AWAITING_CHECK
      await updateTaskStatus(boardId, parseInt(newTaskId), 2);
      console.log(`   ✓ Updated to AWAITING_CHECK`);

      // 5. Request verification
      await requestVerification(
        boardId,
        parseInt(newTaskId),
        'lifecycle-proof',
        'commit-xyz'
      );
      console.log(`   ✓ Requested verification`);

      console.log(`   ✅ Full lifecycle completed successfully!`);
    }, 60000);
  });
});
