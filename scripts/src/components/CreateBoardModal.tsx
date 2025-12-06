import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';

interface CreateBoardModalProps {
  onClose: () => void;
}

export function CreateBoardModal({ onClose }: CreateBoardModalProps) {
  const { createBoard, isPending } = useTransactions();
  
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Board name is required');
      return;
    }

    try {
      await createBoard(name.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create board');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create Board</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Board Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              placeholder="My Project Board"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex-1"
            >
              {isPending ? 'Creating...' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
