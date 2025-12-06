import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { config } from './env';

/**
 * Get the RPC URL for the configured network
 */
function getRpcUrl(): string {
  if (config.suiRpcUrl) {
    return config.suiRpcUrl;
  }
  return getFullnodeUrl(config.suiNetwork);
}

/**
 * Create and export a singleton Sui client instance
 */
export const suiClient = new SuiClient({
  url: getRpcUrl(),
});

/**
 * Helper function to get the current epoch
 */
export async function getCurrentEpoch(): Promise<string> {
  const epoch = await suiClient.getLatestSuiSystemState();
  return epoch.epoch;
}

/**
 * Helper function to get gas price
 */
export async function getReferenceGasPrice(): Promise<bigint> {
  const gasPrice = await suiClient.getReferenceGasPrice();
  return gasPrice;
}

console.log('✅ Sui client initialized');
console.log(`   RPC URL: ${getRpcUrl()}`);
