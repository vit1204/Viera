"use server";

import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { getServerCookie, setServerCookie } from "../helper/server-cookie";
import { getUser } from "./getUser.action";
import { addMember, checkIsMember } from "./workspaceMember.action";
import { prisma } from "@/lib/prisma";

export async function getWorkspaces() {
  const user = await getUser();
  try {
    return prisma.workspace.findMany({
      where: { WorkspaceMember: { some: { userId: user?.id } } },
    });
  } catch (error) {
    throw error;
  }
}

export async function getWorkspaceById(id: string) {
  const user = await getUser();
  try {
    return prisma.workspace.findUnique({
      where: { id, WorkspaceMember: { some: { userId: user?.id } } },
    });
  } catch (error) {
    throw error;
  }
}

export async function createWorkspace(data: {
  description: string;
  name: string;
}) {
  const user = await getUser();
  if (!user) return;
  try {
    const workspace = await prisma.workspace.create({
      data: { ...data, userId: user?.id },
    });
    await addMember(workspace.id, "ADMIN");
    await setServerCookie("workspaceId", workspace.id);
    redirect(`/`);
  } catch (error) {
    throw error;
  }
}


export const getWorkspaceProjects = async () => {
  const workspaceId = await getServerCookie("workspaceId");
  if (!workspaceId) return;

  const isMember = await checkIsMember();
  if (!isMember) return;

  try {
    return prisma.project.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw error;
  }
};