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
