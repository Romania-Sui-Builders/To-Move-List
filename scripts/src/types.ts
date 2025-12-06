export interface Board {
  id: string;
  name: string;
  description: string;
  owner: string;
  verifier: string;
  projectWeight: number;
  stats: BoardStats;
}

export interface BoardStats {
  todo: number;
  inProgress: number;
  awaitingCheck: number;
  verified: number;
  failed: number;
  overdue: number;
}

export interface Task {
  id: string;
  taskIndex: number;
  title: string;
  descriptionCipher: number[];
  category: number;
  status: number;
  weightPct: number;
  assignees: string[];
  dueTsMs: number;
  parentId: number | null;
  commitHash: number[];
  proofHash: number[];
  createdAtMs: number;
  updatedAtMs: number;
}

export interface Member {
  address: string;
  role: number;
}
