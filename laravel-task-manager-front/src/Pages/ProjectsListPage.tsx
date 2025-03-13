import { useEffect, useState } from "react";

import {statusEnum} from "../Types&Enums/Enums";
import { generateFakeProjects } from "../Utilities/FakeData";
import { useGetProjectsRQ, useDeleteProjectRQ } from "../Services/API/ProjectApi";

import ProjectListRow from "../Components/ElementComponents/ProjectListRow";
import LoadingSpinner from "../Components/LoadingAnimationDiv";
import BasicButton from "../Components/ElementComponents/BasicButton";
import CreateProjectModal from "../Components/Modals/CreateProjectModal";
import NotificationPopUp from "../Components/Modals/NotificationPopUpModal";
import LoadingModal from "../Components/Modals/LoadingContentModal";
import { TableDataBlock } from "../Components/ElementComponents/TableDataBlock";

const isDebugMode:boolean = false;

let initialProjects: Project[] = [];

if(isDebugMode){
    initialProjects = generateFakeProjects(10);
}

const ProjectsListPage = () => {
  const [projects, setProjects] = useState<Project[]>(isDebugMode? initialProjects : []);
  const [projectsFetchMessage, setProjectsFetchMessage] = useState<string>("");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [loadingContentOpen, setLoadingContentOpen] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const {data: projectList, isLoading: isProjectsLoading} = useGetProjectsRQ(
    undefined,
    () => {
      setProjects(projectList?.data.data);
      if(projectList?.data.data.length < 1){
        setProjectsFetchMessage("No projects to show.");
      }
    },
    () => {
      setProjectsFetchMessage("Failed to Load projects.");
    }
  );

  const {mutate: deleteProjectMutate} = useDeleteProjectRQ(
    () => {

      setLoadingContentOpen(false);
    },
    () => {
      setLoadingContentOpen(false);
    }
  );

  useEffect(() => {
    setProjects(projectList?.data.data);
    setLoadingContentOpen(false);
  }, [projectList]);

  const openCreateProjectForm = () => {
    setIsCreateProjectOpen(true);
  };

  const onCreateProjectSubmitRQMode = () => {
    setLoadingContentOpen(true);
  }

  const onCreateProjectSuccess = (formData: Project) => {
    setLoadingContentOpen(false);
    setNotificationPopupOpen(true);
    setNotificationMessage("Project created successfully!");

    if(projects)
    {
      setProjects((prevProjects) => ([
        ...prevProjects,
        {
          id: formData.id,
          title: formData.title,
          description: formData.description,
          progress: 0,
          user_id: formData.user_id,
          status: statusEnum.active,
          end_date: formData.end_date,
        }
      ]));
    }
  }

  const onCreateProjectFailure = () => {

  }

  const onProjectDelete = (project_id: number) => {
    setLoadingContentOpen(true);
    deleteProjectMutate(project_id);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between bg-gray-200 mt-2 rounded-t-md">
        <h1 className="text-2xl font-bold text-gray-800 my-2 ml-3">Projects List</h1>
        <BasicButton
          buttonText="Create New Project"
          buttonColor="green-500"
          textColor="white"
          onClick={openCreateProjectForm}
          customStyle="m-1"
        />
      </div>

      <CreateProjectModal
        isOpen = {isCreateProjectOpen}
        onClose = {() => setIsCreateProjectOpen(false)}
        onSubmit= {onCreateProjectSubmitRQMode}
        onSuccess={onCreateProjectSuccess}
        onFailure={onCreateProjectFailure}
      />

      <NotificationPopUp
        isOpen = {notificationPopupOpen}
        onClose = {() => setNotificationPopupOpen(false)}
        message = {notificationMessage}
      />

      <LoadingModal
        isOpen = {loadingContentOpen}
      />

      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left">Project Title</th>
              <th className="p-4 w-1/2 text-left">Description</th>
              <th className="p-4 text-center">Progress</th>
            </tr>
          </thead>
          <tbody>
            <TableDataBlock
              isDataLoading={isProjectsLoading}  
              dataFetchMessage={projectsFetchMessage}
              dataList={projects}
              noContentColSpan={3}
              onDataDelete={(id: number) => onProjectDelete(id)}
            />
          </tbody>
        </table>
      </div>

      <div className="flex justify-end p4 bg-gray-200 rounded-b-md">
      <BasicButton
          buttonText="Create New Project"
          buttonColor="green-500"
          textColor="white"
          onClick={openCreateProjectForm}
          customStyle="pb-3 m-1"
        />
      </div>
    </div>
  );
};

export default ProjectsListPage;
