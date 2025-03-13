import { useNavigate } from "react-router-dom";
import BasicButton from "./BasicButton";

const ProjectListRow = ({ project, onDelete }: { project: Project, onDelete: () => void }) => {
  const navigate = useNavigate();

  return (
    <tr
      className="border-b hover:bg-gray-100 transition cursor-pointer"
    >
      <td className="p-4" onClick={() => navigate(`/projects/${project.id}`)}>{project.title}</td>
      <td className="p-4" onClick={() => navigate(`/projects/${project.id}`)}>{project.description}</td>
      <td className="p-3 flex justify-between space-x-2 items-center">
        <div className="relative flex-grow-[4] basis-0 h-3 bg-gray-300 rounded-full" onClick={() => navigate(`/projects/${project.id}`)}>
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
          customStyle="text-white text-center flex-grow-[1] basis-0"
        />
      </td>
    </tr>
  );
};

export default ProjectListRow;
