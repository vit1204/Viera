
import { GoogleGenAI } from "@google/genai"

export interface GeneratedTaskData {
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  subtasks?: string[];
  dueDate?: string;
}

export async function generateTaskFromPrompt(
  userPrompt: string
): Promise<GeneratedTaskData> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set"
    );
  }

  const client = new GoogleGenAI({ apiKey });

  const prompt = `You are a project management expert. Convert this user's natural language description into a structured task.

User Input: "${userPrompt}"

Return ONLY valid JSON (no additional text) with this exact structure:
{
  "title": "Brief, clear task title (max 100 chars)",
  "description": "Detailed task description explaining what needs to be done",
  "priority": "HIGH" or "MEDIUM" or "LOW",
  "subtasks": ["Subtask 1", "Subtask 2", "Subtask 3"] (optional, max 5 subtasks)
  "dueDate": "YYYY-MM-DD" (optional, inferred from urgency keywords if possible)
}

Rules:
- Title should be concise and actionable
- Description should be detailed enough for execution
- Priority should be inferred from urgency/impact keywords
- Subtasks should break down the main task into concrete steps`;

  try {
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })
    
    const text = result.text || "Unable to generate task";

    console.log("[v0] Generated task text:", text)

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from API");
    }

    const taskData = JSON.parse(jsonMatch[0]) as GeneratedTaskData;

    // Validate required fields
    if (!taskData.title || !taskData.description) {
      throw new Error("Generated task missing required fields");
    }

    // Ensure priority is valid
    if (!["HIGH", "MEDIUM", "LOW"].includes(taskData.priority)) {
      taskData.priority = "MEDIUM";
    }

    return {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      subtasks: Array.isArray(taskData.subtasks) ? taskData.subtasks.slice(0, 5) : [],
    };
  } catch (error) {
    console.error("[v0] Error generating task:", error);
    throw new Error("Failed to generate task from prompt");
  }
}
