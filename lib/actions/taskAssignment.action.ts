"use server";

import { PrismaClient } from "@prisma/client";
import { prisma } from "../prisma";

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
