import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Board, Task } from '../types';
import { STATUS_LABELS } from '../constants';

interface AnalyticsProps {
  board: Board;
  tasks: Task[];
}

const COLORS = ['#6B7280', '#F59E0B', '#8B5CF6', '#10B981', '#EF4444'];

export function Analytics({ board, tasks }: AnalyticsProps) {
  const { stats } = board;

  const pieData = [
    { name: 'To Do', value: stats.todo, color: COLORS[0] },
    { name: 'In Progress', value: stats.inProgress, color: COLORS[1] },
    { name: 'Awaiting Check', value: stats.awaitingCheck, color: COLORS[2] },
    { name: 'Verified', value: stats.verified, color: COLORS[3] },
    { name: 'Failed', value: stats.failed, color: COLORS[4] },
  ].filter((d) => d.value > 0);

  const totalTasks = stats.todo + stats.inProgress + stats.awaitingCheck + stats.verified + stats.failed;
  const completionPct = totalTasks > 0 ? Math.round((stats.verified / totalTasks) * 100) : 0;

  // Group tasks by assignee
  const tasksByAssignee: Record<string, number> = {};
  tasks.forEach((task) => {
    task.assignees.forEach((addr) => {
      const shortAddr = `${addr.slice(0, 6)}...${addr.slice(-4)}`;
      tasksByAssignee[shortAddr] = (tasksByAssignee[shortAddr] || 0) + 1;
    });
  });

  const assigneeData = Object.entries(tasksByAssignee)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Overdue tasks
  const overdueTasks = tasks.filter(
    (t) => t.dueTsMs > 0 && t.dueTsMs < Date.now() && t.status < 3
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Total Tasks</p>
          <p className="text-3xl font-bold text-white">{totalTasks}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Completion</p>
          <p className="text-3xl font-bold text-sui-blue">{completionPct}%</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Verified</p>
          <p className="text-3xl font-bold text-emerald-400">{stats.verified}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Overdue</p>
          <p className="text-3xl font-bold text-red-400">{overdueTasks.length}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No tasks yet</p>
          )}
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-gray-400">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks by Assignee */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Tasks by Assignee</h3>
          {assigneeData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assigneeData} layout="vertical">
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis type="category" dataKey="name" stroke="#6B7280" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#4DA2FF" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No assigned tasks</p>
          )}
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Status Breakdown</h3>
        <div className="space-y-3">
          {[
            { label: 'To Do', count: stats.todo, color: 'bg-gray-500' },
            { label: 'In Progress', count: stats.inProgress, color: 'bg-amber-500' },
            { label: 'Awaiting Check', count: stats.awaitingCheck, color: 'bg-purple-500' },
            { label: 'Verified', count: stats.verified, color: 'bg-emerald-500' },
            { label: 'Failed', count: stats.failed, color: 'bg-red-500' },
          ].map(({ label, count, color }) => {
            const pct = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
            return (
              <div key={label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">{label}</span>
                  <span className="text-gray-400">{count} ({Math.round(pct)}%)</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="card border-red-800">
          <h3 className="text-lg font-semibold text-red-400 mb-4">⚠️ Overdue Tasks</h3>
          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg">
                <span className="text-white">{task.title}</span>
                <span className="text-red-400 text-sm">
                  Due: {new Date(task.dueTsMs).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
