import { Transaction } from '@mysten/sui/transactions';
import { suiClient } from '../suiClient';
import { getSigner, getAddress } from '../signer';
import { config } from '../env';

/**
 * Create a new board with the given name and description
 * @param name - Board name
 * @param description - Board description
 * @param verifierAddress - Address that can verify tasks (optional, defaults to creator)
 * @returns Transaction digest and created board ID
 */
export async function createBoard(
  name: string,
  description: string,
  verifierAddress?: string
): Promise<{ digest: string; boardId: string }> {
  const tx = new Transaction();
  const userAddress = getAddress();
  const verifier = verifierAddress || userAddress;

  // Call the create_board function
  tx.moveCall({
    target: `${config.packageId}::board::create_board`,
    arguments: [
      tx.pure.string(name),
      tx.pure.string(description),
      tx.pure.address(verifier),
      tx.pure.u64(100), // project_weight default
    ],
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
 * @param role - Role (1 = Contributor, 2 = Admin)
 */
export async function addMember(
  boardId: string,
  memberAddress: string,
  role: number
): Promise<{ digest: string }> {
  const tx = new Transaction();

  tx.moveCall({
    target: `${config.packageId}::board::add_member`,
    arguments: [
      tx.object(boardId),
      tx.pure.address(memberAddress),
      tx.pure.u8(role),
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
  console.log(`   Role: ${role}`);

  return { digest: result.digest };
}

/**
 * Get board details
 */
export async function getBoardDetails(boardId: string) {
  const board = await suiClient.getObject({
    id: boardId,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  if (board.data?.content?.dataType === 'moveObject') {
    return board.data.content.fields;
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
