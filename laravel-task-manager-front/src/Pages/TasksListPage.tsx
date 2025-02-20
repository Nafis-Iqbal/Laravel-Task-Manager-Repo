import { useEffect, useState } from "react";
import { generateFakeTasks } from "../Utilities/FakeData";
import TaskListRow from "../Components/TaskListRow";
import {priority, statusEnum, role} from "../Types&Enums/Enums";

//const isDebugMode = import.meta.env.VITE_APP_DEBUG_MODE === 'true';
const isDebugMode = true;

let initialTasks: Task[] = [];

if(isDebugMode === true){
  initialTasks = generateFakeTasks(10);
}


const TasksListPage = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  useEffect(() => {
    setTasks(generateFakeTasks(10)); // Simulate API response
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tasks List</h1>

      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left">Task Title</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-center">Project ID</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskListRow key={task.task_id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksListPage;
