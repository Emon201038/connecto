"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";
import { IUser } from "@/types";
import UserForm from "./UserForm";

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: IUser;
}

const UserDialog = ({
  user,
  open,
  onClose,
  onSuccess,
}: UserFormDialogProps) => {
  const isEdit = !!user;

  useEffect(() => {
    if (!open) {
      // Use a small timeout to ensure Dialog's internal cleanup completes first
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
        document.body.style.overflow = "";
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
        <UserForm
          onSuccess={onSuccess}
          onClose={onClose}
          isSignUp={!!isEdit}
          user={user}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
