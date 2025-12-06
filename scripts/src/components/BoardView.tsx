import { useState } from 'react';
import { useBoard, useBoardTasks, useBoardAdminCap } from '../hooks/useBoard';
import { TaskCard } from './TaskCard';
import { TaskDetailsModal } from './TaskDetailsModal';
import { useTransactions } from '../hooks/useTransactions';
import type { Task } from '../types';

interface BoardViewProps {
  boardId: string;
  onBack: () => void;
}

export function BoardView({ boardId, onBack }: BoardViewProps) {
  const { data: board, isLoading: boardLoading, refetch: refetchBoard } = useBoard(boardId);
  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = useBoardTasks(boardId);
  const { data: adminCapId, isLoading: adminCapLoading } = useBoardAdminCap(boardId);
  const { addMember, isPending } = useTransactions();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newMember, setNewMember] = useState('');
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberSuccess, setMemberSuccess] = useState<string | null>(null);

  if (boardLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-[#2f2f2f] rounded w-1/4 mb-4" />
        <div className="h-4 bg-[#2f2f2f] rounded w-1/2 mb-8" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#252525] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="card bg-red-900/20 border-red-800">
        <p className="text-red-400">Board not found</p>
        <button onClick={onBack} className="btn-secondary mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="p-1 hover:bg-[#2f2f2f] rounded transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-2xl">🗂️</span>
        <div>
          <h1 className="text-2xl font-bold text-white">{board.name}</h1>
          <p className="text-gray-500 text-sm">Board v{board.version}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 mb-6">
        <span className="text-xs text-gray-400 font-mono">Owner: {board.owner}</span>
        <span className="px-2 py-1 rounded-full bg-gray-800 text-gray-200 text-xs">{board.members.length} members</span>
        <button
          onClick={() => refetchTasks()}
          className="btn-secondary text-sm"
        >
          Refresh tasks
        </button>
      </div>

      <div className="card mb-6">
        <h3 className="text-white font-semibold mb-3">Members</h3>
        {board.members.length === 0 ? (
          <p className="text-sm text-gray-500">No members added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {board.members.map((member) => (
              <span key={member} className="px-3 py-1 rounded-full bg-gray-800 text-gray-200 text-xs font-mono">
                {member}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-gray-800 pt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-300">Add member</p>
            {adminCapLoading ? (
              <span className="text-xs text-gray-500">Loading cap...</span>
            ) : adminCapId ? (
              <span className="text-xs text-gray-500 font-mono truncate">AdminCap: {adminCapId}</span>
            ) : (
              <span className="text-xs text-red-400">Admin cap not found</span>
            )}
          </div>
          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setMemberError(null);
              setMemberSuccess(null);
              if (!adminCapId) {
                setMemberError('No admin cap found for this board.');
                return;
              }
              if (!newMember.trim()) {
                setMemberError('Member address is required.');
                return;
              }
              try {
                await addMember(boardId, adminCapId, newMember.trim());
                setMemberSuccess('Member added.');
                setNewMember('');
                await refetchBoard();
              } catch (err) {
                setMemberError(err instanceof Error ? err.message : 'Failed to add member');
              }
            }}
          >
            <input
              type="text"
              className="input flex-1"
              placeholder="0x... member address"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              disabled={isPending}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={isPending || !adminCapId}
            >
              {isPending ? 'Adding...' : 'Add'}
            </button>
          </form>
          {memberError && (
            <p className="text-xs text-red-400 mt-2">{memberError}</p>
          )}
          {memberSuccess && (
            <p className="text-xs text-emerald-400 mt-2">{memberSuccess}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Tasks ({tasks.length})</h3>
          <span className="text-xs text-gray-500">Task IDs stored on-chain in Board.tasks</span>
        </div>

        {tasksLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-[#2f2f2f] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="card bg-[#1f1f1f] border border-dashed border-gray-700 text-gray-500">
            No tasks linked to this board yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
