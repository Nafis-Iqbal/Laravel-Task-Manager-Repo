import { useNavigate } from "react-router-dom";
import BasicButton from "./BasicButton";

const ProjectListRow = ({ project, onDelete }: { project: Project, onDelete: () => void }) => {
  const navigate = useNavigate();

  return (
    <tr
      className="border-b hover:bg-gray-100 transition cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <td className="p-4">{project.title}</td>
      <td className="p-4">{project.description}</td>
      <td className="p-3 flex justify-between items-center">
        <div className="relative w-24 h-3 bg-gray-300 rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${project.progress}%` }}
          />
        </div>

        <BasicButton
          buttonText="X"
          buttonColor="red-500"
          onClick={(e: React.MouseEvent<HTMLButtonElement> | undefined) => {
            if(e) e.stopPropagation();
            onDelete();
          }}
          customStyle="text-white text-center"
        />
      </td>
    </tr>
  );
};

export default ProjectListRow;
