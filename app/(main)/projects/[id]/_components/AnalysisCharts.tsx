"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskAnalysisData } from "@/lib/actions/analyzeProject.action";

interface AnalysisChartsProps {
  data: TaskAnalysisData;
}

export function AnalysisCharts({ data }: AnalysisChartsProps) {
  const { byStatus, byPriority, byAssignee } = data.taskStats;
  const total = data.taskStats.total || 1;

  // Calculate percentages for status
  const statusPercentages = {
    done: (byStatus.done / total) * 100,
    inProgress: (byStatus.inProgress / total) * 100,
    todo: (byStatus.todo / total) * 100,
  };

  // Calculate percentages for priority
  const priorityPercentages = {
    high: (byPriority.high / total) * 100,
    medium: (byPriority.medium / total) * 100,
    low: (byPriority.low / total) * 100,
  };

  // Sort assignees by task count
  const assigneeEntries = Object.entries(byAssignee)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxAssigneeTasks = Math.max(...assigneeEntries.map(([, count]) => count), 1);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Status Distribution Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Task Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Done */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">Done</span>
                <span className="text-sm text-muted-foreground">{byStatus.done}/{total}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${statusPercentages.done}%` }}
                />
              </div>
            </div>

            {/* In Progress */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">In Progress</span>
                <span className="text-sm text-muted-foreground">{byStatus.inProgress}/{total}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${statusPercentages.inProgress}%` }}
                />
              </div>
            </div>

            {/* Todo */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">To Do</span>
                <span className="text-sm text-muted-foreground">{byStatus.todo}/{total}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-400 transition-all"
                  style={{ width: `${statusPercentages.todo}%` }}
                />
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="pt-3 border-t border-border">
            <div className="text-2xl font-bold text-green-600">{byStatus.done}</div>
            <div className="text-xs text-muted-foreground">tasks completed</div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Distribution Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Priority Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* High */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">High</span>
                <span className="text-sm text-muted-foreground">{byPriority.high}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${priorityPercentages.high}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">Medium</span>
                <span className="text-sm text-muted-foreground">{byPriority.medium}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all"
                  style={{ width: `${priorityPercentages.medium}%` }}
                />
              </div>
            </div>

            {/* Low */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">Low</span>
                <span className="text-sm text-muted-foreground">{byPriority.low}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 transition-all"
                  style={{ width: `${priorityPercentages.low}%` }}
                />
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="pt-3 border-t border-border">
            <div className="text-2xl font-bold text-red-600">{byPriority.high}</div>
            <div className="text-xs text-muted-foreground">high priority tasks</div>
          </div>
        </CardContent>
      </Card>

      {/* Assignee Workload Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Workload by Assignee</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assigneeEntries.length > 0 ? (
            <div className="space-y-3">
              {assigneeEntries.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {name || "Assgined"}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${(count / maxAssigneeTasks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No assignee data available</div>
          )}

          {/* Summary Stats */}
          <div className="pt-3 border-t border-border">
            <div className="text-2xl font-bold text-purple-600">{assigneeEntries.length}</div>
            <div className="text-xs text-muted-foreground">team members assigned</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
