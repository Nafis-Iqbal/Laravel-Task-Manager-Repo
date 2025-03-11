import React from 'react';
import BarChart from '../../Utilities/Barchart';

const ProfileHeroSection: React.FC = () => {
  const taskStats = { completed: 10, ongoing: 5 }; // Example data
  const projectStats = { completed: 7, ongoing: 3 }; // Example data

  return (
    <div className="bg-gray-200 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Task and Project Progress</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">Tasks</h3>
          <BarChart data={taskStats} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">Projects</h3>
          <BarChart data={projectStats} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeroSection;
