// Network and Package Configuration
export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || '0x1'; // Will be updated after contract deployment
export const NETWORK = import.meta.env.VITE_SUI_NETWORK || 'testnet';

// Task Status Constants (matching Move contract)
export const STATUS = {
  TODO: 0,
  IN_PROGRESS: 1,
  AWAITING_CHECK: 2,
  VERIFIED: 3,
  FAILED: 4,
} as const;

export const STATUS_LABELS: Record<number, string> = {
  [STATUS.TODO]: 'To Do',
  [STATUS.IN_PROGRESS]: 'In Progress',
  [STATUS.AWAITING_CHECK]: 'Awaiting Check',
  [STATUS.VERIFIED]: 'Verified',
  [STATUS.FAILED]: 'Failed',
};

export const STATUS_COLORS: Record<number, string> = {
  [STATUS.TODO]: 'badge-todo',
  [STATUS.IN_PROGRESS]: 'badge-in-progress',
  [STATUS.AWAITING_CHECK]: 'badge-awaiting-check',
  [STATUS.VERIFIED]: 'badge-verified',
  [STATUS.FAILED]: 'badge-failed',
};

// Role Constants
export const ROLE = {
  NONE: 0,
  CONTRIBUTOR: 1,
  ADMIN: 2,
} as const;

export const ROLE_LABELS: Record<number, string> = {
  [ROLE.NONE]: 'None',
  [ROLE.CONTRIBUTOR]: 'Contributor',
  [ROLE.ADMIN]: 'Admin',
};
