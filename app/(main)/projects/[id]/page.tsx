import Board from "../../../../components/svg/Board";
import Date from "../../../../components/svg/Date";
import List from "../../../../components/svg/List";
import { AvatarCircles } from "../../../../components/ui/avatar-circles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { getProjectById } from "../../../../lib/actions/projects.action";
import { getTasks } from "../../../../lib/actions/task.action";
import formatDate from "../../../../lib/helper/convert-date";
import { Priority, task } from "@prisma/client";
import TaskActions from "./_components/TaskActions";
import KanbanBoard from "./_components/TaskBoard";
import TasksList from "./_components/TasksList";
import dynamic from "next/dynamic";
import SearchTasksInput from "../../../../components/SearchTasks";
import TaskCalendar from "./_components/TaskCalendar";
import { AnalysisTab } from "./_components/AnalysisTab";
import { Zap } from "lucide-react";
import { AITaskGeneratorTab } from "./_components/AITaskGen";


const FiltersPopover = dynamic(() => import("./_components/FilterTask"), {
  ssr: true,
  loading: () => <p>Loading filters...</p>,
});

const CreateTaskDialog = dynamic(() => import("./_components/CreateTask"), {
  ssr: true,
  loading: () => <p>Loading...</p>,
});

const tabs = [
  { text: "List", value: "list", icon: <List /> },
  { text: "Board", value: "board", icon: <Board /> },
  { text: "Calendar", value: "calendar", icon: <Date /> },
  { text: "Analyst", value: "analyst", icon: <Zap /> },
];

interface IProps {
  searchParams?: {
    search?: string;
    status: task;
    priority: Priority;
    dueDate: Date;
  };
  params: {
    id: string;
  };
}

const ProjectTask = async ({ params, searchParams }: IProps) => {
  const pageSearchParams = await searchParams;
  const { id } = await params;
  const rawData = await getTasks(
    id,
    pageSearchParams?.search,
    pageSearchParams?.dueDate,
    pageSearchParams?.priority,
    pageSearchParams?.status,
  );
  const project = await getProjectById(id);
  if (!project) return;
  const data = rawData.map((item) => {
    const avatarUrl = item.assignment.map((item) => ({
      username: item.user.profiles?.username || "U",
      profileUrl: "",
    }));
    return {
      ...item,
      dueDate: formatDate(item.dueDate),
      assignee: (
        <AvatarCircles
          avatarUrls={avatarUrl}
          numPeople={item.assignment.length}
        />
      ),
      actions: <TaskActions task={item} />,
      taskId: item.id,
    };
  });
  return (
    <div>
      <h1 className="text-muted-foreground text-sm hover:underline cursor-pointer">
        Projects
      </h1>
      <div className="w-full flex gap-2 items-center pt-3">
        <span className="w-5 h-5 rounded bg-button text-white flex items-center justify-center">
          {project.name.slice(0, 1).toUpperCase()}
        </span>
        <p className="font-bold text-xl">{project.name}</p>
      </div>
      <div className="w-full mt-4">
        <Tabs defaultValue="list" className="w-full relative">
          <TabsList className="bg-transparent p-0 space-x-4">
            {tabs.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="data-[state=active]:shadow-none cursor-pointer data-[state=active]:border-button data-[state=active]:text-button text-gray-600 p-0 font-semibold hover:border-gray-300 rounded-none border-b-3 border-transparent border-r-0 border-l-0 border-t-0 h-[40px] flex items-center gap-1s"
              >
                {item.icon} {item.text}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="w-full absolute border top-[37px]" />
          <div className="max-w-min flex items-center gap-2 my-3 justify-between">
            <div className="flex w-full gap-2 items-center">
              <SearchTasksInput />
              <FiltersPopover />
            </div>
            <CreateTaskDialog />
          </div>
         <TabsContent value="list">
    <TasksList data={data} />
  </TabsContent>

  <TabsContent value="board">
    <KanbanBoard initialTasks={rawData} />
  </TabsContent>

  <TabsContent value="calendar">
    <TaskCalendar tasks={rawData} />
  </TabsContent>

  <TabsContent value="analyst">
    <AnalysisTab projectId={id} tasks={rawData} />
  </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default ProjectTask;
