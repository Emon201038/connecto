"use client";
import { RHFDate } from "@/components/rhf-date";
import { RHFInput } from "@/components/rhf-input";
import { RHFRadio } from "@/components/rhf-radio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/redux/features/user/userApi";
import { IUser, UserRole } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { id } from "date-fns/locale";
import { AlertCircleIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props {
  user?: IUser;
  onSuccess?: () => void;
  onClose?: () => void;
  isSignUp: boolean;
}
const baseSchema = {
  firstName: z
    .string({ error: "First name is required" })
    .min(1, "First name is required"),
  lastName: z
    .string({ error: "Last name is required" })
    .min(1, "Last name is required"),
  phone: z
    .string({ error: "Phone number is required" })
    .min(1, "Phone number is required"),
  dateOfBirth: z.date({ error: "Date of birth is required" }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { error: "Gender is required" }),
  bio: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
};

const signupSchema = z.object({
  ...baseSchema,
  email: z.string({ error: "Email is required" }).min(1, "Email is required"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

const updateSchema = z.object({
  ...baseSchema,
  id: z
    .string({ error: "User id is required" })
    .regex(/^[a-fA-F0-9]{24}$/, "Invalide Id"),
});

type SignupValues = z.infer<typeof signupSchema>;
type UpdateValues = z.infer<typeof updateSchema>;

type FormValues = SignupValues | UpdateValues;

const UserForm: React.FC<Props> = ({ user, onSuccess, onClose, isSignUp }) => {
  const isEdit = !!user;
  const schema = isEdit ? updateSchema : signupSchema;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth
        ? new Date(parseInt(user.dateOfBirth))
        : new Date(),
      gender: user?.gender || "MALE",
      password: "",
      role: user?.role || UserRole.USER,
      id: user?.id,
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback");
  const [error, setError] = React.useState<string | null>(null);
  const [register, { isLoading: isRegisterLoading }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdateLoading }] = useUpdateUserMutation();

  const handleSubmit = async (data: FormValues) => {
    try {
      const res = isEdit
        ? await updateUser(data as UpdateValues).unwrap()
        : await register(data as SignupValues).unwrap();

      toast.success(isEdit ? "User updated successfully" : "Account created");
      console.log(res);

      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.log(error);
      toast.error(isEdit ? "Failed to update user" : "Failed to sign up");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <RHFInput
            control={form.control}
            name={"firstName"}
            label="First name"
            placeholder="First name"
          />
          <RHFInput
            control={form.control}
            name={"lastName"}
            label="Last name"
            placeholder="Last name"
          />
        </div>
        <RHFInput
          control={form.control}
          name={"email"}
          label="Email"
          placeholder="Enter your email number"
          type="email"
          disabled={isEdit}
        />
        {!isEdit && (
          <RHFInput
            control={form.control}
            name={"password"}
            label="New Password"
            placeholder="Enter your password number"
            type="password"
          />
        )}
        <div className="grid grid-cols-2 gap-4">
          <RHFDate
            control={form.control}
            name={"dateOfBirth"}
            placeholder="Date of birth"
            label="Date of birth"
          />
          <RHFInput
            control={form.control}
            name={"phone"}
            label="Phone"
            placeholder="Enter your phone number"
          />
        </div>

        <RHFRadio
          control={form.control}
          name={"gender"}
          label="Gender"
          options={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
          ]}
          containerClassName="grid grid-cols-3 gap-3 justify-center items-center w-full"
          itemClassName="w-full border rounded p-2"
        />

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isRegisterLoading}
        >
          {isRegisterLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default UserForm;
