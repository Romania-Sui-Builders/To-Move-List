import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import type { Board, Task, BoardStats } from '../types';

// Parse board fields from Move object
function parseBoardFields(fields: any): Omit<Board, 'id'> {
  return {
    name: fields.name || '',
    description: fields.description || '',
    owner: fields.owner || '',
    verifier: fields.verifier || '',
    projectWeight: Number(fields.project_weight || 0),
    stats: {
      todo: Number(fields.stats?.fields?.todo || 0),
      inProgress: Number(fields.stats?.fields?.in_prog || 0),
      awaitingCheck: Number(fields.stats?.fields?.await_check || 0),
      verified: Number(fields.stats?.fields?.verified || 0),
      failed: Number(fields.stats?.fields?.failed || 0),
      overdue: Number(fields.stats?.fields?.overdue || 0),
    },
  };
}

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
      return {
        id: boardId,
        ...parseBoardFields(fields),
      } as Board;
    },
    enabled: !!boardId,
  });
}

// Hook to fetch boards owned by current user
export function useUserBoards() {
  const client = useSuiClient();
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ['userBoards', account?.address],
    queryFn: async () => {
      if (!account?.address) return [];

      // Query owned objects that match Board type
      const response = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          MatchAll: [
            { StructType: `${import.meta.env.VITE_PACKAGE_ID || '0x0'}::board::Board` },
          ],
        },
        options: { showContent: true },
      });

      return response.data
        .filter((obj) => obj.data?.content?.dataType === 'moveObject')
        .map((obj) => {
          const fields = (obj.data!.content as any).fields;
          return {
            id: obj.data!.objectId,
            ...parseBoardFields(fields),
          } as Board;
        });
    },
    enabled: !!account?.address,
  });
}

// Hook to fetch tasks for a board
export function useBoardTasks(boardId: string | null) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['boardTasks', boardId],
    queryFn: async () => {
      if (!boardId) return [];

      // Get the board to access its tasks table
      const boardResponse = await client.getObject({
        id: boardId,
        options: { showContent: true },
      });

      if (boardResponse.data?.content?.dataType !== 'moveObject') {
        throw new Error('Invalid board');
      }

      const fields = boardResponse.data.content.fields as any;
      const tasksTableId = fields.tasks?.fields?.id?.id;

      if (!tasksTableId) return [];

      // Get dynamic fields (tasks) from the table
      const dynamicFields = await client.getDynamicFields({
        parentId: tasksTableId,
      });

      const tasks: Task[] = [];

      for (const field of dynamicFields.data) {
        const taskResponse = await client.getDynamicFieldObject({
          parentId: tasksTableId,
          name: field.name,
        });

        if (taskResponse.data?.content?.dataType === 'moveObject') {
          const taskFields = (taskResponse.data.content as any).fields.value?.fields;
          if (taskFields) {
            tasks.push({
              id: taskResponse.data.objectId,
              taskIndex: Number(field.name.value),
              title: taskFields.title || '',
              descriptionCipher: taskFields.description_cipher || [],
              category: Number(taskFields.category || 0),
              status: Number(taskFields.status || 0),
              weightPct: Number(taskFields.weight_pct || 0),
              assignees: taskFields.assignees || [],
              dueTsMs: Number(taskFields.due_ts_ms || 0),
              parentId: taskFields.parent_id?.Some ?? null,
              commitHash: taskFields.commit_hash || [],
              proofHash: taskFields.proof_hash || [],
              createdAtMs: Number(taskFields.created_at_ms || 0),
              updatedAtMs: Number(taskFields.updated_at_ms || 0),
            });
          }
        }
      }

      return tasks;
    },
    enabled: !!boardId,
  });
}

// Hook to fetch board members
export function useBoardMembers(boardId: string | null) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['boardMembers', boardId],
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
      const membersTableId = fields.members?.fields?.id?.id;

      if (!membersTableId) return [];

      const dynamicFields = await client.getDynamicFields({
        parentId: membersTableId,
      });

      const members = [];

      for (const field of dynamicFields.data) {
        const memberResponse = await client.getDynamicFieldObject({
          parentId: membersTableId,
          name: field.name,
        });

        if (memberResponse.data?.content?.dataType === 'moveObject') {
          const memberFields = (memberResponse.data.content as any).fields;
          members.push({
            address: String(field.name.value),
            role: Number(memberFields.value || 0),
          });
        }
      }

      return members;
    },
    enabled: !!boardId,
  });
}
