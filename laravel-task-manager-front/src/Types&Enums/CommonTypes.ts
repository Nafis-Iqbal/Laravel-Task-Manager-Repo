import {priority, statusEnum, role} from "../Types&Enums/Enums";

declare global{
    interface User{
        id: number;
        name: string;
        email: string;
        role: role;
    }
    
    interface Project{
        id: number;
        title: string;
        description: string;
        progress: number;
        user_id: number;
        status: statusEnum;
        start_Date?: Date;
        end_Date: Date;
    }

    interface Task{
        id: number;
        title: string;
        description: string;
        progress: number;
        user_id: number;
        project_id: number;
        priority: priority;
        status: statusEnum;
        start_Date?: Date;
        end_Date: Date;
    }

    interface Tag{
        id: number;
        title: string;
    }

    export interface Comments{
        id: number;
        comment: string;
    }

    interface ApiResponse<T>{
        status: string;
        message: string;
        data: T;
    }

    interface Auth{
        auth_token: string;
        user_id: number; 
    }
}
