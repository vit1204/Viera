import { Task, users } from "@prisma/client";

export type KanbanStatus =
  | "IDEA"
  | "TO_DO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

export interface KanTaskType extends Task {
  assignment: {
    user: users & { profiles: { id: string; username?: string } | null };
  }[];
}

export interface TaskEvent {
  start: Date;
  end: Date;
  title: string;
  status: Task["status"];
  priority: Task["priority"];
  projectId: string;
  id: string;
}
