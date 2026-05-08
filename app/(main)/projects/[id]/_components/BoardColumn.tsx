"use client";

import { AvatarCircles } from "../../../../../components/ui/avatar-circles";
import { Card, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { GetPriorityIcon } from "../../../../../lib/helper/priority-icon";
import { KanTaskType } from "../../../../../types";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Column({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: KanTaskType[];
}) {
  const pathname = usePathname();
  const projectId = pathname.split("/")[3];

  return (
    <div className="flex flex-col gap-3 bg-muted/60 rounded p-3 min-h-[40vh] w-[270px] flex-shrink-0">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[13px] font-semibold tracking-wide text-muted-foreground gap-x-2 items-center flex">
          {title}
          <span className="text-[11px] px-[7px] bg-muted-foreground/10 rounded">
            {tasks.length}
          </span>
        </h3>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-3 flex-1 ${
              snapshot.isDraggingOver ? "bg-muted/80 rounded" : ""
            }`}
          >
            {tasks.map((task, index) => {
              const avatarUrl = task.assignment.map((item) => ({
                username: item.user.profiles?.username || "U",
                profileUrl: "",
              }));

              return (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <Link
                      href={`/projects/${projectId}/tasks/${task.id}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="block"
                    >
                      <Card
                        className={`border rounded shadow-none p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
                          snapshot.isDragging ? "opacity-50 shadow-lg" : ""
                        }`}
                      >
                        <CardHeader className="px-2 py-1">
                          <CardTitle className="text-sm font-normal leading-tight line-clamp-2 p-0">
                            {task.title}
                          </CardTitle>
                        </CardHeader>
                        <div className="px-2 py-1 flex justify-end w-full items-center gap-1.5">
                          {GetPriorityIcon(task.priority)}
                          <AvatarCircles avatarUrls={avatarUrl} numPeople={task.assignment.length} />
                        </div>
                      </Card>
                    </Link>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
