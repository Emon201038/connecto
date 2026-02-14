"use client";
import ManagementTable from "@/components/shared/ManagementTable";
import { IUser } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { userColumns } from "./UserColumn";
import UserDialog from "./UserDialog";

const UsersTable = ({ users }: { users: IUser[] }) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);
  const [viewingUser, setViewingUser] = useState<IUser | null>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (user: IUser) => {
    setViewingUser(user);
  };

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
  };

  const handleDelete = (user: IUser) => {
    setDeletingUser(user);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);
    // const result = await deleteGuide(deletingGuide._id!);
    // setIsDeleting(false);

    // if (result.success) {
    //   toast.success(result.message || "Doctor deleted successfully");
    //   setDeletingGuide(null);
    //   handleRefresh();
    // } else {
    //   toast.error(result.message || "Failed to delete doctor");
    // }
  };
  return (
    <>
      <ManagementTable
        data={users}
        columns={userColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(user) => user.id}
        emptyMessage="No users found"
      />
      <UserDialog
        user={editingUser || undefined}
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default UsersTable;
