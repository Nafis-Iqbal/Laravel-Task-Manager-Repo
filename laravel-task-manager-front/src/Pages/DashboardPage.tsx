import React, { useState, useEffect } from 'react';

const tasks = [
  { id: 1, title: "Task 1", dueDate: "2025-02-20", priority: "High", status: "In Progress", assignedTo: "John" },
  { id: 2, title: "Task 2", dueDate: "2025-02-22", priority: "Medium", status: "Pending", assignedTo: "Alice" },
  { id: 3, title: "Task 3", dueDate: "2025-02-25", priority: "Low", status: "Completed", assignedTo: "Bob" },
];

const DashboardPage: React.FC = () => {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(tasks.length);

  // Filter tasks by priority
  const filterTasks = (priority: string) => {
    setFilteredTasks(tasks.filter((task) => task.priority === priority));
  };

  // Count completed and overdue tasks
  useEffect(() => {
    setCompletedTasks(tasks.filter(task => task.status === "Completed").length);
    setOverdueTasks(tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== "Completed").length);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold">Task Manager Dashboard</h1>
      </header>

      <div className="flex flex-1 p-4 space-x-4">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white rounded-lg shadow-md p-4">
          <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
          <ul>
            <li>
              <button className="w-full text-left bg-blue-500 text-white py-2 px-4 rounded-md mb-2 hover:bg-blue-600 transition">Create New Task</button>
            </li>
            <li>
              <button className="w-full text-left bg-green-500 text-white py-2 px-4 rounded-md mb-2 hover:bg-green-600 transition">View Reports</button>
            </li>
            <li>
              <button className="w-full text-left bg-yellow-500 text-white py-2 px-4 rounded-md mb-2 hover:bg-yellow-600 transition">Manage Users</button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 flex flex-col space-y-4">
          {/* Stats */}
          <section className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Total Tasks</h3>
                <p className="text-3xl font-bold">{totalTasks}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Completed Tasks</h3>
                <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium">Overdue Tasks</h3>
                <p className="text-3xl font-bold text-red-500">{overdueTasks}</p>
              </div>
            </div>
          </section>

          {/* Task Filters */}
          <section className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <div>
              <button onClick={() => filterTasks('High')} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                High Priority
              </button>
              <button onClick={() => filterTasks('Medium')} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition ml-2">
                Medium Priority
              </button>
              <button onClick={() => filterTasks('Low')} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition ml-2">
                Low Priority
              </button>
            </div>
            <div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Filter</button>
            </div>
          </section>

          {/* Task List */}
          <section className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <ul>
              {filteredTasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center border-b pb-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                    <p className="text-sm text-gray-500">Assigned to: {task.assignedTo}</p>
                  </div>
                  <div>
                    <span className={`px-4 py-2 rounded-md text-white ${
                      task.priority === 'High' ? 'bg-red-500' :
                      task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>{task.priority}</span>
                  </div>
                  <div className="ml-4">
                    <span className={`px-4 py-2 rounded-md ${
                      task.status === 'Completed' ? 'bg-green-400' :
                      task.status === 'In Progress' ? 'bg-blue-400' : 'bg-yellow-400'
                    } text-white`}>{task.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025 Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
