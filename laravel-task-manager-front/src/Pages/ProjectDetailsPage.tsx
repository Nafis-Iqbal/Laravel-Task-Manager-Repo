import React, { useState, useEffect } from "react";
import { useNavigate , useParams} from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { generateFakeTasks } from "../Utilities/FakeData";
import {priority, statusEnum, role} from "../Types&Enums/Enums";
import { useGetTasksByProjectRQ } from "../Services/API/TaskApi";

import ProjectTaskRow from "../Components/ElementComponents/ProjectTaskRow";
import { TableDataBlock } from "../Components/ElementComponents/TableDataBlock";
import { ProjectHeroSection } from "../Components/StructureComponents/ProjectHeroSection";

//const isDebugMode = import.meta.env.VITE_APP_DEBUG_MODE === 'true';
let isDebugMode: boolean = false;

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
  const [tasksFetchMessage, setTasksFetchMessage] = useState<string>("");
  const [isProgressSortAscending, setIsProgressSortAscending] = useState(true);
  const [isDateSortAscending, setIsDateSortAscending] = useState(true);
  const navigate = useNavigate();

  const {projectId} = useParams();
  const projectIdNumber = Number(projectId);

  const {data: projectTasks, isLoading: isTasksByProjectLoading, isError: isTasksLoadingError} = useGetTasksByProjectRQ(
    projectIdNumber, 
    () => {
    },
    () => {
    }
  );

  useEffect(() => {
    setTasks(projectTasks?.data.data);
    //console.log(projectTasks?.data.data);
    if(isTasksLoadingError){
      setTasksFetchMessage("Failed to load Project Tasks.");
    }
    if(projectTasks?.data.data.length < 1){
      setTasksFetchMessage("No Tasks to show.");
    }
  }, [projectTasks, isTasksLoadingError]);

  // Sorting Handlers
  const sortByDueDate = () => {
    setTasks([...tasks].sort((a, b) => 
      isDateSortAscending? new Date(a.end_date).getTime() - new Date(b.end_date).getTime() : new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
    ));

    setIsDateSortAscending(!isDateSortAscending);
  };

  const sortByPriority = () => {

    setIsProgressSortAscending(!isProgressSortAscending);
  };

  return (
    <div className="max-w-4xl min-h-screen mx-auto p-6 text-white bg-gray-200">
      {/* Hero Section */}
      <ProjectHeroSection projectTasks={tasks}/>

      {/* Task Table Section */}
      <div className="mt-6 bg-white text-gray-800 p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Project Tasks</h2>
          <div className="space-x-2">
            <button onClick={sortByDueDate} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Sort by Due Date
            </button>
            <button onClick={sortByPriority} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              Sort by Priority
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Task Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              <TableDataBlock
                dataList={tasks}
                dataFetchMessage={tasksFetchMessage}
                isDataLoading={isTasksByProjectLoading}
                noContentColSpan={4}
                onClickNavigate={(id: number) => navigate(`/tasks/${id}`)}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
