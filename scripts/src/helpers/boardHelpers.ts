import { Transaction } from '@mysten/sui/transactions';
import { suiClient } from '../suiClient';
import { getSigner } from '../signer';
import { config } from '../env';
import { extractCreatedObjectId } from './moveParsers';

/**
 * Create a new board with the given name using movelist::board::mint_board
 * @param name - Board name
 * @returns Transaction digest and created board ID
 */
export async function createBoard(
  name: string
): Promise<{ digest: string; boardId: string }> {
  const tx = new Transaction();

  // Call the mint_board function (no description/verifier in current Move module)
  tx.moveCall({
    target: `${config.packageId}::board::mint_board`,
    arguments: [tx.pure.string(name)],
  });

  const signer = getSigner();
  const result = await suiClient.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  console.log(' Board created:');
  console.log(`   Digest: ${result.digest}`);
  console.log(`   Status: ${result.effects?.status.status}`);

  // Extract the created board ID from object changes
  const boardId = extractCreatedObjectId(result, 'Board');
  console.log(`   Board ID: ${boardId}`);

  return {
    digest: result.digest,
    boardId: boardId!,
  };
}

/**
 * Add a member to a board with a specific role
 * @param boardId - The board ID
 * @param memberAddress - Address of the member to add
 * @param adminCapId - BoardAdminCap object ID for auth
 */
export async function addMember(
  boardId: string,
  adminCapId: string,
  memberAddress: string,
): Promise<{ digest: string }> {
  const tx = new Transaction();

  tx.moveCall({
    target: `${config.packageId}::board::add_member`,
    arguments: [
      tx.object(adminCapId),
      tx.object(boardId),
      tx.pure.address(memberAddress),
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

  console.log(' Member added:');
  console.log(`   Digest: ${result.digest}`);
  console.log(`   Status: ${result.effects?.status.status}`);
  console.log(`   Member: ${memberAddress}`);
  console.log(`   AdminCap: ${adminCapId}`);

  return { digest: result.digest };
}

/**
 * Get board details
 */
export async function getBoardDetails(boardId: string): Promise<any> {
  const board = await suiClient.getObject({
    id: boardId,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  if (board.data?.content?.dataType === 'moveObject') {
    return board.data.content.fields as any;
  }

  throw new Error('Board not found or invalid object type');
}

/**
 * Helper function to extract created object ID by type
 */
function extractCreatedObjectId(
  result: any,
  objectType: string
): string | undefined {
  const objectChanges = result.objectChanges || [];
  for (const change of objectChanges) {
    if (change.type === 'created' && change.objectType?.includes(objectType)) {
      return change.objectId;
    }
  }
  return undefined;
}
