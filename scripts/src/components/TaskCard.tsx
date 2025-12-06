import type { Task } from '../types';
import { STATUS_LABELS, STATUS_COLORS } from '../constants';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const formatDate = (timestamp?: number | null) => {
  if (!timestamp) return null;
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const dueDate = formatDate(task.dueDate ?? null);
  const description = task.description || '';
  const isOverdue = task.dueDate && task.dueDate < Date.now();

  return (
    <div
      className="task-card border border-gray-700 hover:border-sui-blue/60 transition-all duration-150"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-white leading-tight">{task.title}</h4>
          <p className="text-xs text-gray-500 font-mono truncate">#{task.id}</p>
        </div>
        <span className={`badge ${STATUS_COLORS[task.status] || 'badge-todo'}`}>
          {STATUS_LABELS[task.status] || 'Task'}
        </span>
      </div>

      {description && (
        <p className="text-xs text-gray-400 mt-2 line-clamp-3">{description}</p>
      )}

      <div className="flex items-center gap-2 mt-3 text-xs">
        {dueDate && (
          <span
            className={`px-2 py-1 rounded-full flex items-center gap-1 ${
              isOverdue ? 'bg-red-900/30 text-red-200' : 'bg-gray-800 text-gray-300'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dueDate}
          </span>
        )}
        {task.assignees.length > 0 && (
          <span className="px-2 py-1 rounded-full bg-gray-800 text-gray-300">
            {task.assignees.length} assignees
          </span>
        )}
      </div>
    </div>
  );
}
