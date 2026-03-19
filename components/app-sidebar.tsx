// "use client";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "./ui/sidebar";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
// import User from "./svg/User";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "./ui/collapsible";
// import Rocket from "./svg/Rocket";
// import Members from "./svg/Members";
// import { getRandomProjectIcon } from "../lib/getIocns";
// import { MoreHorizontal, Plus, ChevronDown } from "lucide-react";
// import { getWorkspaceProjects } from "../lib/actions/workspaces.action";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// interface Project {
//   id: string;
//   name: string;
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const pathname = usePathname();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [projectsOpen, setProjectsOpen] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await getWorkspaceProjects();
//         setProjects(response || []);
//       } catch (error) {
//         console.log("[v0] Error fetching projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   return (
//     <Sidebar {...props}>
//       <SidebarContent className="gap-0 mt-12 p-2">
//         {/* For you */}
//         <Link href="/">
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <SidebarMenuButton
//                 className={`py-2 px-0 text-foreground ${
//                   pathname === "/"
//                     ? "bg-button/10 text-button hover:bg-button/25 hover:text-button"
//                     : ""
//                 }`}
//                 asChild
//               >
//                 <div className="w-full flex items-center gap-2 cursor-pointer">
//                   <span
//                     className={`h-[12px] w-[2px] ${
//                       pathname === "/" ? "bg-button" : "bg-transparent"
//                     }`}
//                   ></span>
//                   <User />
//                   <span className="font-semibold">For you</span>
//                 </div>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </Link>

//         {/* Projects */}
//         <Collapsible
//           open={projectsOpen}
//           onOpenChange={setProjectsOpen}
//           className="group/collapsible p-0 select-none"
//         >
//           <SidebarGroup className="p-0">
//             <CollapsibleTrigger asChild>
//               <div className="w-full flex items-center justify-between px-2 py-2 cursor-pointer rounded-md hover:bg-sidebar-accent/50 transition-colors">
//                 <div className="flex items-center gap-2">
             
//                   <div style={{ width: 16, height: 16 }}>
//                     <Rocket />
//                   </div>
//                   <h1 className="font-semibold">Projects</h1>
//                 </div>
//                 {/* <div className="flex items-center gap-1">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       router.push("/create-project");
//                     }}
//                     className="p-1 rounded hover:bg-button/10 transition-colors"
//                   >
//                     <Plus className="h-4 w-4" />
//                   </button>
//                   <ChevronDown className={`h-4 w-4 transition-transform ${projectsOpen ? "rotate-0" : "-rotate-90"}`} />
//                 </div> */}
//               </div>
//             </CollapsibleTrigger>

//             <CollapsibleContent>
//               <SidebarGroupContent className="ml-2 mt-2 space-y-2">
//                 {loading ? (
//                   <div className="text-sm text-muted-foreground">Loading...</div>
//                 ) : projects.length > 0 ? (
//                   projects.map((project) => {
//                     const icon = getRandomProjectIcon();
//                     const isActive = pathname.includes(project.id);
//                     const displayName =
//                       project.name.length > 20
//                         ? project.name.substring(0, 20) + "..."
//                         : project.name;

//                     return (
//                       <Link
//                         href={`/projects/${project.id}`}
//                         key={project.id}
//                         className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
//                           isActive
//                             ? "border-button bg-button/10 text-button"
//                             : "border-input bg-background hover:border-button/50"
//                         }`}
//                       >
//                         <Image src={icon} alt="Project Icon" className="h-5 w-5 flex-shrink-0" />
//                         <span className="font-medium flex-1 truncate">{displayName}</span>
//                         <MoreHorizontal className="h-4 w-4 opacity-50 hover:opacity-100 flex-shrink-0" />
//                       </Link>
//                     );
//                   })
//                 ) : (
//                   <div className="text-sm text-muted-foreground">No projects yet</div>
//                 )}
//               </SidebarGroupContent>
//             </CollapsibleContent>
//           </SidebarGroup>
//         </Collapsible>

//         {/* Members */}
//         <Link href="/members">
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <SidebarMenuButton
//                 className={`py-2 px-0 text-foreground ${
//                   pathname === "/members"
//                     ? "bg-button/10 text-button hover:bg-button/25 hover:text-button"
//                     : ""
//                 }`}
//                 asChild
//               >
//                 <div className="w-full flex items-center gap-2 cursor-pointer">
//                   <span
//                     className={`h-[12px] w-[2px] ${
//                       pathname === "/members" ? "bg-button" : "bg-transparent"
//                     }`}
//                   ></span>
//                   <Members />
//                   <span className="font-semibold">Members</span>
//                 </div>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </Link>
//       </SidebarContent>
//       <SidebarRail />
//     </Sidebar>
//   );
// }


"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import User from "./svg/User";
import Rocket from "./svg/Rocket";
import Members from "./svg/Members";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

import { MoreHorizontal, ChevronDown,Plus  } from "lucide-react";
import { getWorkspaceProjects } from "../lib/actions/workspaces.action";
import { getRandomProjectIcon } from "../lib/getIocns";

import Image from "next/image";

interface Project {
  id: string;
  name: string;
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getWorkspaceProjects();
        setProjects(res || []);
      } catch (err) {
        console.log("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarContent className="gap-0 mt-12 p-2">
        {/* FOR YOU */}
        <Link href="/">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={`py-2 px-0 text-foreground ${
                  pathname === "/"
                    ? "bg-button/10 text-button hover:bg-button/25"
                    : ""
                }`}
              >
                <div className="w-full flex items-center gap-2 cursor-pointer">
                  <span
                    className={`h-[12px] w-[2px] ${
                      pathname === "/" ? "bg-button" : "bg-transparent"
                    }`}
                  />
                  <User />
                  <span className="font-semibold">For you</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Link>

        {/* PROJECTS */}
        <Collapsible
          open={projectsOpen}
          onOpenChange={setProjectsOpen}
          className="p-0"
        >
          <SidebarGroup className="p-0">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors text-foreground"
              >
                <div className="flex items-center gap-2">
                  <div  className="w-4 h-4 shrink-0">
                      <Rocket/>
                  </div>
                
                  <span className="font-semibold">Projects</span>
                </div>
                <div className="flex items-center gap-2">
                    <Plus className="w-[20px] h-[20px] cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  router.push("/create-project")
                }} />
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    projectsOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
                </div>
              
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarGroupContent className="ml-2 mt-2 space-y-2">
                {loading ? (
                  <div className="text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : projects.length > 0 ? (
                  projects.map((project) => {
                    const icon = getRandomProjectIcon();
                    const isActive = pathname.includes(project.id);

                    const displayName =
                      project.name.length > 20
                        ? project.name.slice(0, 20) + "..."
                        : project.name;

                    return (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                          isActive
                            ? "border-button bg-button/10 text-button"
                            : "border-input bg-background hover:border-button/50"
                        }`}
                      >
                        <Image
                          src={icon}
                          alt="icon"
                          width={20}
                          height={20}
                          className="shrink-0"
                        />

                        <span className="flex-1 truncate font-medium">
                          {displayName}
                        </span>

                        <MoreHorizontal className="h-4 w-4 opacity-50 hover:opacity-100 shrink-0" />
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

        {/* MEMBERS */}
        <Link href="/members">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={`py-2 px-0 text-foreground ${
                  pathname === "/members"
                    ? "bg-button/10 text-button hover:bg-button/25"
                    : ""
                }`}
              >
                <div className="w-full flex items-center gap-2 cursor-pointer">
                  <span
                    className={`h-[12px] w-[2px] ${
                      pathname === "/members"
                        ? "bg-button"
                        : "bg-transparent"
                    }`}
                  />
                  <Members />
                  <span className="font-semibold">Members</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Link>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}