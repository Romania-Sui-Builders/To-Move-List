import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from '../constants';

export function useTransactions() {
  const client = useSuiClient();
  const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const createBoard = async (
    name: string,
    description: string,
    verifier: string,
    projectWeight: number = 100
  ) => {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::board::create_board`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.address(verifier),
        tx.pure.u64(projectWeight),
      ],
    });

    const result = await signAndExecute({ transaction: tx });
    return result;
  };

  const createTask = async (
    boardId: string,
    title: string,
    description: string,
    category: number,
    weightPct: number,
    dueTsMs: number = 0
  ) => {
    const tx = new Transaction();
    const clock = tx.object('0x6');
    
    tx.moveCall({
      target: `${PACKAGE_ID}::board::create_task`,
      arguments: [
        tx.object(boardId),
        tx.pure.string(title),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(description))),
        tx.pure.u8(category),
        tx.pure.u8(weightPct),
        tx.pure.u64(dueTsMs),
        tx.pure.option('u64', null),
        clock,
      ],
    });

    const result = await signAndExecute({ transaction: tx });
    return result;
  };

  const startTask = async (boardId: string, taskId: number) => {
    const tx = new Transaction();
    const clock = tx.object('0x6');
    
    tx.moveCall({
      target: `${PACKAGE_ID}::board::start_task`,
      arguments: [
        tx.object(boardId),
        tx.pure.u64(taskId),
        clock,
      ],
    });

    const result = await signAndExecute({ transaction: tx });
    return result;
  };

  const requestCheck = async (
    boardId: string,
    taskId: number,
    proofHash: string,
    commitHash: string = ''
  ) => {
    const tx = new Transaction();
    const clock = tx.object('0x6');
    
    tx.moveCall({
      target: `${PACKAGE_ID}::board::request_check`,
      arguments: [
        tx.object(boardId),
        tx.pure.u64(taskId),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(proofHash))),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(commitHash))),
        clock,
      ],
    });

    const result = await signAndExecute({ transaction: tx });
    return result;
  };

  const addMember = async (boardId: string, memberAddress: string, role: number) => {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::board::add_member`,
      arguments: [
        tx.object(boardId),
        tx.pure.address(memberAddress),
        tx.pure.u8(role),
      ],
    });

    const result = await signAndExecute({ transaction: tx });
    return result;
  };

  return {
    createBoard,
    createTask,
    startTask,
    requestCheck,
    addMember,
    isPending,
  };
}
