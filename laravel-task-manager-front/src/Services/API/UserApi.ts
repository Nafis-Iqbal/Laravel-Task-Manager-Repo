import api from './ApiInstance';

export const fetchUsers = async (): Promise<User[]> => {
    try{
        const response = await api.get<User[]>("users");
        return response.data;
    }
    catch(error)
    {
        console.log('Error fetching users');
        throw error;
    }
};

export const fetchUser = async (id: number): Promise<User> => {
    try{
        const params = new URLSearchParams({id: id.toString()})
        const response = await api.get<User>(`users?${params.toString()}`);
        
        return response.data;
    }
    catch(error)
    {
        console.log("Error fetching user data");
        throw error;
    }
}

export const createUser = async (name: string, email: string, password: string, password_confirmation: string): Promise<Auth> => {
    try{
        const response = await api.post<Auth>("users/create", {
            name, email, password, password_confirmation
        });

        return response.data;
    }
    catch(error)
    {
        console.log("Error creating new user");
        throw error;
    }
}

export const loginUser = async (email: string, password: string): Promise<Auth> => {
    try{
        const response = await api.post<Auth>("login", {
            email, password
        });

        return response.data;
    }
    catch(error)
    {
        console.log("Error logging in.");
        throw error;
    }
}