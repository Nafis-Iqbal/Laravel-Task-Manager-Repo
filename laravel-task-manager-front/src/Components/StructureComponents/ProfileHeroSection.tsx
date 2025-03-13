import React from 'react';
import {statusEnum} from "../../Types&Enums/Enums";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

const ProfileHeroSection = ({projects = [], tasks = []} : {projects: Project[], tasks: Task[]}) => {
  const taskChartData = [
              { name: "Completed", value: tasks.filter((t) => t.status === statusEnum.completed).length },
              { name: "In Progress", value: tasks.filter((t) => t.status === statusEnum.active).length },
              { name: "Paused", value: tasks.filter((t) => t.status === statusEnum.paused).length },
              { name: "Cancelled", value: tasks.filter((t) => t.status === statusEnum.cancelled).length },
          ];
  
  const projectChartData = [
            { name: "Completed", value: projects.filter((t) => t.status === statusEnum.completed).length },
            { name: "In Progress", value: projects.filter((t) => t.status === statusEnum.active).length },
            { name: "Paused", value: projects.filter((t) => t.status === statusEnum.paused).length },
        ];

        console.log(projectChartData);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-4">Tasks and Projects Progress</h2>
      <div className="min-h-[50px]"></div>
      <div className="flex">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">Tasks</h3>
            <ResponsiveContainer width={400} height={250}>
              <PieChart>
                  <Pie data={taskChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {taskChartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                  <Tooltip />
              </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">Projects</h3>
            <ResponsiveContainer width={400} height={250}>
              <PieChart>
                    <Pie data={projectChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {projectChartData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                      </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeroSection;
