import { useNavigate } from "react-router-dom";

const TaskListRow = ({ task }: { task: Task }) => {
  const navigate = useNavigate();

  return (
    <tr
      className="border-b hover:bg-gray-100 transition cursor-pointer"
      onClick={() => navigate(`/tasks/${task.task_id}`)}
    >
      <td className="p-4">{task.title}</td>
      <td className="p-4">{task.description}</td>
      <td className="p-4 text-center">{task.project_id}</td>
      <td className="p-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${task.project_id}`);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Go To Project
        </button>
      </td>
    </tr>
  );
};

export default TaskListRow;
