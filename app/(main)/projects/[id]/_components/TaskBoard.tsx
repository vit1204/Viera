"use client";

import { TabsContent } from "../../../../../components/ui/tabs";
import {
  COLUMN_ORDER,
  COLUMN_TITLES,
  REVERSE_STATUS_MAP,
  STATUS_MAP,
} from "../../../../../constants";
import { updateTask } from "../../../../../lib/actions/task.action";
import { KanbanStatus, KanTaskType } from "../../../../../types";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Column from "./BoardColumn";

export default function KanbanBoard({
  initialTasks,
}: {
  initialTasks: KanTaskType[];
}) {
  const [tasks, setTasks] = useState<KanTaskType[]>(initialTasks);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // Build columns from current tasks state
  const buildColumns = (taskList: KanTaskType[]): Record<KanbanStatus, KanTaskType[]> => {
    const byCol: Record<KanbanStatus, KanTaskType[]> = {
      IDEA: [],
      TO_DO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      DONE: [],
    };

    for (const t of taskList) {
      const kanbanStatus = REVERSE_STATUS_MAP[t.status as keyof typeof REVERSE_STATUS_MAP];
      if (kanbanStatus && byCol[kanbanStatus]) {
        byCol[kanbanStatus].push(t);
      }
    }
    return byCol;
  };

  const columns = buildColumns(tasks);

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;

    // If dropped outside a valid area
    if (!destination) {
      return;
    }

    // If dropped in same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Get the task that was dragged
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) {
      console.log("[v0] Task not found:", draggableId);
      return;
    }

    // Get new status
    const newKanbanStatus = destination.droppableId as KanbanStatus;
    const newPrismaStatus = STATUS_MAP[newKanbanStatus];

    // Don't update if status hasn't changed
    if (task.status === newPrismaStatus) {
      return;
    }

    // Optimistic UI update
    const updatedTasks = tasks.map((t) =>
      t.id === draggableId ? { ...t, status: newPrismaStatus } : t
    );
    setTasks(updatedTasks);

    // Persist to DB
    setLoading(true);
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description ?? undefined,
        status: newPrismaStatus,
        priority: task.priority,
        dueDate: task.dueDate,
      });

      toast.success(`Task moved to ${COLUMN_TITLES[newKanbanStatus]}`);
    } catch (error) {
      console.error("[v0] Failed to update task:", error);
      // Revert optimistic update on error
      setTasks(tasks);
      toast.error("Failed to move task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TabsContent value="board">
      <div className="w-full overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 w-full min-w-max p-4 pb-20">
            {COLUMN_ORDER.map((columnStatus) => (
              <div key={columnStatus}>
                <Column
                  id={columnStatus}
                  title={COLUMN_TITLES[columnStatus]}
                  tasks={columns[columnStatus]}
                />
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </TabsContent>
  );
}
