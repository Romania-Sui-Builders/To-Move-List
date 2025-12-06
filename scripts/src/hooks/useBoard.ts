import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import type { Board, Task } from '../types';
import { parseBoardObject, parseTaskObject } from '../helpers/moveParsers';

// Hook to fetch a single board
export function useBoard(boardId: string | null) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      if (!boardId) return null;

      const response = await client.getObject({
        id: boardId,
        options: { showContent: true, showOwner: true },
      });

      if (response.data?.content?.dataType !== 'moveObject') {
        throw new Error('Invalid board object');
      }

      const fields = response.data.content.fields as any;
      return parseBoardObject(fields, boardId);
    },
    enabled: !!boardId,
  });
}

// Hook to fetch boards via owned admin caps
export function useUserBoards() {
  const client = useSuiClient();
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ['userBoards', account?.address],
    queryFn: async () => {
      if (!account?.address) return [];

      // Find admin caps owned by the user to locate boards
      const capResponse = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          MatchAll: [
            { StructType: `${import.meta.env.VITE_PACKAGE_ID || '0x0'}::board::BoardAdminCap` },
          ],
        },
        options: { showContent: true },
      });

      const boardIds: string[] = capResponse.data
        .map((obj) => {
          const fields = (obj.data?.content as any)?.fields;
          return fields?.board_id as string | undefined;
        })
        .filter(Boolean) as string[];

      if (!boardIds.length) return [];

      const boards = await Promise.all(
        boardIds.map(async (id) => {
          const boardResp = await client.getObject({ id, options: { showContent: true } });
          if (boardResp.data?.content?.dataType !== 'moveObject') return null;
          return parseBoardObject(boardResp.data.content.fields as any, id);
        })
      );

      return boards.filter(Boolean) as Board[];
    },
    enabled: !!account?.address,
  });
}

// Hook to fetch tasks for a board by following task IDs
export function useBoardTasks(boardId: string | null) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['boardTasks', boardId],
    queryFn: async () => {
      if (!boardId) return [];

      const boardResponse = await client.getObject({
        id: boardId,
        options: { showContent: true },
      });

      if (boardResponse.data?.content?.dataType !== 'moveObject') {
        throw new Error('Invalid board');
      }

      const fields = boardResponse.data.content.fields as any;
      const taskIds: string[] = (fields.tasks as string[]) || [];
      if (!taskIds.length) return [];

      const tasks = await Promise.all(
        taskIds.map(async (taskId) => {
          const taskResp = await client.getObject({ id: taskId, options: { showContent: true } });
          if (taskResp.data?.content?.dataType !== 'moveObject') return null;
          return parseTaskObject(taskResp.data.content.fields as any, taskId);
        })
      );

      return tasks.filter(Boolean) as Task[];
    },
    enabled: !!boardId,
  });
}

// Hook to fetch the admin cap ID for the current user for a specific board
export function useBoardAdminCap(boardId: string | null) {
  const client = useSuiClient();
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ['boardAdminCap', account?.address, boardId],
    queryFn: async () => {
      if (!account?.address || !boardId) return null;

      const response = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${import.meta.env.VITE_PACKAGE_ID || '0x0'}::board::BoardAdminCap`,
        },
        options: { showContent: true },
      });

      const match = response.data.find((obj) => {
        const fields = (obj.data?.content as any)?.fields;
        return fields?.board_id === boardId;
      });

      return match?.data?.objectId ?? null;
    },
    enabled: !!account?.address && !!boardId,
  });
}

// Hook to fetch the member cap ID for the current user for a specific board
export function useBoardMemberCap(boardId: string | null) {
  const client = useSuiClient();
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ['boardMemberCap', account?.address, boardId],
    queryFn: async () => {
      if (!account?.address || !boardId) return null;

      const response = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${import.meta.env.VITE_PACKAGE_ID || '0x0'}::board::BoardMemberCap`,
        },
        options: { showContent: true },
      });

      const match = response.data.find((obj) => {
        const fields = (obj.data?.content as any)?.fields;
        return fields?.board_id === boardId;
      });

      return match?.data?.objectId ?? null;
    },
    enabled: !!account?.address && !!boardId,
  });
}
