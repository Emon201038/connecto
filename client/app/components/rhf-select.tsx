import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

interface SelectOption {
  value: string;
  label: string;
  id?: string;
}

interface RHFSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  options: SelectOption[];
  onChange?: (value: SelectOption) => void;
  allowSearch?: boolean;
}

export function RHFSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  placeholder,
  className,
  disabled,
  options,
  onChange,
  allowSearch = false,
}: RHFSelectProps<TFieldValues, TName>) {
  const [optionValues, setOptionValues] = useState<SelectOption[]>(options);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setOptionValues(options);
  }, [options]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={(e) => {
              field.onChange(e);
              const selectedValue = options.find(
                (option) => option.value === e
              );
              onChange?.(selectedValue!);
            }}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={placeholder}
                  className="overflow-ellipsis"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
              {allowSearch && (
                <div>
                  <Input
                    autoFocus
                    type="search"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setOptionValues(
                        options.filter((option) =>
                          option.label
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase())
                        )
                      );
                    }}
                  />
                </div>
              )}
              {optionValues.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
