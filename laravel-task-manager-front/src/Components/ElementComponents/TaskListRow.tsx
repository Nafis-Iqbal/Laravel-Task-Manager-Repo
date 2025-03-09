import { useNavigate } from "react-router-dom";

const TaskListRow = ({task, onDelete}:{task: Task, onDelete: (task_id: number) => void}) => {
  const navigate = useNavigate();

  return (
    <tr
      className="border-b hover:bg-gray-100 transition cursor-pointer"
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <td className="p-4 w-2/10">{task.title}</td>
      <td className="p-4 w-5/10">{task.description}</td>
      <td className="p-4 w-1/10 text-center">{task.project_id}</td>
      <td className="flex p-4 w-2/10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${task.project_id}`);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-1/2 mr-2"
        >
          Go To Project
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="bg-red-600 text-white items-center px-4 py-2 rounded-md hover:bg-red-700 w-1/2"
        >
          Delete Task
        </button>
      </td>
    </tr>
  );
};

export default TaskListRow;
