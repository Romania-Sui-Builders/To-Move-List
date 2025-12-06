export interface Board {
  id: string;
  version: number;
  name: string;
  owner: string;
  members: string[];
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
  assignees: string[];
}
