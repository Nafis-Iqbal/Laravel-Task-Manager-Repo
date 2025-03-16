import { useQuery } from '@tanstack/react-query';
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

export const useFetchUserRQ = (user_id: number, onSuccessFn: () => void, onErrorFn: () => void) => {
    return useQuery({
        queryKey: ["user", user_id],
        queryFn: () => fetchUser(user_id),
        onSuccess: () => {
            onSuccessFn();
        },
        onError: () => {
            onErrorFn();
        },
        cacheTime: 180 * 1000,
        staleTime: 180 * 1000,
        enabled: true
    });
}

export const getAuthenticatedUser = async (numbe: number): Promise<AxiosResponse> => {
    try{
        const response = await api.get<ApiResponse<User>>("user");
        console.log(response.data.data);
        return response;
    }
    catch(error)
    {
        console.log("Error fetching authenticated user data");
        throw error;
    }
}

export const useGetAuthenticatedUserRQ = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => getAuthenticatedUser(1),
        cacheTime: 180 * 1000,
        staleTime: 180 * 1000,
        enabled: true
    });
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
        const response = await api.post("login", {
            email, password
        }, {timeout: 360 * 1000});
        
        return response;
    }
    catch(error)
    {
        console.log("Error logging in.");
        throw error;
    }
}