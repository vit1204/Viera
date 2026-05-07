/* eslint-disable */
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

const ReusableTable: React.FC<ReusableTableProps> = ({ columns, data }) => {
  // Function to format status to uppercase with spaces
  const formatStatus = (value: string) => {
    if (!value) return value;
    // Replace underscores with spaces and convert to uppercase
    return value.replace(/_/g, " ").toUpperCase();
  };

  // Function to format cell value
  const formatCellValue = (key: string, value: any) => {
    if (key === "status") {
      return formatStatus(value);
    }
    return value;
  };
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
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2 font-normal text-[14px] whitespace-nowrap">
                  {formatCellValue(col.key, row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
