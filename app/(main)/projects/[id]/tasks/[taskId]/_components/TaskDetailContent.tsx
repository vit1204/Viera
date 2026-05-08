"use client";

import { useState } from "react";
import { updateTask } from "../../../../../../../lib/actions/task.action";
import { toast } from "sonner";
import LexicalEditorComponent from "./LexicalEditor";
import TaskDetailHeader from "./TaskDetailHeader";
import TaskDetailSidebar from "./TaskDetailSidebar";
// import TaskActivity from "./TaskActivity";
import { Button } from "../../../../../../../components/ui/button";
import { Separator } from "../../../../../../../components/ui/separator";
import { Link, Paperclip, MessageSquare } from "lucide-react";

interface TaskDetailContentProps {
  task: any;
}

export default function TaskDetailContent({ task: initialTask }: TaskDetailContentProps) {
  const [task, setTask] = useState(initialTask);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [description, setDescription] = useState(initialTask.description || "");

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsSaving(true);
      await updateTask(task.id, {
        title: task.title,
        description: task.description || "",
        status: newStatus,
        priority: task.priority,
        dueDate: task.dueDate,
      });
      setTask({ ...task, status: newStatus as any });
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      setIsSaving(true);
      await updateTask(task.id, {
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: newPriority,
        dueDate: task.dueDate,
      });
      setTask({ ...task, priority: newPriority as any });
      toast.success("Priority updated");
    } catch (error) {
      toast.error("Failed to update priority");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDescription = async () => {
    try {
      setIsSaving(true);
      await updateTask(task.id, {
        title: task.title,
        description: description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
      });
      setTask({ ...task, description });
      setIsEditing(false);
      toast.success("Description updated");
    } catch (error) {
      toast.error("Failed to update description");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex w-full h-full bg-background gap-0">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-border min-w-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <TaskDetailHeader
            task={task}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6 max-w-2xl">
            {/* Description Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">
                  Description
                </h3>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <LexicalEditorComponent
                    initialValue={description}
                    onChange={setDescription}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveDescription}
                      disabled={isSaving}
                      size="sm"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setDescription(task.description || "");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  {task.description ? (
                    <div className="text-sm text-foreground/80 p-4 rounded-md bg-muted/20 border border-border">
                      {task.description}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground p-4 rounded-md border border-dashed border-border">
                      No description yet
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Child work items (placeholder) */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">
                Child Work Items
              </h3>
              <div className="text-sm text-muted-foreground p-4 rounded-md border border-dashed border-border">
                <Button variant="ghost" className="text-primary">
                  + Add child work item
                </Button>
              </div>
            </div>

            <Separator />

            {/* Linked items (placeholder) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">
                  Linked Items
                </h3>
                <Button variant="ghost" size="sm">
                  <Link className="w-4 h-4 mr-2" />
                  Link issue
                </Button>
              </div>
              <div className="text-sm text-muted-foreground p-4 rounded-md border border-dashed border-border">
                No linked items
              </div>
            </div>

            <Separator />

            {/* Attachments (placeholder) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">
                  Attachments
                </h3>
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Add file
                </Button>
              </div>
              <div className="text-sm text-muted-foreground p-4 rounded-md border border-dashed border-border">
                No attachments
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <TaskDetailSidebar
        task={task}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onDueDateChange={(date) => console.log(date)}
      />

      {/* Activity Panel - Commented Out */}
      {/* <TaskActivity taskId={task.id} /> */}
    </div>
  );
}
