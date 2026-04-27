/* eslint-disable */

import { TabsContent } from "../../../../../components/ui/tabs";
import dynamic from "next/dynamic";

// Lazy imports
const TasksListWithLinks = dynamic(() => import("./TasksListWithLinks"), {
  ssr: true,
  loading: () => <p>Loading table...</p>,
});

const columns = [
  { title: "Title", key: "title" },
  { title: "Summary", key: "description" },
  { title: "Status", key: "status" },
  { title: "Due date", key: "dueDate" },
  { title: "Priority", key: "priority" },
  { title: "Assignee", key: "assignee" },
  { title: "Actions", key: "actions" },
];

const TasksList = async ({ data }: { data: any }) => {
  return (
    <TabsContent value="list">
      <div className="w-full py-6">
        <TasksListWithLinks data={data} columns={columns} />
      </div>
    </TabsContent>
  );
};

export default TasksList;
