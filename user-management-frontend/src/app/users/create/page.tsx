'use client';

import UserForm from '@/components/users/UserForm';

export default function CreateUserPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New User</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <UserForm />
      </div>
    </div>
  );
}
