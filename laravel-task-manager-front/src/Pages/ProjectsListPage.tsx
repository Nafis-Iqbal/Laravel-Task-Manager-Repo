import { useEffect, useState } from "react";

import {statusEnum} from "../Types&Enums/Enums";
import { generateFakeProjects } from "../Utilities/FakeData";
import { useGetProjectsRQ, useDeleteProjectRQ } from "../Services/API/ProjectApi";

import ProjectListRow from "../Components/ElementComponents/ProjectListRow";
import BasicButton from "../Components/ElementComponents/BasicButton";
import CreateProjectModal from "../Components/Modals/CreateProjectModal";
import LoadingSpinner from "../Components/LoadingAnimationDiv";
import NotificationPopUp from "../Components/Modals/NotificationPopUpModal";
import LoadingModal from "../Components/Modals/LoadingContentModal";

const isDebugMode:boolean = false;

let initialProjects: Project[] = [];

if(isDebugMode){
    initialProjects = generateFakeProjects(10);
}

const ProjectsListPage = () => {
  const [projects, setProjects] = useState<Project[]>(isDebugMode? initialProjects : []);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [loadingContentOpen, setLoadingContentOpen] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const {data: projectList} = useGetProjectsRQ(
    () => {
      setProjects(projectList?.data.data);
    }
  );

  const {mutate: deleteProjectMutate} = useDeleteProjectRQ(
    () => {

    }
  );

  useEffect(() => {
    setProjects(projectList?.data.data);
  }, [projectList]);

  const openCreateProjectForm = () => {
    setIsCreateProjectOpen(true);
  };

  //Not used in react-query mode
  const onCreateProjectSubmit = (e: React.FormEvent, formData: Project) => {
    e.preventDefault();

    //calls api

    setProjects((prevProjects) => ([
      ...prevProjects,
      {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        progress: 0,
        user_id: formData.user_id,
        status: statusEnum.active,
        end_Date: formData.end_Date,
      }
    ]));

    setIsCreateProjectOpen(false);
  }

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
          end_Date: formData.end_Date,
        }
      ]));
    }
  }

  const onProjectDelete = (project_id: number) => {
    setLoadingContentOpen(true);
    deleteProjectMutate(project_id);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between bg-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Projects List</h1>
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
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <ProjectListRow key={project.id} 
                  project={project} 
                  onDelete={() => onProjectDelete(project.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4}>
                  <LoadingSpinner/>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end p4 bg-gray-200">
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
