import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { User, UserFormData } from '@/types';
import { createUser, updateUser } from '@/lib/api';
import { formatDateForInput } from '@/lib/utils';

interface UserFormProps {
  user?: User;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  isEditing = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: isEditing
      ? Yup.string().min(6, 'Password must be at least 6 characters')
      : Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const initialValues: UserFormData = {
    fullName: user?.fullName || '',
    dateOfBirth: user ? formatDateForInput(user.dateOfBirth) : '',
    email: user?.email || '',
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null);

        if (isEditing && user) {
          await updateUser(user.id, values);
        } else {
          await createUser(values);
        }

        router.push('/users');
        router.refresh();
      } catch (err: any) {
        setError(
          err.response?.data?.message || 
          'An error occurred. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 mb-4">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        id="fullName"
        name="fullName"
        value={formik.values.fullName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.fullName ? formik.errors.fullName || undefined : undefined}
      />

      <Input
        label="Date of Birth"
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
        value={formik.values.dateOfBirth}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.dateOfBirth ? formik.errors.dateOfBirth || undefined : undefined}
      />

      <Input
        label="Email"
        type="email"
        id="email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email ? formik.errors.email || undefined : undefined}
      />

      <Input
        label={isEditing ? "Password (leave blank to keep current)" : "Password"}
        type="password"
        id="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password ? formik.errors.password || undefined : undefined}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/users')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;