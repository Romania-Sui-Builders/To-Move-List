export interface Board {
  id: string;
  version: number;
  name: string;
  description?: string | null;
  owner: string;
  activeMembers: Record<string, boolean>;
  taskIds: string[];
}

export interface Task {
  id: string;
  version: number;
  boardId: string;
  parent?: string | null;
  title: string;
  description?: string | null;
  dueDate?: number | null;
  effort?: number | null;
  assignees: string[];
  status: number;
  subtasks: string[];
}
