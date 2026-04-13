"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaClient, Project } from "@prisma/client";
import { getServerCookie } from "../helper/server-cookie";
import { checkIsAdmin } from "./workspaceMember.action";
import { getWorkspaceById } from "./workspaces.action";
import { prisma } from "../prisma";
import { toast } from "sonner";

const getCachedProjects = unstable_cache(
  async (workspaceId: string, search?: string) => {
    try {
      return await prisma.project.findMany({
        where: {
          workspaceId,
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        include: { Workspace: { include: { users: true } } },
      });
    } catch (error) {
      throw error;
    }
  },
  ["projects", "workspaceId"],
  {
    tags: ["projects"],
    revalidate: 60,
  },
);

export async function getProjects(search?: string) {
  const workspaceId = await getServerCookie("workspaceId");
  if (!workspaceId) redirect("/select-workspace");
  const existingWorkspace = await getWorkspaceById(workspaceId);
  if (!existingWorkspace) redirect("/select-workspace");
  return getCachedProjects(workspaceId, search);
}

export async function getProjectById(id: string) {
  try {
    return prisma.project.findUnique({
      where: { id },
      include: { Workspace: true },
    });
  } catch (error) {
    throw error;
  }
}

export async function createProject(data: {
  name: string;
  description?: string;
  workspaceId: string;
}) {
  try {
    await prisma.project.create({
      data: { ...data },
    });
    revalidateTag("projects", "");
    redirect("/");
  } catch (error) {
    throw error;
  }
}

type ProjectWithoutTimestamps = Omit<Project, "createdAt" | "updatedAt">;

export async function updateProject(data: ProjectWithoutTimestamps) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin)
      return {
        message: "You cannot access to this workspace.",
        success: false,
      };
    const project = prisma.project.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    revalidateTag("projects", "");
    return {
      data: project,
      success: true,
      message: "Project updated successfully!",
    };
  } catch {
    return { message: "Failed to update project.", success: false };
  }
}

export async function deleteProject(id: string) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin)
      return {
        message: "You cannot delete projects in this workspace.",
        success: false,
      };
    const project = prisma.project.delete({
      where: { id: id },
    

    });
    revalidateTag("projects", "");
    return {
      data: project,
      success: true,
      message: "Project deleted successfully!",
      
    };
  } catch {
    return { message: "Failed to delete project.", success: false };
  }
}
