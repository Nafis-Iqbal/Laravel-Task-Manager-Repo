import {lazy} from "react";
import { RouteObject } from "react-router-dom";

import LoginPage from "../Pages/LoginPage";
import ProfilePage from "../Pages/ProfilePage";
import TasksListPage from "../Pages/TasksListPage";
import ProjectsListPage from "../Pages/ProjectsListPage";

const DashboardPage = lazy(() => import("../Pages/DashboardPage"));
const TaskDetailsPage = lazy(() => import("../Pages/TaskDetailsPage"));
const ProjectDetailsPage = lazy(() => import("../Pages/ProjectDetailsPage")) ;
const ContentFilterPage = lazy(() => import("../Pages/ContentFilterPage")) ;
const SettingsPage = lazy(() => import("../Pages/SettingsPage")) ;
const AdminPage = lazy(() => import("../Pages/AdminPage")) ;

const appRoutes: RouteObject[] = [
    {
        path: "/",
        element: <LoginPage/>
    },
    {
        path: "/dashboard",
        element: <DashboardPage/>,
    },
    {
        path: "/profile",
        element: <ProfilePage/>
    },
    {
        path: "/tasks",
        element: <TasksListPage/>
    },
    {
        path: "/tasks/:taskId",
        element: <TaskDetailsPage/>,
    },
    {
        path: "/projects",
        element: <ProjectsListPage/>
    },
    {
        path: "/projects/:projectId",
        element: <ProjectDetailsPage/>,
    },
    {
        path: "/contentFilter",
        element: <ContentFilterPage/>,
    },
    {
        path: "/settings",
        element: <SettingsPage/>,
    },
    {
        path: "/admin",
        element: <AdminPage/>,
    }
];

export default appRoutes;