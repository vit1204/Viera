"use client";

import { Badge } from "../../../../../../../components/ui/badge";
import { Button } from "../../../../../../../components/ui/button";
import { Separator } from "../../../../../../../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../../../components/ui/popover";
import { Calendar, Users, AlertCircle, Clock } from "lucide-react";
import { formatDate } from "date-fns";

interface TaskDetailSidebarProps {
  task: any;
  onStatusChange: (status: any) => void;
  onPriorityChange: (priority: any) => void;
  onDueDateChange: (date: Date) => void;
}

const statusOptions: { value: string; label: string; bgColor: string; textColor: string }[] = [
  { value: "todo", label: "To Do", bgColor: "bg-slate-50", textColor: "text-slate-700" },
  { value: "in_progress", label: "In Progress", bgColor: "bg-blue-50", textColor: "text-blue-700" },
  { value: "in_review", label: "In Review", bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
  { value: "done", label: "Done", bgColor: "bg-green-50", textColor: "text-green-700" },
  { value: "idea", label: "Idea", bgColor: "bg-purple-50", textColor: "text-purple-700" },
];

const priorityOptions: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: "LOW", label: "Low", icon: <AlertCircle className="w-4 h-4 text-blue-500" /> },
  { value: "MEDIUM", label: "Medium", icon: <AlertCircle className="w-4 h-4 text-yellow-500" /> },
  { value: "HIGH", label: "High", icon: <AlertCircle className="w-4 h-4 text-red-500" /> },
];

export default function TaskDetailSidebar({
  task,
  onStatusChange,
  onPriorityChange,
  onDueDateChange,
}: TaskDetailSidebarProps) {
  const currentStatus = statusOptions.find((s) => s.value === task.status);
  const currentPriority = priorityOptions.find((p) => p.value === task.priority);

  return (
    <div className="w-80 bg-muted/20 border-l border-border p-6 space-y-6 overflow-y-auto">
      {/* Status */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          Status
        </h3>
        <Select value={task.status} onValueChange={(value: string) => onStatusChange(value)}>
          <SelectTrigger className={`w-full ${currentStatus?.bgColor} border-0 font-medium`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className={`${option.textColor}`}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      {/* Priority */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          Priority
        </h3>
        <Select
          value={task.priority}
          onValueChange={(value: string) => onPriorityChange(value)}
        >
          <SelectTrigger className="w-full border border-border">
            <div className="flex items-center gap-2">
              {currentPriority?.icon}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      {/* Due Date */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          Due Date
        </h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {task.dueDate ? formatDate(task.dueDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 text-sm text-muted-foreground">
              Date picker coming soon
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator className="my-4" />

      {/* Assignee */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          Assignee
        </h3>
        <div className="space-y-2">
          {task.assignment && task.assignment.length > 0 ? (
            task.assignment.map((assign: any) => (
              <div key={assign.id} className="flex items-center gap-2 p-2 rounded bg-accent/30">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                  {assign.user?.profiles?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium">{assign.user?.profiles?.username || "Unknown"}</span>
              </div>
            ))
          ) : (
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              Unassigned
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Metadata */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created</span>
          <span className="font-medium">{formatDate(task.createdAt, "MMM dd, yyyy")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span className="font-medium">{formatDate(task.updatedAt, "MMM dd, yyyy")}</span>
        </div>
      </div>
    </div>
  );
}
