import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { config } from './env';

/**
 * Get the signer (keypair) from the secret key in environment variables
 */
export function getSigner(): Ed25519Keypair {
  try {
    // Handle both formats: "suiprivkey..." and raw base64/hex
    if (config.userSecretKey.startsWith('suiprivkey')) {
      const { schema, secretKey } = decodeSuiPrivateKey(config.userSecretKey);
      if (schema === 'ED25519') {
        return Ed25519Keypair.fromSecretKey(secretKey);
      }
      throw new Error(`Unsupported key schema: ${schema}`);
    } else {
      // Assume it's a raw secret key in base64 or hex format
      const secretKey = Buffer.from(config.userSecretKey, 'base64');
      return Ed25519Keypair.fromSecretKey(secretKey);
    }
  } catch (error) {
    throw new Error(
      `Failed to parse USER_SECRET_KEY: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get the address of the current user
 */
export function getAddress(): string {
  const signer = getSigner();
  return signer.toSuiAddress();
}

/**
 * Get the public key of the current user
 */
export function getPublicKey(): string {
  const signer = getSigner();
  return signer.getPublicKey().toBase64();
}

// Log the address on module load
console.log('✅ Signer initialized');
console.log(`   Address: ${getAddress()}`);
