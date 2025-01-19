import axios from 'axios';

const API_URL = 'http://localhost:5275/api/users';

export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

interface User {
    id?: number;
    name: string;
    email: string;
    // Add other user properties here
}

export const addUser = async (user: User): Promise<User> => {
    try {
        const response = await axios.post<User>(API_URL, user);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};
