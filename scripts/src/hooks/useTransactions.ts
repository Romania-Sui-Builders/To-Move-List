import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
import { PACKAGE_ID } from '../constants';

export function useTransactions() {
  const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const createBoard = async (name: string, description?: string | null) => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::board::mint_board`,
      arguments: [
        tx.pure.string(name),
        tx.pure(bcs.option(bcs.string()).serialize(description ?? null).toBytes()),
      ],
    });

    const result = await signAndExecute({ transaction: tx as any });
    return result;
  };

  const addMember = async (boardId: string, adminCapId: string, memberAddress: string, role: number = 0) => {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::board::add_member`,
      arguments: [
        tx.object(adminCapId),
        tx.object(boardId),
        tx.pure.address(memberAddress),
        tx.pure.u8(role),
      ],
    });

    const result = await signAndExecute({ transaction: tx as any });
    return result;
  };

  const createTask = async (
    memberCapId: string,
    boardId: string,
    title: string,
    description?: string,
    dueDateMs?: number,
    effort?: number
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::task::mint_task`,
      arguments: [
        tx.object(memberCapId),
        tx.object(boardId),
        tx.pure.string(title),
        description 
          ? tx.pure(bcs.option(bcs.string()).serialize(description).toBytes()) 
          : tx.pure(bcs.option(bcs.string()).serialize(null).toBytes()),
        dueDateMs 
          ? tx.pure(bcs.option(bcs.u64()).serialize(dueDateMs).toBytes()) 
          : tx.pure(bcs.option(bcs.u64()).serialize(null).toBytes()),
        effort 
          ? tx.pure(bcs.option(bcs.u64()).serialize(effort).toBytes()) 
          : tx.pure(bcs.option(bcs.u64()).serialize(null).toBytes()),
      ],
    });
    return signAndExecute({ transaction: tx as any });
  };

  return {
    createBoard,
    addMember,
    createTask,
    isPending,
  };
}
