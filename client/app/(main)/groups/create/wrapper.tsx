"use client";
import React from "react";
import GroupCreateForm from "./group-form";
import GroupPreview from "./group-preview";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateGroupMutation } from "@/redux/features/group/groupApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const createGroupSchema = z.object({
  name: z.string({ error: "Name is required" }).min(1, "Name is required"),
  privacy: z.enum(["PUBLIC", "PRIVATE"], { error: "Privacy is required" }),
  autoInvite: z.boolean({ error: "Auto invite is required" }),
});

const Wrapper = () => {
  const form = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      autoInvite: true,
    },
  });

  const router = useRouter();

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const handleCreateGroup = async (data: z.infer<typeof createGroupSchema>) => {
    try {
      const res = await createGroup({
        input: { name: data.name, privacy: data.privacy },
      }).unwrap();
      if (res?.data?.id) {
        router.push(`/groups/${res?.data?.id}`);
      }
    } catch (error) {
      toast.error("Failed to create group");
    }
  };
  return (
    <div className="h-full min-h-full w-full flex justify-center items-center">
      <section className="md:w-[360px] w-full h-full min-h-full">
        <GroupCreateForm
          form={form}
          handleCreateGroup={handleCreateGroup}
          isLoading={isLoading}
        />
      </section>
      <div className="md:w-[calc(100vw_-_360px)] md:min-w-[calc(100vw_-_360px)] h-full bg-shade/70 md:block hidden ">
        <GroupPreview
          name={form.watch("name")}
          privacy={form.watch("privacy")}
        />
      </div>
    </div>
  );
};

export default Wrapper;
