"use client";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

// ----------------- Types -----------------

// Base props (common for all input types)
interface BaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  inputclassname?: string;
  disabled?: boolean;
  id?: string;
}

// Number-specific props (only if type is "number")
interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "number";
  step?: number | "any";
  min?: number;
  max?: number;
}

// Props for all other input types
interface OtherInputProps {
  type?: "text" | "email" | "password" | "tel" | "url";
}

// Combine with union
type RHFInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = BaseProps<TFieldValues, TName> & (NumberInputProps | OtherInputProps);

// ----------------- Component -----------------
export function RHFInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder,
  className,
  disabled,
  type = "text",
  ...rest // capture extra props (step, min, max, etc.)
}: RHFInputProps<TFieldValues, TName>) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("relative", className)}>
          {label && <FormLabel htmlFor={rest.id || name}>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Input
                type={
                  type === "password" ? (isVisible ? "text" : "password") : type
                }
                placeholder={placeholder}
                disabled={disabled}
                id={rest.id || name}
                className={cn("autofill:bg-transparent", rest.inputclassname)}
                {...field}
                {...rest}
              />
              {type === "password" && (
                <button
                  className={`text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 `}
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls="password"
                >
                  {isVisible ? (
                    <EyeOffIcon size={16} aria-hidden="true" />
                  ) : (
                    <EyeIcon size={16} aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
