import React from 'react';

const TaskDetailHeroSection: React.FC<{
    task_id: number,
    task_title: string,
    project_id: number,
    project_title: string,
    user_id: number,
    userName: string,
    customStyle?: string
}> = ({
    task_id, 
    task_title, 
    project_id, 
    project_title, 
    user_id, 
    userName,
    customStyle
} : {
    task_id: number,
    task_title: string,
    project_id: number,
    project_title: string,
    user_id: number,
    userName: string,
    customStyle?: string
}) => {
  const taskStats = { completed: 10, ongoing: 5 }; // Example data
  const projectStats = { completed: 7, ongoing: 3 }; // Example data

  return (
    <div className={`bg-gray-500 p-8 rounded-lg shadow-md ${customStyle}`}>
        <div className="flex flex-col">
            <h1 className="text-4xl font-semibold mb-3 bg-blue-400 rounded-lg p-2">{task_title}</h1>

            <h3 className="text-2xl font-semibold">{task_id}</h3>
            
            <div className="min-h-[150px]"></div>
            
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <h2 className="text-2xl bg-blue-400 rounded-lg p-2">{project_title}</h2>
                    <p className="text-center pt-2 text-xl font-semibold">{project_id}</p>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-2xl bg-blue-400 rounded-lg p-2">{userName}</h2>
                    <p className="text-center pt-2 text-xl font-semibold">{user_id}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TaskDetailHeroSection;
