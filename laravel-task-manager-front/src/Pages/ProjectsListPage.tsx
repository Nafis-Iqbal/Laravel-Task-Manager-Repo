import { useEffect, useState } from "react";
import { generateFakeProjects } from "../Utilities/FakeData";
import ProjectListRow from "../Components/ProjectListRow";
import {priority, statusEnum, role} from "../Types&Enums/Enums";

//const isDebugMode = import.meta.env.VITE_APP_DEBUG_MODE === 'true';
const isDebugMode = true;

let initialProjects: Project[] = [];

if(isDebugMode === true){
    initialProjects = generateFakeProjects(10);
}

const ProjectsListPage = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Projects List</h1>

      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left">Project Title</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-center">Project ID</th>
              <th className="p-4 text-center">Progress</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <ProjectListRow key={project.project_id} project={project} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsListPage;
