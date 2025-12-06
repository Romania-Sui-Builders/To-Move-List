import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { STATUS, STATUS_LABELS, STATUS_COLORS } from '../constants';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  boardId: string;
  onUpdate: () => void;
}

export function TaskCard({ task, boardId, onUpdate }: TaskCardProps) {
  const { startTask, requestCheck, isPending } = useTransactions();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAction = async (action: 'start' | 'requestCheck') => {
    try {
      if (action === 'start') {
        await startTask(boardId, task.taskIndex);
      } else if (action === 'requestCheck') {
        await requestCheck(boardId, task.taskIndex, 'proof-hash', 'commit-hash');
      }
      onUpdate();
    } catch (error) {
      console.error('Task action failed:', error);
    }
  };

  // Decode description from bytes
  const description = task.descriptionCipher.length > 0
    ? new TextDecoder().decode(new Uint8Array(task.descriptionCipher))
    : '';

  // Format due date
  const dueDate = task.dueTsMs > 0 
    ? new Date(task.dueTsMs).toLocaleDateString() 
    : null;

  const isOverdue = task.dueTsMs > 0 && task.dueTsMs < Date.now() && task.status < STATUS.VERIFIED;

  return (
    <div 
      className={`card cursor-pointer hover:border-gray-600 transition-colors ${
        isOverdue ? 'border-red-800' : ''
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-white text-sm">{task.title}</h4>
        <span className={`badge ${STATUS_COLORS[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {description && (
        <p className={`text-gray-400 text-xs mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {task.weightPct > 0 && (
            <span className="text-gray-500">{task.weightPct}%</span>
          )}
          {dueDate && (
            <span className={`${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
              Due: {dueDate}
            </span>
          )}
        </div>

        {task.assignees.length > 0 && (
          <div className="flex -space-x-1">
            {task.assignees.slice(0, 3).map((addr, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full bg-sui-blue flex items-center justify-center text-[10px] text-white border-2 border-gray-800"
                title={addr}
              >
                {addr.slice(2, 4).toUpperCase()}
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-gray-400 border-2 border-gray-800">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions when expanded */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
          {task.status === STATUS.TODO && (
            <button
              onClick={(e) => { e.stopPropagation(); handleAction('start'); }}
              disabled={isPending}
              className="btn-primary text-xs py-1 px-3 flex-1"
            >
              {isPending ? 'Starting...' : 'Start Task'}
            </button>
          )}
          {task.status === STATUS.IN_PROGRESS && (
            <button
              onClick={(e) => { e.stopPropagation(); handleAction('requestCheck'); }}
              disabled={isPending}
              className="btn-primary text-xs py-1 px-3 flex-1"
            >
              {isPending ? 'Submitting...' : 'Request Check'}
            </button>
          )}
          <button
            onClick={(e) => e.stopPropagation()}
            className="btn-ghost text-xs py-1 px-3"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
