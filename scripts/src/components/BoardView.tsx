import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useBoard, useBoardTasks } from '../hooks/useBoard';
import { useTransactions } from '../hooks/useTransactions';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { Analytics } from './Analytics';
import { STATUS, STATUS_LABELS } from '../constants';
import type { Task } from '../types';

interface BoardViewProps {
  boardId: string;
  onBack: () => void;
}

export function BoardView({ boardId, onBack }: BoardViewProps) {
  const account = useCurrentAccount();
  const { data: board, isLoading: boardLoading } = useBoard(boardId);
  const { data: tasks, isLoading: tasksLoading, refetch: refetchTasks } = useBoardTasks(boardId);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [activeTab, setActiveTab] = useState<'board' | 'analytics'>('board');

  if (boardLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-64 bg-gray-800 rounded-xl"></div>
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

  // Group tasks by status
  const tasksByStatus: Record<number, Task[]> = {
    [STATUS.TODO]: [],
    [STATUS.IN_PROGRESS]: [],
    [STATUS.AWAITING_CHECK]: [],
    [STATUS.VERIFIED]: [],
    [STATUS.FAILED]: [],
  };

  tasks?.forEach((task) => {
    if (tasksByStatus[task.status]) {
      tasksByStatus[task.status].push(task);
    }
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{board.name}</h2>
          <p className="text-gray-400">{board.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'board' ? 'bg-sui-blue text-white' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'analytics' ? 'bg-sui-blue text-white' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <Analytics board={board} tasks={tasks || []} />
      ) : (
        <>
          {/* Add Task Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowCreateTask(true)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-5 gap-4 overflow-x-auto">
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
              <div key={status} className="min-w-[280px]">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="font-medium text-gray-300">{STATUS_LABELS[Number(status)]}</h3>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                    {statusTasks.length}
                  </span>
                </div>
                <div className="space-y-3 bg-gray-800/50 rounded-xl p-3 min-h-[400px]">
                  {tasksLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-24 bg-gray-700 rounded-lg"></div>
                      ))}
                    </div>
                  ) : statusTasks.length === 0 ? (
                    <p className="text-center text-gray-600 text-sm py-8">No tasks</p>
                  ) : (
                    statusTasks.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        boardId={boardId}
                        onUpdate={() => refetchTasks()}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          boardId={boardId}
          onClose={() => setShowCreateTask(false)}
          onCreated={() => {
            setShowCreateTask(false);
            refetchTasks();
          }}
        />
      )}
    </div>
  );
}
