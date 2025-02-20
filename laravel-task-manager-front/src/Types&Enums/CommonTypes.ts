import {priority, statusEnum, role} from "../Types&Enums/Enums";

declare global{
    interface User{
        user_id: number;
        name: string;
        email: string;
        role: role;
    }
    
    interface Project{
        project_id: number;
        title: string;
        description?: string;
        progress: number;
        user_id: number;
        status: statusEnum;
        start_Date?: Date;
        end_Date: Date;
    }

    interface Task{
        task_id: number;
        title: string;
        description?: string;
        progress: number;
        user_id: number;
        project_id: number;
        priority: priority;
        status: statusEnum;
        start_Date?: Date;
        end_Date: Date;
    }

    export interface Comments{
        id: number;
        text: string;
    }

    interface Auth{
        auth_token: string;
        user_id: number; 
    }
}
