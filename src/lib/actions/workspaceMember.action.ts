"use server";

import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { getServerCookie } from "../helper/server-cookie";
import { getUser } from "./getUser.action";
import { prisma } from "@/lib/prisma";

const getCachedWorkspaceMembers = unstable_cache(
  async (workspaceId: string, search?: string) => {
    try {
      return prisma.workspaceMember.findMany({
        where: {
          workspaceId,
          ...(search
            ? {
                OR: [
                  {
                    user: {
                      profiles: {
                        username: { contains: search, mode: "insensitive" },
                      },
                    },
                  },
                ],
              }
            : {}),
        },
        include: { user: { select: { profiles: true } } },
      });
    } catch (error) {
      throw error;
    }
  },
  ["workspaceMembers"],
  {
    revalidate: 300,
    tags: ["members"],
  },
);

export const addMember = async (
  workspaceId: string,
  role: "ADMIN" | "COLLABORATOR",
) => {
  const user = await getUser();
  if (!user) return;
  try {
    return prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId,
        role: role,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const checkIsAdmin = async () => {
  const workspaceId = await getServerCookie("workspaceId");
  if (!workspaceId) return;
  const user = await getUser();
  if (!user) return;
  try {
    return prisma.workspaceMember.findMany({
      where: { workspaceId, role: "Admin", userId: user.id },
      select: { role: true },
    });
  } catch (error) {
    throw error;
  }
};

export const checkIsMember = async () => {
  const workspaceId = await getServerCookie("workspaceId");
  if (!workspaceId) return;
  const user = await getUser();
  if (!user) return;
  try {
    return prisma.workspaceMember.findMany({
      where: { workspaceId, userId: user.id },
    });
  } catch (error) {
    throw error;
  }
};

export const findWorkspaceMembers = async (search?: string) => {
  const workspaceId = await getServerCookie("workspaceId");
  if (!workspaceId) return;
  const isMember = await checkIsMember();
  if (!isMember) return;
  return getCachedWorkspaceMembers(workspaceId, search);
};
