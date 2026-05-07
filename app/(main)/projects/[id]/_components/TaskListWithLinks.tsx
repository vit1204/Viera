"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

interface TableColumn {
  title: string;
  key: string;
}

interface TableRow {
  [key: string]: any;
}

interface ReusableTableProps {
  columns: TableColumn[];
  data: TableRow[];
}

const TasksListWithLinks: React.FC<ReusableTableProps> = ({ columns, data }) => {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-1 text-left text-[12px] font-semibold text-gray-700 whitespace-nowrap"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {columns.map((col) => {
                const content = row[col.key];
                const isTitle = col.key === "title";
                const taskId = row.taskId;

                if (taskId) {
                  return (
                    <td key={col.key} className="px-4 py-2 font-normal text-[14px]">
                      <Link
                        href={`localhost:3000/projects/${projectId}/tasks/${taskId}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {content}
                      </Link>
                    </td>
                  );
                }

                return (
                  <td key={col.key} className="px-4 py-2 font-normal text-[14px] whitespace-nowrap">
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksListWithLinks;
