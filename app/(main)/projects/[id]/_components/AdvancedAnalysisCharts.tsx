"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskAnalysisData } from "@/lib/actions/analyzeProject.action";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,

} from "recharts";

interface AdvancedAnalysisChartsProps {
  data: TaskAnalysisData;
}

export function AdvancedAnalysisCharts({ data }: AdvancedAnalysisChartsProps) {
  const { byStatus, byPriority, byAssignee } = data.taskStats;
  const total = data.taskStats.total || 1;

  // Prepare status data for pie chart
  const statusData = [
    { name: "Done", value: byStatus.done, fill: "#10b981" },
    { name: "In Progress", value: byStatus.inProgress, fill: "#3b82f6" },
    { name: "To Do", value: byStatus.todo, fill: "#6b7280" },
  ].filter((item) => item.value > 0);

  // Prepare priority data for bar chart
  const priorityData = [
    { name: "High", value: byPriority.high, fill: "#ef4444" },
    { name: "Medium", value: byPriority.medium, fill: "#f59e0b" },
    { name: "Low", value: byPriority.low, fill: "#3b82f6" },
  ].filter((item) => item.value > 0);

  // Prepare assignee data for horizontal bar chart
  const assigneeData = Object.entries(byAssignee)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, count]) => ({
      name: name || "Assigned",
      tasks: count,
    }));

  // Calculate metrics
  const completionRate = ((byStatus.done / total) * 100).toFixed(1);
  const inProgressRate = ((byStatus.inProgress / total) * 100).toFixed(1);
  const highPriorityRate = ((byPriority.high / total) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground mt-1">Project tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">{byStatus.done} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{inProgressRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">{byStatus.inProgress} tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{highPriorityRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">{byPriority.high} tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-muted-foreground">No task data</div>
            )}
          </CardContent>
        </Card>

        {/* Priority Distribution - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-muted-foreground">No priority data</div>
            )}
          </CardContent>
        </Card>

        {/* Assignee Workload - Horizontal Bar Chart */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Team Workload</CardTitle>
          </CardHeader>
          <CardContent>
            {assigneeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={assigneeData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={95} />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-muted-foreground">No assignee data</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Trend Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Task Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Completed</div>
              <div className="text-2xl font-bold text-green-600">{byStatus.done}</div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(byStatus.done / total) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">In Progress</div>
              <div className="text-2xl font-bold text-blue-600">{byStatus.inProgress}</div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(byStatus.inProgress / total) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">To Do</div>
              <div className="text-2xl font-bold text-gray-600">{byStatus.todo}</div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-400"
                  style={{ width: `${(byStatus.todo / total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
