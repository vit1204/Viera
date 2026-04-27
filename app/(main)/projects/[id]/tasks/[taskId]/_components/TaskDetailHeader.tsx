"use client";

import { Badge } from "../../../../../../../components/ui/badge";
import { Button } from "../../../../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import { ChevronDown, Link2, Share2 } from "lucide-react";
import { useState } from "react";

interface TaskDetailHeaderProps {
  task: any;
  onStatusChange: (status: any) => void;
  onPriorityChange: (priority: any) => void;
}

const statusOptions: { value: string; label: string; color: string }[] = [
  { value: "todo", label: "To Do", color: "bg-slate-100" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-100" },
  { value: "in_review", label: "In Review", color: "bg-yellow-100" },
  { value: "done", label: "Done", color: "bg-green-100" },
  { value: "idea", label: "Idea", color: "bg-purple-100" },
];

const priorityOptions: { value: string; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export default function TaskDetailHeader({
  task,
  onStatusChange,
  onPriorityChange,
}: TaskDetailHeaderProps) {
  const currentStatus = statusOptions.find((s) => s.value === task.status);
  const currentPriority = priorityOptions.find((p) => p.value === task.priority);

  return (
    <div className="flex items-center justify-between pb-6 border-b border-border">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground font-medium">
            Task
          </span>
          <h1 className="text-3xl font-bold break-words">{task.title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Link2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function TaskStatusDropdown({
  task,
  onStatusChange,
}: {
  task: any;
  onStatusChange: (status: string) => void;
}) {
  const currentStatus = statusOptions.find((s) => s.value === task.status);

  return (
    <Select value={task.status} onValueChange={(value: string) => onStatusChange(value)}>
      <SelectTrigger className="w-32 bg-transparent border-0 hover:bg-accent rounded-md px-2 py-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${option.color}`} />
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TaskPriorityDropdown({
  task,
  onPriorityChange,
}: {
  task: any;
  onPriorityChange: (priority: string) => void;
}) {
  return (
    <Select
      value={task.priority}
      onValueChange={(value: string) => onPriorityChange(value)}
    >
      <SelectTrigger className="w-24 bg-transparent border-0 hover:bg-accent rounded-md px-2 py-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {priorityOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
