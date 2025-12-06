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
  const rawMembers: any[] = (fields.members as any[]) || [];
  return {
    id,
    version: Number(fields.version || 0),
    name: fields.name || '',
    owner: fields.owner || '',
    members: rawMembers.map((m) => String(m)),
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

  return {
    id,
    version: Number(fields.version || 0),
    boardId: fields.board_id || '',
    parent: parseOption<string>(fields.parent),
    title: fields.title || '',
    description: parseOption<string>(fields.description),
    dueDate,
    assignees: assignees.map((a: any) => String(a)),
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
