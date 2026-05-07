import { notFound } from "next/navigation";
import { prisma } from "../../../../../../lib/prisma";
import TaskDetailContent from "./_components/TaskDetailContent";

interface TaskDetailPageProps {
  params: {
    id: string;
    taskId: string;
  };
}

async function getTaskDetails(taskId: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignment: {
          include: {
            user: {
              include: {
                profiles: true,
              },
            },
          },
        },
        project: true,
      },
    });
    return task;
  } catch (error) {
    return null;
  }
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { taskId } = await params;
  
  const task = await getTaskDetails(taskId);
  
  if (!task) {
    notFound();
  }

  return <TaskDetailContent task={task} />;
}
