import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function assignTask(taskId: string, userId: string) {
  try {
    await prisma.taskAssignment.create({
      data: {
        taskId,
        userId,
      },
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
