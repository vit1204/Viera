"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import User from "./svg/User";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import Rocket from "./svg/Rocket";
import Members from "./svg/Members";
import { getRandomProjectIcon } from "@/lib/getIocns";
import { MoreHorizontal } from "lucide-react";
import { getWorkspaceProjects } from "@/lib/actions/workspaces.action";
import Image from "next/image";


interface Project {
  id: string;
  name: string;
}

const data = {
  navMain: [
    {
      title: "For you",
      url: "/",
      icon: <User />,
      items: null,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <Rocket />,
      items: [],
    },
    { title: "Members", url: "/members", icon: <Members /> },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getWorkspaceProjects();

          setProjects(response || []);
      } catch (error) {
        console.log("[v0] Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarContent className="gap-0 mt-12 p-2">
        {data.navMain.map((item) =>
          !item.items ? (
            <Link href={item.url} key={item.title}>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={`py-2 px-0 text-foreground ${
                      pathname === item.url
                        ? "bg-button/10 text-button hover:bg-button/25 hover:text-button"
                        : ""
                    }`}
                    asChild
                  >
                    <div className="w-full flex items-center gap-2 cursor-pointer">
                      <span
                        className={`h-[12px] w-[2px] ${
                          pathname === item.url ? "bg-button" : "bg-transparent"
                        }`}
                      ></span>
                      {item.icon}
                      <span className="font-semibold">{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </Link>
          ) : (
            <Collapsible
              key={item.title}
              title={item.title}
              defaultOpen
              className="group/collapsible p-0 select-none"
            >
              <SidebarGroup className="p-0">
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm p-0"
                >
                  <CollapsibleTrigger
                    className={`py-2 px-0 text-foreground ${
                      pathname === item.url
                        ? "bg-button/10 text-button hover:bg-button/25 hover:text-button"
                        : ""
                    }`}
                    asChild
                  >
                    <div className="w-full flex items-center cursor-pointer gap-2">
                      <span
                        className={`h-[12px] w-[2px] ${
                          pathname === item.url ? "bg-button" : "bg-transparent"
                        }`}
                      ></span>
                      {item.icon}
                      <span className="font-semibold">{item.title}</span>
                    </div>
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className="ml-2 mt-2 space-y-2">
                    {loading ? (
                      <div className="text-sm text-muted-foreground">
                        Loading...
                      </div>
                    ) : projects.length > 0 ? (
                      projects.map((project, index) => {
                        const icon = getRandomProjectIcon();
                        const isActive = pathname.includes(project.id);
                        const displayName =
                          project.name.length > 20
                            ? project.name.substring(0, 20) + "..."
                            : project.name;

                        return (
                          <Link
                            href={`/projects/${project.id}`}
                            key={project.id}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                              isActive
                                ? "border-button bg-button/10 text-button"
                                : "border-input bg-background hover:border-button/50"
                            }`}
                          >
                            <Image src={icon} alt="Project Icon" className="h-5 w-5 flex-shrink-0" />
                            <span className="font-medium flex-1 truncate">
                              {displayName}
                            </span>
                            <MoreHorizontal className="h-4 w-4 opacity-50 hover:opacity-100 flex-shrink-0" />
                          </Link>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No projects yet
                      </div>
                    )}
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
