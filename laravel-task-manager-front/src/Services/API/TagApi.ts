import api from './ApiInstance';
import { AxiosResponse } from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';

export const getTags = async (): Promise<AxiosResponse> => {
    try{
        const response = await api.get<ApiResponse<Tag[]>>("tags");

        return response;
    }
    catch(error)
    {
        console.log("Error fetching tags.");
        throw error;
    }
}

export const useGetTagsRQ = (onSuccessFn: () => void) => {
    return useQuery({
        queryKey: ["tags"],
        queryFn: getTags,
        cacheTime: 60 * 1000,
        staleTime: 60 * 1000,
        onSuccess: () => {
            onSuccessFn();
        },
        enabled: true
    });
}