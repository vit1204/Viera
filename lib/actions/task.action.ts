"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { Priority, PrismaClient, task } from "@prisma/client";
import { parseDate, utcDayRange } from "../helper/convert-date";
import { assignTask } from "./taskAssignment.action";
import { getUser } from "./getUser.action";
import { prisma } from "../prisma";
import { checkIsAdmin } from "./workspaceMember.action";
import { check } from "zod";

export const getTasks = unstable_cache(
  async (
    projectId: string,
    search?: string,
    dueDate?: Date,
    priority?: Priority,
    status?: task,
  ) => {
    const parsed = parseDate(dueDate);
    const dateFilter = parsed
      ? (() => {
          const { start, end } = utcDayRange(parsed);
          return { gte: start, lt: end };
        })()
      : undefined;

    try {
      return prisma.task.findMany({
        where: {
          ...(status && { status }),
          ...(dueDate && { dueDate: dateFilter }),
          ...(priority && { priority }),
          ...(search && {
            OR: [
              {
                assignment: {
                  some: {
                    user: {
                      profiles: {
                        username: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                    },
                  },
                },
              },
              {
                description: { contains: search, mode: "insensitive" },
              },
              { title: { contains: search, mode: "insensitive" } },
            ],
          }),
          projectId,
        },
        include: {
          assignment: { select: { user: { select: { profiles: true } } } },
        },
      });
    } catch (error) {
      throw error;
    }
  },
  ["getTasks"],
  {
    revalidate: 10,
    tags: ["tasks"],
  },
);

export async function updateTask(

  id: string,
  data: {
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done" | "idea" | "in_review";
    priority: "HIGH" | "MEDIUM" | "LOW";
    dueDate?: Date;
  },
) {
  try {
    console.log("Updating task with data:");
    return prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
       },
    });
  } catch (error) {
    throw error;
  } finally {
    revalidateTag("tasks","");
  }
}

export async function deleteTask(id: string) {
  try {
    const isAdmin = await checkIsAdmin()
    if (!isAdmin)   {
      return {
        success: false,
        message: "You cannot delete tasks in this workspace.",
      };
    }   
    else{
    await prisma.task.delete({
      where: { id },
    });
    return { success: true, message: "Task deleted successfully!" };
    }
  } catch {
    return { success: false, message: "Failed to delete task." };
  } finally {
    revalidateTag("tasks", "");
  }
}

export async function createTask(data: {
  title: string;
  description?: string;
  projectId: string;
  priority: Priority;
  dueDate: Date;
  status: task;
  assignment?: string[];
}) {
  try {
    const { id } = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        projectId: data.projectId,
        status: data.status,
        dueDate: data.dueDate,
      },
    });

    if (data.assignment) {
      await Promise.all(data.assignment.map((item) => assignTask(id, item)));
    }

    revalidateTag("tasks", "");
    return { success: true, message: "Task created successfully!" };
  } catch {
    return { success: false, message: "Failed to create task." };
  }
}

const getCachedAssignedTask = unstable_cache(
  async (userId: string) => {
    try {
      return prisma.task.findMany({
        where: {
          assignment: { some: { userId } },
        },
        include: { project: true },
      });
    } catch (error) {
      throw error;
    }
  },
  ["assignedTasks"],
  {
    revalidate: 300,
    tags: ["tasks"],
  },
);

export async function getAssignedTask() {
  const user = await getUser();
  if (!user) return;
  return getCachedAssignedTask(user.id);
}
