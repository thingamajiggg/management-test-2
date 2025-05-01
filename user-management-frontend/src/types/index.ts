export interface User {
    id: number;
    fullName: string;
    dateOfBirth: string;
    email: string;
    createdDate: string;
  }
  
  export interface PaginationMeta {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }
  
  export interface ApiResponse<T> {
    data: T[];
    meta: PaginationMeta;
  }
  
  export interface UserFormData {
    fullName: string;
    dateOfBirth: string;
    email: string;
    password: string;
  }
  
  export interface SortingState {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }
  
  export interface FilterState {
    search?: string;
  }
  
  export interface TableState extends SortingState, FilterState {
    page: number;
    pageSize: number;
  }