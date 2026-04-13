

import {GoogleGenAI} from "@google/genai"

export interface TaskAnalysisData {
  taskStats: {
    total: number;
    byStatus: {
      done: number;
      inProgress: number;
      todo: number;
    };
    byPriority: {
      high: number;
      medium: number;
      low: number;
    };
    byAssignee: Record<string, number>;
  };
  taskList: Array<{
    title: string;
    status: string;
    priority: string;
    assignees: string[];
  }>;
}

export interface AnalysisResult {
  summary: string;
  risks: string[];
  suggestions: string[];
}

export async function analyzeProjectTasks(
  data: TaskAnalysisData
): Promise<AnalysisResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set"
    );
  }

  const client = new GoogleGenAI({apiKey});


  const prompt = `Analyze the following project task data and provide insights in JSON format with the following structure:
{
  "summary": "A brief overall project health assessment (2-3 sentences)",
  "risks": ["Risk 1", "Risk 2", "Risk 3"],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}

Task Statistics:
- Total tasks: ${data.taskStats.total}
- Completed: ${data.taskStats.byStatus.done}
- In Progress: ${data.taskStats.byStatus.inProgress}
- To Do: ${data.taskStats.byStatus.todo}

Priority Breakdown:
- High: ${data.taskStats.byPriority.high}
- Medium: ${data.taskStats.byPriority.medium}
- Low: ${data.taskStats.byPriority.low}

Workload by Assignee:
${Object.entries(data.taskStats.byAssignee)
  .map(([name, count]) => `- ${name}: ${count} tasks`)
  .join("\n")}

Recent Tasks:
${data.taskList
  .slice(0, 10)
  .map(
    (task) =>
      `- "${task.title}" [${task.status}] (${task.priority} priority) - Assigned to: ${task.assignees.join(", ") || "Unassigned"}`
  )
  .join("\n")}

Please analyze this data and provide:
1. A summary of the project's current health status
2. Key risks or bottlenecks you identify
3. Actionable suggestions for improvement

Respond ONLY with valid JSON, no additional text.`;

  try {
    const result = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    })
    
    const text = result.text || "Unable to generate analysis";

    console.log(text)

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from API");
    }

    const analysisData = JSON.parse(jsonMatch[0]) as AnalysisResult;

    return {
      summary: analysisData.summary || "Unable to generate summary",
      risks: Array.isArray(analysisData.risks) ? analysisData.risks : [],
      suggestions: Array.isArray(analysisData.suggestions)
        ? analysisData.suggestions
        : [],
    };
  } catch (error) {
    console.error("Error analyzing project:", error);
    throw new Error("Failed to analyze project with AI");
  }
}



// deepseek-r1-0528