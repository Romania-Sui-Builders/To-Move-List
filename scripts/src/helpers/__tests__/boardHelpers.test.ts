import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { createBoard, addMember } from '../boardHelpers';
import { suiClient } from '../../suiClient';

const mockSignAndExecute = suiClient.signAndExecuteTransaction as jest.Mock;

jest.mock('../../env', () => ({
  config: {
    suiNetwork: 'testnet',
    packageId: '0xpkg',
    userSecretKey: 'secret',
    boardRegistryId: null,
    adminAddress: null,
    suiRpcUrl: null,
  },
}));

jest.mock('../../suiClient', () => ({
  suiClient: {
    signAndExecuteTransaction: jest.fn(),
  },
}));

jest.mock('../../signer', () => ({
  getSigner: () => 'signer',
}));

jest.mock('@mysten/sui/transactions', () => {
  class MockTransaction {
    calls: any[] = [];
    pure = {
      string: (value: string) => ({ kind: 'string', value }),
      address: (value: string) => ({ kind: 'address', value }),
      u64: (value: number) => ({ kind: 'u64', value }),
      u8: (value: number) => ({ kind: 'u8', value }),
    };
    object(id: string) {
      return { kind: 'object', value: id };
    }
    moveCall(args: any) {
      this.calls.push(args);
    }
  }
  return { Transaction: MockTransaction };
});

describe('boardHelpers', () => {
  beforeEach(() => {
    mockSignAndExecute.mockReset();
  });

  test('createBoard issues mint_board call', async () => {
    mockSignAndExecute.mockResolvedValue({
      digest: '0x1',
      effects: { status: { status: 'success' } },
      objectChanges: [
        { type: 'created', objectType: '0xpkg::board::Board', objectId: '0xboard' },
      ],
    });

    const result = await createBoard('Test Board');

    expect(result.boardId).toBe('0xboard');
    expect(mockSignAndExecute).toHaveBeenCalledTimes(1);
    const txArg = mockSignAndExecute.mock.calls[0][0].transaction;
    expect(txArg.calls[0].target).toBe('0xpkg::board::mint_board');
    expect(txArg.calls[0].arguments[0]).toEqual({ kind: 'string', value: 'Test Board' });
  });

  test('addMember issues add_member call with admin cap', async () => {
    mockSignAndExecute.mockResolvedValue({
      digest: '0x2',
      effects: { status: { status: 'success' } },
    });

    await addMember('0xboard', '0xcap', '0xmember');

    expect(mockSignAndExecute).toHaveBeenCalledTimes(1);
    const txArg = mockSignAndExecute.mock.calls[0][0].transaction;
    expect(txArg.calls[0].target).toBe('0xpkg::board::add_member');
    expect(txArg.calls[0].arguments[0]).toEqual({ kind: 'object', value: '0xcap' });
    expect(txArg.calls[0].arguments[1]).toEqual({ kind: 'object', value: '0xboard' });
    expect(txArg.calls[0].arguments[2]).toEqual({ kind: 'address', value: '0xmember' });
  });
});
