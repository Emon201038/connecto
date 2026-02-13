"use client";
import { RHFInput } from "@/components/rhf-input";
import { RHFSelect } from "@/components/rhf-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { createGroupSchema } from "./wrapper";

interface Props {
  form: UseFormReturn<
    {
      name: string;
      privacy: "PUBLIC" | "PRIVATE";
      autoInvite: boolean;
    },
    any,
    {
      name: string;
      privacy: "PUBLIC" | "PRIVATE";
      autoInvite: boolean;
    }
  >;
  handleCreateGroup: (data: z.infer<typeof createGroupSchema>) => Promise<void>;
  isLoading: boolean;
}

const GroupCreateForm = ({ form, handleCreateGroup, isLoading }: Props) => {
  return (
    <div className="w-full h-full p-4 relative bg-normal">
      <h1 className="text-[24px] text-muted-foreground font-bold mb-6">
        Create Group
      </h1>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleCreateGroup)}
        >
          <RHFInput
            control={form.control}
            name={"name"}
            label="Group Name"
            placeholder="Enter group name"
          />
          <RHFSelect
            control={form.control}
            name={"privacy"}
            label="Privacy"
            options={[
              { label: "Public", value: "PUBLIC" },
              { label: "Private", value: "PRIVATE" },
            ]}
            placeholder="Choose a privacy"
          />

          <div className="absolute bottom-0 left-0 shadow-muted-foreground shadow-2xl p-4 w-full">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-bold"
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GroupCreateForm;
