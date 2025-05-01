import UserTable from '@/components/users/UserTable';

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserTable />
    </div>
  );
}