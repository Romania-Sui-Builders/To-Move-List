import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from '../constants';

export function useTransactions() {
  const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const createBoard = async (name: string) => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::board::mint_board`,
      arguments: [tx.pure.string(name)],
    });

    const result = await signAndExecute({ transaction: tx as any });
    return result;
  };

  const addMember = async (boardId: string, adminCapId: string, memberAddress: string) => {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::board::add_member`,
      arguments: [
        tx.object(adminCapId),
        tx.object(boardId),
        tx.pure.address(memberAddress),
      ],
    });

    const result = await signAndExecute({ transaction: tx as any });
    return result;
  };

  return {
    createBoard,
    addMember,
    isPending,
  };
}
