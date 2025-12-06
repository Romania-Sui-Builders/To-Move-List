import { describe, test, expect, beforeAll } from '@jest/globals';

const hasEnv =
  !!process.env.SUI_NETWORK &&
  !!process.env.PACKAGE_ID &&
  !!process.env.USER_SECRET_KEY;

const e2e = hasEnv ? describe : describe.skip;

e2e('E2E Integration Tests', () => {
  let boardId: string;
  let createBoard: any;
  let getBoardDetails: any;
  let suiClient: any;
  let getAddress: any;

  beforeAll(async () => {
    ({ createBoard, getBoardDetails } = await import('../helpers/boardHelpers'));
    ({ suiClient } = await import('../suiClient'));
    ({ getAddress } = await import('../signer'));

    const userAddress = getAddress();
    console.log('🧪 Starting E2E tests...');
    console.log(`   User address: ${userAddress}`);

    const epoch = await suiClient.getLatestSuiSystemState();
    console.log(`   Connected to epoch: ${epoch.epoch}`);
  });

  describe('Board Operations', () => {
    test(
      'should create a new board',
      async () => {
        const result = await createBoard('Test Board');

        expect(result.digest).toBeDefined();
        expect(result.boardId).toBeDefined();

        boardId = result.boardId;
        console.log(`   ✓ Board created: ${boardId}`);
      },
      30000
    );

    test(
      'should retrieve board details',
      async () => {
        const details: any = await getBoardDetails(boardId);

        expect(details).toBeDefined();
        expect(details.name).toBe('Test Board');
        console.log(`   ✓ Board details retrieved`);
      },
      30000
    );
  });
});
