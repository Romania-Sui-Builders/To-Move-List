import { useUserBoards } from '../hooks/useBoard';
import type { Board } from '../types';

interface BoardListProps {
  onSelectBoard: (boardId: string) => void;
}

export function BoardList({ onSelectBoard }: BoardListProps) {
  const { data: boards, isLoading, error } = useUserBoards();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-900/20 border-red-800">
        <p className="text-red-400">Error loading boards: {error.message}</p>
      </div>
    );
  }

  if (!boards || boards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No boards yet</h3>
        <p className="text-gray-400">Create your first board to start managing tasks on-chain</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} onClick={() => onSelectBoard(board.id)} />
      ))}
    </div>
  );
}

function BoardCard({ board, onClick }: { board: Board; onClick: () => void }) {
  const totalTasks = board.taskIds.length;
  const memberCount = Object.values(board.activeMembers).filter(Boolean).length;

  return (
    <button
      onClick={onClick}
      className="card text-left hover:border-sui-blue transition-colors duration-200 w-full"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white truncate">{board.name}</h3>
        <span className="text-xs text-gray-500 ml-2 shrink-0">
          {totalTasks} tasks
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
        <span className="font-mono text-gray-500 truncate">owner: {board.owner}</span>
        <span className="px-2 py-1 rounded-full bg-gray-800 text-gray-200">{memberCount} members</span>
      </div>
      <div className="text-xs text-gray-500">Board v{board.version}</div>
    </button>
  );
}
