// Network and Package Configuration (required)
const requireEnv = (key: string) => {
  const val = import.meta.env[key];
  if (!val) {
    throw new Error(`Missing ${key} in environment. Please set it in your .env/.env.local.`);
  }
  return val as string;
};

export const PACKAGE_ID = requireEnv('VITE_PACKAGE_ID');
export const NETWORK = import.meta.env.VITE_SUI_NETWORK || 'testnet';

// Task Status Constants (matching Move contract TaskStatus enum)
export const STATUS = {
  BACKLOG: 0,
  IN_PROGRESS: 1,
  IN_REVIEW: 2,
  DONE: 3,
} as const;

export const STATUS_LABELS: Record<number, string> = {
  [STATUS.BACKLOG]: 'Backlog',
  [STATUS.IN_PROGRESS]: 'In Progress',
  [STATUS.IN_REVIEW]: 'In Review',
  [STATUS.DONE]: 'Done',
};

export const STATUS_COLORS: Record<number, string> = {
  [STATUS.BACKLOG]: 'badge-todo',
  [STATUS.IN_PROGRESS]: 'badge-in-progress',
  [STATUS.IN_REVIEW]: 'badge-awaiting-check',
  [STATUS.DONE]: 'badge-verified',
};

// Role Constants
export const ROLE = {
  CONTRIBUTOR: 0,
  ADMIN: 1,
} as const;

export const ROLE_LABELS: Record<number, string> = {
  [ROLE.CONTRIBUTOR]: 'Contributor',
  [ROLE.ADMIN]: 'Admin',
};
