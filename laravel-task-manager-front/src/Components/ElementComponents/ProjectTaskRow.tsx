import React from "react";

type TaskRowProps = {
  task: Task;
  onClick: () => void;
};

const ProjectTaskRow: React.FC<TaskRowProps> = ({ task, onClick }) => {
  return (
    <tr
      className="border-b border-gray-200 cursor-pointer hover:bg-blue-100 hover:shadow-md transition duration-200"
      onClick={onClick}
    >
      <td className="p-3">{task.title}</td>
      <td className="p-3">
        <div className="relative w-24 h-3 bg-gray-300 rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </td>
      <td className="p-3">{task.end_Date ? task.end_Date.toDateString() : "No end date"}</td>
    </tr>
  );
};

export default ProjectTaskRow;
