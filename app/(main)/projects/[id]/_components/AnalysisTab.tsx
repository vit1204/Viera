"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdvancedAnalysisCharts } from "./AdvancedAnalysisCharts";
import { AIInsightCard } from "./AIInsightCard";
import { analyzeProjectTasks, TaskAnalysisData, AnalysisResult } from "@/lib/actions/analyzeProject.action";
import { Zap, RefreshCw } from "lucide-react";

interface AnalysisTabProps {
  projectId: string;
  tasks: any[];
}

export function AnalysisTab({ projectId, tasks }: AnalysisTabProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prepare data for analysis
  const getAnalysisData = (): TaskAnalysisData => {
    const byStatus = { done: 0, inProgress: 0, todo: 0 };
    const byPriority = { high: 0, medium: 0, low: 0 };
    const byAssignee: Record<string, number> = {};

    tasks.forEach((task) => {
      // Count by status - normalize status values
      const status = task.status?.toUpperCase() || "TODO";
      if (status === "DONE") byStatus.done++;
      else if (status === "IN_PROGRESS" || status === "IN PROGRESS") byStatus.inProgress++;
      else byStatus.todo++;

      // Count by priority
      const priority = task.priority?.toLowerCase() || "low";
      if (priority === "high") byPriority.high++;
      else if (priority === "medium") byPriority.medium++;
      else byPriority.low++;

      // Count by assignee - correctly handle unassigned tasks
      if (task.assignment && Array.isArray(task.assignment) && task.assignment.length > 0) {
        task.assignment.forEach((assignment: any) => {
          const assigneeName = assignment?.user?.profiles?.username || assignment?.user?.email || "";
          byAssignee[assigneeName] = (byAssignee[assigneeName] || 0) + 1;
        });
      } else {
        byAssignee["Unassigned"] = (byAssignee["Unassigned"] || 0) + 1;
      }
    });

    return {
      taskStats: {
        total: tasks.length,
        byStatus,
        byPriority,
        byAssignee,
      },
      taskList: tasks.slice(0, 20).map((task) => {
        const assignees = task.assignment && Array.isArray(task.assignment) && task.assignment.length > 0
          ? task.assignment.map((a: any) => a.user?.profiles?.username || a.user?.email || "Unassigned")
          : ["Unassigned"];
        return {
          title: task.title,
          status: task.status,
          priority: task.priority || "Low",
          assignees,
        };
      }),
    };
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = getAnalysisData();
      const result = await analyzeProjectTasks(data);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze project";
      setError(errorMessage);
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const analysisData = getAnalysisData();

  return (
    <TabsContent value="analyst" className="space-y-6">
      {/* Charts Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Project Metrics</h2>
        <AdvancedAnalysisCharts data={analysisData} />
      </div>

      {/* AI Analysis Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl font-bold">AI Analysis</h2>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            variant="default"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Analyzing..." : "Analyze Project"}
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-red-700 dark:text-red-300 text-xs mt-2">
              Make sure you have set the ai api key environment variable.
            </p>
          </Card>
        )}

        {isLoading && !analysis ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-muted border-t-blue-500 rounded-full animate-spin" />
              <p className="text-muted-foreground">Analyzing your project...</p>
            </div>
          </Card>
        ) : analysis ? (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <AIInsightCard
              title="Project Summary"
              icon="summary"
              items={[analysis.summary]}
            />
            <AIInsightCard
              title="Identified Risks"
              icon="risk"
              items={analysis.risks}
            />
            <AIInsightCard
              title="Suggestions"
              icon="suggestion"
              items={analysis.suggestions}
            />
          </div>
        ) : (
          <Card className="p-8 border-dashed">
            <div className="text-center">
              <Zap className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                Click "Analyze Project" to get AI-powered insights about your project's health, risks, and improvement suggestions.
              </p>
            </div>
          </Card>
        )}
      </div>
    </TabsContent>
  );
}
