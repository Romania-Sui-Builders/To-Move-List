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
  const totalTasks = 
    board.stats.todo + 
    board.stats.inProgress + 
    board.stats.awaitingCheck + 
    board.stats.verified + 
    board.stats.failed;

  const completionPct = totalTasks > 0 
    ? Math.round((board.stats.verified / totalTasks) * 100) 
    : 0;

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
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {board.description || 'No description'}
      </p>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-sui-blue font-medium">{completionPct}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-sui-blue rounded-full transition-all duration-300"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-500"></span>
          <span className="text-gray-400">{board.stats.todo}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span className="text-gray-400">{board.stats.inProgress}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <span className="text-gray-400">{board.stats.awaitingCheck}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-gray-400">{board.stats.verified}</span>
        </div>
      </div>
    </button>
  );
}
