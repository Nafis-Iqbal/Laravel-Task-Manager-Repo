import { useNavigate } from "react-router-dom";

const ProjectListRow = ({ project }: { project: Project }) => {
  const navigate = useNavigate();

  return (
    <tr
      className="border-b hover:bg-gray-100 transition cursor-pointer"
      onClick={() => navigate(`/projects/${project.project_id}`)}
    >
      <td className="p-4">{project.title}</td>
      <td className="p-4">{project.description}</td>
      <td className="p-4 text-center">{project.project_id}</td>
      <td className="p-3">
        <div className="relative w-24 h-3 bg-gray-300 rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </td>
    </tr>
  );
};

export default ProjectListRow;
