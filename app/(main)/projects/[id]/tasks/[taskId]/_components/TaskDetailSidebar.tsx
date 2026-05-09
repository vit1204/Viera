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
import { Calendar as CalendarComponent } from "../../../../../../../components/ui/calendar";
import { Calendar, Users, AlertCircle, Clock, X, Loader } from "lucide-react";
import { formatDate } from "date-fns";
import { useState, useEffect } from "react";
import { findWorkspaceMembers } from "../../../../../../../lib/actions/workspaceMember.action";
import { updateTask } from "../../../../../../../lib/actions/task.action";
import { toast } from "sonner";
import { WorkspaceMember, users } from "@prisma/client";

interface TaskDetailSidebarProps {
  task: any;
  onStatusChange: (status: any) => void;
  onPriorityChange: (priority: any) => void;
  onDueDateChange: (date: Date) => void;
}

interface members extends WorkspaceMember {
  user: users & { profiles: { id: string; username?: string; email?: string } | null };
}

const statusOptions: { value: string; label: string; bgColor: string; textColor: string }[] = [
  { value: "TODO", label: "To Do", bgColor: "bg-slate-50", textColor: "text-slate-700" },
  { value: "IN_PROGRESS", label: "In Progress", bgColor: "bg-blue-50", textColor: "text-blue-700" },
  { value: "IN_REVIEW", label: "In Review", bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
  { value: "DONE", label: "Done", bgColor: "bg-green-50", textColor: "text-green-700" },
  { value: "IDEA", label: "Idea", bgColor: "bg-purple-50", textColor: "text-purple-700" },
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
  const [workspaceMembers, setWorkspaceMembers] = useState<members[] | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [isUpdatingAssignee, setIsUpdatingAssignee] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      try {
        setAssignLoading(true);
        const members = await findWorkspaceMembers();
        setWorkspaceMembers(members as members[]);
      } catch (err) {
        console.error(err);
        toast.error("Không tải được danh sách thành viên");
      } finally {
        setAssignLoading(false);
      }
    }
    loadMembers();
  }, []);

  const handleAssigneeChange = async (userId: string) => {
    if (isUpdatingAssignee) return;
    setIsUpdatingAssignee(true);
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignment: [userId],
      });
      toast.success("Assignee updated");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update assignee");
      setIsUpdatingAssignee(false);
    }
  };

  const handleRemoveAssignee = async (assignmentId: string) => {
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignment: [],
      });
      toast.success("Assignee removed");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove assignee");
    }
  };

  const currentStatus = statusOptions.find((s) => s.value === task.status?.toUpperCase());
  const currentPriority = priorityOptions.find((p) => p.value === task.priority?.toUpperCase());

  return (
    <div className="w-72 bg-muted/20 border-l border-border p-4 space-y-5 overflow-y-auto shrink-0 max-h-full">
      {/* Status */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          Status
        </h3>
        <Select value={task.status?.toUpperCase() || "TODO"} onValueChange={(value: string) => onStatusChange(value)}>
          <SelectTrigger className={`w-full ${currentStatus?.bgColor} border-0 font-medium`}>
            <SelectValue placeholder={currentStatus?.label || "Select status"} />
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

      <Separator className="my-2" />

      {/* Priority */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
          Priority
        </h3>
        <Select
          value={task.priority?.toUpperCase() || "MEDIUM"}
          onValueChange={(value: string) => onPriorityChange(value)}
        >
          <SelectTrigger className="w-full border border-border">
            <div className="flex items-center gap-2">
              {currentPriority?.icon}
              <SelectValue placeholder={currentPriority?.label || "Select priority"} />
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

      <Separator className="my-2" />
      {/* Due Date */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          Due Date
        </h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {task.dueDate ? formatDate(new Date(task.dueDate), "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={task.dueDate ? new Date(task.dueDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  onDueDateChange(date);
                }
              }}
            />
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
              <div key={assign.id} className="flex items-center justify-between gap-2 p-2 rounded bg-accent/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    {assign.user?.profiles?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium">{assign.user?.profiles?.email || "Unknown"}</span>
                </div>
                <button
                  onClick={() => handleRemoveAssignee(assign.id)}
                  className="p-1 hover:bg-destructive/20 rounded transition-colors"
                  title="Remove assignee"
                  disabled={isUpdatingAssignee}
                >
                  <X className="w-3 h-3 text-destructive" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground p-2 rounded border border-dashed border-border">
              Not assigned
            </div>
          )}
          
          {/* Assign selector */}
          <Select onValueChange={handleAssigneeChange} disabled={isUpdatingAssignee}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Assign to..." />
            </SelectTrigger>
            <SelectContent>
              {assignLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader className="w-3 h-3 animate-spin" />
                </div>
              ) : workspaceMembers && workspaceMembers.length > 0 ? (
                workspaceMembers.map((member) => {
                  const userId = member.user.profiles?.id || member.user.id;
                  const email = member.user.profiles?.email || member.user.email || "Unknown user";
                  const isAssigned = task.assignment?.some((a: any) => a.userId === userId);
                  return (
                    !isAssigned && (
                      <SelectItem key={member.id} value={userId}>
                        {email}
                      </SelectItem>
                    )
                  );
                })
              ) : (
                <div className="py-2 px-2 text-sm text-gray-500">
                  No members available
                </div>
              )}
            </SelectContent>
          </Select>
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
