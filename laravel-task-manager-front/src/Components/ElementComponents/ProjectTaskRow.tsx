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
      <td className="p-3">{task.status}</td>
      <td className="p-3">{task.priority}</td>
      <td className="p-3">{task.end_date ? task.end_date.toDateString() : "No end date"}</td>
    </tr>
  );
};

export default ProjectTaskRow;
