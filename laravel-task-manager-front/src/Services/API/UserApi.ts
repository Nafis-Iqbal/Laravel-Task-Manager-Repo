import api from './ApiInstance';
import { AxiosResponse } from 'axios';

export const fetchUsers = async (): Promise<AxiosResponse> => {
    try{
        const response = await api.get<ApiResponse<User[]>>("users");
        return response;
    }
    catch(error)
    {
        console.log('Error fetching users');
        throw error;
    }
};

export const fetchUser = async (id: number): Promise<AxiosResponse> => {
    try{
        const params = new URLSearchParams({id: id.toString()})
        const response = await api.get<ApiResponse<User>>(`users?${params.toString()}`);
        
        return response;
    }
    catch(error)
    {
        console.log("Error fetching user data");
        throw error;
    }
}

export const createUser = async (name: string, email: string, password: string, password_confirmation: string): Promise<AxiosResponse> => {
    try{
        const response = await api.post<ApiResponse<Auth>>("users/create", {
            name, email, password, password_confirmation
        });

        return response;
    }
    catch(error)
    {
        console.log("Error creating new user");
        throw error;
    }
}

export const loginUser = async (email: string, password: string): Promise<AxiosResponse> => {
    try{
        const response = await api.post<ApiResponse<Auth>>("login", {
            email, password
        });
        console.log(response.data);
        return response;
    }
    catch(error)
    {
        console.log("Error logging in.");
        throw error;
    }
}