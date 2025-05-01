import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  userName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  userName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete User"
      footer={
        <>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            className="ml-3"
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </>
      }
    >
      <p className="text-gray-500">
        Are you sure you want to delete <span className="font-medium">{userName}</span>? This action cannot be undone.
      </p>
    </Modal>
  );
};

export default DeleteConfirmationModal;