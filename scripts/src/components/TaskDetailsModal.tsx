import type { Task } from '../types';
import { STATUS_LABELS, STATUS_COLORS } from '../constants';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
}

const formatDateTime = (timestamp?: number | null) => {
  if (!timestamp) return 'No date';
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function TaskDetailsModal({ task, onClose }: TaskDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
      <div className="card max-w-3xl w-full relative border border-gray-800 bg-[#1f1f1f]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded hover:bg-gray-800 text-gray-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">📌</span>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-mono truncate">Task ID: {task.id}</p>
            <h2 className="text-xl font-bold text-white">{task.title}</h2>
          </div>
          <span className={`badge ${STATUS_COLORS[task.status] || 'badge-todo'}`}>
            {STATUS_LABELS[task.status] || 'Task'}
          </span>
        </div>

        {task.description && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="text-gray-200 text-sm whitespace-pre-line bg-[#242424] border border-gray-800 rounded-lg p-3">
              {task.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-[#242424] border border-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Due Date</p>
            <p className={`text-sm font-semibold ${task.dueDate && task.dueDate < Date.now() ? 'text-red-300' : 'text-white'}`}>
              {formatDateTime(task.dueDate)}
            </p>
          </div>
          <div className="bg-[#242424] border border-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Parent</p>
            <p className="text-sm text-white font-semibold">
              {task.parent ?? 'None'}
            </p>
          </div>
        </div>

        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-1">Assignees</p>
          {task.assignees.length === 0 ? (
            <p className="text-sm text-gray-400 bg-[#242424] border border-gray-800 rounded-lg p-3">
              Unassigned
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {task.assignees.map((address) => (
                <span
                  key={address}
                  className="px-3 py-1 rounded-full bg-gray-800 text-gray-200 text-xs font-mono"
                >
                  {address}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
