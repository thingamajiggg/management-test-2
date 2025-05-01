'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserForm from '@/components/users/UserForm';
import { getUserById } from '@/lib/api';
import { User } from '@/types';
import Spinner from '@/components/ui/Spinner';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = Number(params.id);
        if (isNaN(id)) {
          setError('Invalid user ID');
          setLoading(false);
          return;
        }

        const userData = await getUserById(id);
        setUser(userData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching user data');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button
          className="underline mt-2"
          onClick={() => router.push('/users')}
        >
          Back to Users
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>User not found</p>
        <button
          className="underline mt-2"
          onClick={() => router.push('/users')}
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <UserForm user={user} isEditing={true} />
      </div>
    </div>
  );
}