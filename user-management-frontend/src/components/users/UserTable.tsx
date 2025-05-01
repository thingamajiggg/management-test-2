'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { getUsers, deleteUser } from '@/lib/api';
import { User, TableState, ApiResponse } from '@/types';
import { formatDateForDisplay } from '@/lib/utils';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const columnHelper = createColumnHelper<User>();

const UserTable: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<User[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [tableState, setTableState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    search: '',
    sortBy: undefined,
    sortOrder: undefined,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('fullName', {
      header: 'Full Name',
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('dateOfBirth', {
      header: 'Date of Birth',
      cell: (info) => formatDateForDisplay(info.getValue()),
      enableSorting: true,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('createdDate', {
      header: 'Created Date',
      cell: (info) => formatDateForDisplay(info.getValue()),
      enableSorting: true,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const user = info.row.original;
        return (
          <div className="flex space-x-2">
            <Link href={`/users/edit/${user.id}`}>
              <Button variant="secondary" className="py-1 px-2 text-sm">
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              className="py-1 px-2 text-sm"
              onClick={() => handleOpenDeleteModal(user)}
            >
              Delete
            </Button>
          </div>
        );
      },
    }),
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers(tableState);
      setData(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [tableState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (columnId: string) => {
    setTableState((prev) => {
      if (prev.sortBy === columnId) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
        };
      }
      return {
        ...prev,
        sortBy: columnId,
        sortOrder: 'ASC',
      };
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableState((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1, // Reset to first page when searching
    }));
  };

  const handlePageChange = (newPage: number) => {
    setTableState((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      // Refetch data after deletion
      fetchData();
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: meta.totalPages,
  });

  const renderSortingIndicator = (columnId: string) => {
    if (tableState.sortBy !== columnId) return null;
    return tableState.sortOrder === 'ASC' ? ' 🔼' : ' 🔽';
  };

  const renderPagination = () => {
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {meta.page > 0 ? (meta.page - 1) * meta.pageSize + 1 : 0} to{' '}
          {Math.min(meta.page * meta.pageSize, meta.totalItems)} of {meta.totalItems} entries
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page <= 1}
          >
            Previous
          </Button>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === meta.page ? 'primary' : 'secondary'}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="secondary"
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page >= meta.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="w-64">
          <input
            type="text"
            className="input"
            placeholder="Search by name..."
            value={tableState.search}
            onChange={handleSearch}
          />
        </div>
        <Link href="/users/create">
          <Button variant="primary">Add New User</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {table.getAllColumns().map((column) => {
                    const canSort = column.columnDef.enableSorting;
                    return (
                      <th
                        key={column.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        onClick={() => canSort && handleSort(column.id)}
                        style={{ cursor: canSort ? 'pointer' : 'default' }}
                      >
                        {flexRender(
                          column.columnDef.header,
                          { column, header: column, table } as any
                        )}
                        {canSort && renderSortingIndicator(column.id)}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      )}

      <DeleteConfirmationModal
        isOpen={!!userToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteUser}
        isLoading={isDeleting}
        userName={userToDelete?.fullName || ''}
      />
    </div>
  );
};

export default UserTable;