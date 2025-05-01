import { formatISO, format, parseISO } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'yyyy-MM-dd');
};

export const formatDateForDisplay = (date: string | Date): string => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMMM dd, yyyy');
};

export const formatDateForInput = (date: string | Date): string => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'yyyy-MM-dd');
};