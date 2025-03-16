import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

import { generateFakeTasks } from "../Utilities/FakeData";
import {useGetTasksRQ, useDeleteTaskRQ} from "../Services/API/TaskApi";
import { useGetProjectsRQ } from "../Services/API/ProjectApi";
import { queryClient } from "../Services/API/ApiInstance";

import BasicButton from "../Components/ElementComponents/BasicButton";
import ScrollToTopButton from "../Components/StructureComponents/ScrollToTopButton";
import CreateTaskModal from "../Components/Modals/CreateTaskModal";
import NotificationPopUp from "../Components/Modals/NotificationPopUpModal";
import LoadingModal from "../Components/Modals/LoadingContentModal";
import { TableDataBlock } from "../Components/ElementComponents/TableDataBlock";

const isDebugMode:boolean = false;

let initialTasks: Task[] = [];
let projectData: ProjectData[] = []; 

if(isDebugMode){
  initialTasks = generateFakeTasks(10);
  projectData = [{id: 1, title: "Bichi"}];
}

const TasksListPage = () => {
  const location = useLocation();

  const [tasks, setTasks] = useState<Task[]>(initialTasks ?? []);
  const [tasksFetchMessage, setTasksFetchMessage] = useState<string>("");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(location.state?.isCreateTaskOpen);
  const [loadingContentOpen, setLoadingContentOpen] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const projectsData = useRef<ProjectData[]>([]);
  
  const { data: tasksList , isLoading: isTasksLoading} = useGetTasksRQ(
    undefined, 
    () => {
      setTasks(tasksList?.data.data);
      if(tasksList?.data.data.length < 1){
        setTasksFetchMessage("No tasks to show.");
      }
    },
    () => {
      setTasksFetchMessage("Failed to Load tasks.");
    }
  );

  const {data: projectsDataResult} = useGetProjectsRQ(
    undefined,
    () => {
      projectsData.current = projectsDataResult?.data.data;
    },
    () => {

    }
  );

  const {mutate: deleteTaskMutate} = useDeleteTaskRQ(
    () => {
      setLoadingContentOpen(false);
      openNotificationPopUpMessage("Task deleted successfully.");

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    () => {
      setLoadingContentOpen(false);
      openNotificationPopUpMessage("Failed to delete task. Try again");
    }
  );

  useEffect(() => {
    setTasks(tasksList?.data.data);
    setLoadingContentOpen(false);
  }, [tasksList]);

  useEffect(() => {
    projectsData.current = projectsDataResult?.data.data;
  }, [projectsDataResult])

  const openCreateTaskForm = () => {
    setIsCreateTaskOpen(true);
  }

  const OnCreateTaskSubmit = () => {
    setLoadingContentOpen(true);
  }

  const onCreateTaskSuccess = (formData: Task) => {
    setLoadingContentOpen(false);

    openNotificationPopUpMessage("Task created successfully!");

    if(tasks)
    {
      setTasks((prevTasks) => [
        ...prevTasks,
        {
          id: formData.id, // Generate a new task ID
          title: formData.title,
          description: formData.description,
          project_id: formData.project_id,
          priority: formData.priority,
          status: formData.status, // Default status
          progress: 0, // Default progress value
          user_id: 1, // Example, assuming you have a static user_id or get it dynamically
          start_date: new Date(), // Default to the current date
          end_date: formData.end_date, // From the form data
        }
      ]);
    }
  }

  const onCreateTaskFailure = () => {
    setLoadingContentOpen(false);
    openNotificationPopUpMessage("Error creating task!");
  }

  const onTaskDelete = (task_id: number) => {
    setLoadingContentOpen(true);
    deleteTaskMutate(task_id);
  }

  const openNotificationPopUpMessage = (popUpMessage: string) => {
    setNotificationPopupOpen(true);
    setNotificationMessage(popUpMessage);
  }
  
  return (
    <div className="max-w-4xl min-h-screen mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center rounded-t-md p4 bg-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 my-2 ml-3">Tasks List</h1>
        <BasicButton
          buttonText="Create New Task"
          buttonColor="green-500"
          textColor="white"
          onClick={openCreateTaskForm}
          customStyle="mr-2"
        />
      </div>

      <CreateTaskModal
        isOpen = {isCreateTaskOpen}
        projects = {projectsData.current? Object.values(projectsData.current).map(({id, title}) => ({id, title})) : []}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={OnCreateTaskSubmit}
        onSuccess={onCreateTaskSuccess}
        onFailure={onCreateTaskFailure}
      />

      <NotificationPopUp
        isOpen = {notificationPopupOpen}
        onClose = {() => setNotificationPopupOpen(false)}
        message = {notificationMessage}
      />

      <LoadingModal
        isOpen = {loadingContentOpen}
      />

      <ScrollToTopButton/>
      
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="table-fixed w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 border-color-red">
              <th className="p-4 w-2/10 text-left">Task Title</th>
              <th className="p-4 w-5/10 text-left">Description</th>
              <th className="p-4 w-1/10 text-center">Project ID</th>
              <th className="p-4 w-2/10 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <TableDataBlock
              dataList={tasks}
              dataFetchMessage={tasksFetchMessage}
              onDataDelete={(id: number) => onTaskDelete(id)}
              isDataLoading={isTasksLoading}
              noContentColSpan={4}
            />
          </tbody>
        </table>
      </div>

      <div className="flex justify-end p4 bg-gray-200 rounded-b-md">
        {tasks && tasks.length > 5 && (<BasicButton
          buttonText="Create New Task"
          buttonColor="green-500"
          textColor="white"
          onClick={openCreateTaskForm}
          customStyle="pt-2 mt-1 mr-2 mb-1"
        />
        )}
      </div>
    </div>
  );
};

export default TasksListPage;
