import React, { useState, useEffect } from "react";
import { useNavigate , useParams} from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { generateFakeTasks } from "../Utilities/FakeData";
import {priority, statusEnum, role} from "../Types&Enums/Enums";
import { useGetTasksByProjectRQ } from "../Services/API/TaskApi";

import TaskRow from "../Components/ElementComponents/ProjectTaskRow";

//const isDebugMode = import.meta.env.VITE_APP_DEBUG_MODE === 'true';
let isDebugMode: boolean = true;

let initialTasks: Task[] = [];

if(isDebugMode){
  initialTasks = generateFakeTasks(10);
}

// Chart Data
const chartData = [
  { name: "Completed", value: initialTasks.filter((t) => t.status === statusEnum.completed).length },
  { name: "In Progress", value: initialTasks.filter((t) => t.status === statusEnum.active).length },
  { name: "Paused", value: initialTasks.filter((t) => t.status === statusEnum.paused).length },
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"]; // Green, Blue, Orange

const ProjectDetailsPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(isDebugMode? initialTasks: []);
  const [isProgressSortAscending, setIsProgressSortAscending] = useState(true);
  const [isDateSortAscending, setIsDateSortAscending] = useState(true);
  const navigate = useNavigate();

  const {projectId} = useParams();
  const projectIdNumber = Number(projectId);

  const {data: projectTasks} = useGetTasksByProjectRQ(
    projectIdNumber, () => {
      setTasks(projectTasks?.data.data);
    }
  );

  useEffect(() => {
    setTasks(projectTasks?.data.data);
  }, [projectTasks]);

  // Sorting Handlers
  const sortByDueDate = () => {
    setTasks([...tasks].sort((a, b) => 
      isDateSortAscending? new Date(a.end_Date).getTime() - new Date(b.end_Date).getTime() : new Date(b.end_Date).getTime() - new Date(a.end_Date).getTime()
    ));

    setIsDateSortAscending(!isDateSortAscending);
  };

  const sortByProgress = () => {
    setTasks([...tasks].sort((a, b) => 
      isProgressSortAscending? b.progress - a.progress : a.progress - b.progress
    ));

    setIsProgressSortAscending(!isProgressSortAscending);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen p-8 text-white">
      {/* Hero Section */}
      <div className="bg-white text-gray-800 p-6 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Project Dashboard</h1>
        <div className="flex justify-center">
          <ResponsiveContainer width={400} height={250}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Table Section */}
      <div className="mt-6 bg-white text-gray-800 p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Project Tasks</h2>
          <div className="space-x-2">
            <button onClick={sortByDueDate} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Sort by Due Date
            </button>
            <button onClick={sortByProgress} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              Sort by Progress
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Task Name</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskRow key={task.id} task={task} onClick={() => navigate(`/tasks/${task.id}`)} />
                  ))
              ) : (
                <div></div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
