import { KanbanStatus } from "../types";
import { task } from "@prisma/client";   // hoặc tên model của bạn

export const COLUMN_ORDER: KanbanStatus[] = [
  "IDEA",
  "TO_DO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];

export const COLUMN_TITLES: Record<KanbanStatus, string> = {
  IDEA: "Idea",
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

// Map từ Kanban UI → Prisma Database Status
export const STATUS_MAP: Record<KanbanStatus, string> = {
  IDEA: "idea",
  TO_DO: "todo",
  IN_PROGRESS: "in_progress",
  IN_REVIEW: "in_review",
  DONE: "done",
};

// Map ngược từ Prisma Database Status → Kanban UI Status
export const REVERSE_STATUS_MAP: Record<string, KanbanStatus> = {
  idea: "IDEA",
  todo: "TO_DO",
  in_progress: "IN_PROGRESS",
  in_review: "IN_REVIEW",
  done: "DONE",
};