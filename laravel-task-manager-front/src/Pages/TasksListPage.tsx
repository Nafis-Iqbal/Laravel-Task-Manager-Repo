import { useEffect, useState, useRef } from "react";

import { generateFakeTasks } from "../Utilities/FakeData";
import {createTask, useGetTasksRQ, useDeleteTaskRQ} from "../Services/API/TaskApi";
import { useGetProjectsRQ } from "../Services/API/ProjectApi";
import { queryClient } from "../Services/API/ApiInstance";

import TaskListRow from "../Components/ElementComponents/TaskListRow";
import BasicButton from "../Components/ElementComponents/BasicButton";
import LoadingSpinner from "../Components/LoadingAnimationDiv";
import CreateTaskModal from "../Components/Modals/CreateTaskModal";
import NotificationPopUp from "../Components/Modals/NotificationPopUpModal";
import LoadingModal from "../Components/Modals/LoadingContentModal";

const isDebugMode:boolean = false;

let initialTasks: Task[] = [];
let projectData: ProjectData[] = []; 

if(isDebugMode){
  initialTasks = generateFakeTasks(10);
  projectData = [{id: 1, title: "Bichi"}];
}

const TasksListPage = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks ?? []);
  const [loadingContentOpen, setLoadingContentOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const projectsData = useRef<ProjectData[]>([]);
  
  const { data: tasksList } = useGetTasksRQ(
    undefined, () => {
      setTasks(tasksList?.data.data);
    }
  );

  const {data: projectsDataResult} = useGetProjectsRQ(
    () => {
      console.log("bichi");
      projectsData.current = projectsDataResult?.data.data;
      console.log(projectsDataResult?.data.data);
      console.log(projectsData.current);
    }
  );

  const {mutate: deleteTaskMutate} = useDeleteTaskRQ(
    () => {
      setLoadingContentOpen(false);
      setNotificationPopupOpen(true);
      setNotificationMessage("Task deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  );

  useEffect(() => {
    setTasks(tasksList?.data.data);
  }, [tasksList]);

  const openCreateTaskForm = () => {
    setIsCreateTaskOpen(true);
  }

  //Not used with react-query
  const OnCreateTaskSubmit = (e: React.FormEvent, formData: Task) => {
    e.preventDefault();

    const createNewTaskApiCall = async () => {
      try{
        setLoadingContentOpen(true);
        const response = await createTask(formData);
        
        if(response.data?.status === "success"){
          setNotificationPopupOpen(true);

          if(tasks)
          {
            setTasks((prevTasks) => [
              ...prevTasks,
              {
                id: prevTasks.length + 2, // Generate a new task ID
                title: formData.title,
                description: formData.description,
                project_id: formData.project_id,
                priority: formData.priority,
                status: formData.status, // Default status
                progress: 0, // Default progress value
                user_id: 1, // Example, assuming you have a static user_id or get it dynamically
                start_Date: new Date(), // Default to the current date
                end_Date: formData.end_Date, // From the form data
              }
            ]);
          }
        }
      }
      catch(error)
      {
        console.log("Error creating new task inside component");
      }
      finally{
        setLoadingContentOpen(false);
      }
    }

    createNewTaskApiCall();

    setIsCreateTaskOpen(false);
  };

  const OnCreateTaskSubmitRQMode = () => {
    setLoadingContentOpen(true);
  }

  const onCreateTaskSuccess = (formData: Task) => {
    setLoadingContentOpen(false);
    setNotificationPopupOpen(true);
    setNotificationMessage("Task created successfully!");

    if(tasks)
    {
      setTasks((prevTasks) => [
        ...prevTasks,
        {
          id: prevTasks.length + 2, // Generate a new task ID
          title: formData.title,
          description: formData.description,
          project_id: formData.project_id,
          priority: formData.priority,
          status: formData.status, // Default status
          progress: 0, // Default progress value
          user_id: 1, // Example, assuming you have a static user_id or get it dynamically
          start_Date: new Date(), // Default to the current date
          end_Date: formData.end_Date, // From the form data
        }
      ]);
    }
  }

  const onTaskDelete = (task_id: number) => {
    setLoadingContentOpen(true);
    deleteTaskMutate(task_id);
  }
  
  return (
    <div className="max-w-4xl min-h-screen mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center rounded-md p4 bg-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 ml-2">Tasks List</h1>
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
        onSubmit={OnCreateTaskSubmitRQMode}
        onSuccess={onCreateTaskSuccess}
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
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskListRow key={task.id} task={task} onDelete={onTaskDelete}/>
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

      <div className="flex justify-end p4 bg-gray-200 rounded-md">
        <BasicButton
          buttonText="Create New Task"
          buttonColor="green-500"
          textColor="white"
          onClick={openCreateTaskForm}
          customStyle="pt-2 mt-1 mr-2 mb-1"
        />
      </div>
    </div>
  );
};

export default TasksListPage;
