"use client";
import { LucideIcon, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface ManagementPageHeaderProps {
  title: string;
  description?: string;
  actions?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

const ManagementPageHeader = ({
  title,
  actions,
  children,
  description,
}: ManagementPageHeaderProps) => {
  const Icon = actions?.icon || Plus;
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <Button onClick={actions.onClick}>
          <Icon className="mr-2 size-4" /> {actions.label}
        </Button>
      )}
      {children}
    </div>
  );
};

export default ManagementPageHeader;
