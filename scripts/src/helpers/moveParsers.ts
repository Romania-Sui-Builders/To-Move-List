import type { Board, Task } from '../types';

export function parseOption<T>(optionField: any): T | null {
  if (!optionField) return null;
  const value =
    optionField?.fields?.value ??
    optionField?.value ??
    optionField?.Some ??
    null;
  if (value === null || value === undefined) return null;
  if (typeof value === 'object' && 'fields' in value && 'value' in (value as any).fields) {
    return (value as any).fields.value as T;
  }
  if (typeof value === 'object' && 'vec' in value) {
    return (value as any).vec as T;
  }
  return value as T;
}

export function parseBoardObject(fields: any, id: string): Board {
  const rawTasks: any[] = (fields.tasks as any[]) || [];
  
  // Note: active_members is a Sui Table which requires dynamic field queries to read.
  // The table ID is stored, but contents must be fetched separately via getDynamicFields.
  // For now, we can't directly read table contents from object fields.
  const activeMembersTable = (fields.active_members?.fields?.contents as any[]) || [];
  const activeMembers: Record<string, boolean> = {};
  activeMembersTable.forEach((entry: any) => {
    if (entry.fields?.key) {
      activeMembers[String(entry.fields.key)] = Boolean(entry.fields.value);
    }
  });
  
  // Parse description option
  const descValue = fields.description;
  let description: string | null = null;
  if (descValue) {
    description = descValue.fields?.some ?? descValue.Some ?? descValue.vec?.[0] ?? null;
  }
  
  return {
    id,
    version: Number(fields.version || 0),
    name: fields.name || '',
    description,
    owner: fields.owner || '',
    activeMembers,
    taskIds: rawTasks.map((t) => String(t)),
  };
}

export function parseTaskObject(fields: any, id: string): Task {
  const assigneeOption = parseOption<any>(fields.assignees);
  const assignees =
    Array.isArray(assigneeOption) ? assigneeOption :
    Array.isArray(assigneeOption?.vec) ? assigneeOption.vec :
    [];
  const rawDue = parseOption<number>(fields.due_date);
  const dueDate = rawDue === null || rawDue === undefined ? null : Number(rawDue);
  const effort = parseOption<number>(fields.effort_estimation);
  const statusField = fields.status;
  const status =
    statusField?.Backlog !== undefined ? 0 :
    statusField?.InProgress !== undefined ? 1 :
    statusField?.InReview !== undefined ? 2 :
    statusField?.Done !== undefined ? 3 : 0;
  const subtasks: string[] = (fields.subtasks as any[])?.map((s: any) => String(s)) || [];

  return {
    id,
    version: Number(fields.version || 0),
    boardId: fields.board_id || '',
    parent: parseOption<string>(fields.parent),
    title: fields.title || '',
    description: parseOption<string>(fields.description),
    dueDate,
    effort: effort === null || effort === undefined ? null : Number(effort),
    assignees: assignees.map((a: any) => String(a)),
    status,
    subtasks,
  };
}

export function extractCreatedObjectId(
  result: any,
  objectTypeMatch: string
): string | undefined {
  const objectChanges = result.objectChanges || [];
  for (const change of objectChanges) {
    if (change.type === 'created' && change.objectType?.includes(objectTypeMatch)) {
      return change.objectId;
    }
  }
  return undefined;
}
