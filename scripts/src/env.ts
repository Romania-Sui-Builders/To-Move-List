import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Validate required environment variables
const requiredEnvVars = [
  'SUI_NETWORK',
  'PACKAGE_ID',
  'USER_SECRET_KEY',
] as const;

const optionalEnvVars = [
  'BOARD_REGISTRY_ID',
  'ADMIN_ADDRESS',
  'SUI_RPC_URL',
] as const;

// Check for required variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      `Missing required environment variable: ${envVar}. Please check your .env file.`
    );
  }
}

// Export typed environment configuration
export const config = {
  suiNetwork: process.env.SUI_NETWORK as 'mainnet' | 'testnet' | 'devnet' | 'localnet',
  packageId: process.env.PACKAGE_ID!,
  userSecretKey: process.env.USER_SECRET_KEY!,
  boardRegistryId: process.env.BOARD_REGISTRY_ID,
  adminAddress: process.env.ADMIN_ADDRESS,
  suiRpcUrl: process.env.SUI_RPC_URL,
} as const;

// Validate network value
const validNetworks = ['mainnet', 'testnet', 'devnet', 'localnet'];
if (!validNetworks.includes(config.suiNetwork)) {
  throw new Error(
    `Invalid SUI_NETWORK: ${config.suiNetwork}. Must be one of: ${validNetworks.join(', ')}`
  );
}

console.log('✅ Environment configuration loaded successfully');
console.log(`   Network: ${config.suiNetwork}`);
console.log(`   Package ID: ${config.packageId}`);
console.log(`   Board Registry ID: ${config.boardRegistryId || 'Not set'}`);
