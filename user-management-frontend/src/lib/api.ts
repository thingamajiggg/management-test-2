import axios from 'axios';
import { User, ApiResponse, UserFormData, TableState } from '@/types';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getUsers = async (tableState: TableState): Promise<ApiResponse<User>> => {
  const { page, pageSize, search, sortBy, sortOrder } = tableState;
  
  const response = await api.get<ApiResponse<User>>('/users', {
    params: {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
    },
  });
  
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: UserFormData): Promise<User> => {
  const response = await api.post<User>('/users', userData);
  return response.data;
};

export const updateUser = async (id: number, userData: Partial<UserFormData>): Promise<User> => {
  const response = await api.patch<User>(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};