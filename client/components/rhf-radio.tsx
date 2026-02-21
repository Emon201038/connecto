import { Control, FieldPath, FieldValues, Form } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RHFRadioProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  options: RadioOption[];
  containerClassName?: string;
  itemClassName?: string;
  onChange?: (value: RadioOption) => void;
}

export function RHFRadio<
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
  options,
  onChange,
  containerClassName,
  itemClassName,
}: RHFRadioProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn("flex flex-col", containerClassName)}
            >
              {options.map((option) => (
                <div key={option.value}>
                  <FormItem
                    key={option.value}
                    className={cn("flex items-center gap-3", itemClassName)}
                  >
                    <FormControl>
                      <RadioGroupItem
                        value={option.value}
                        disabled={disabled || option.disabled}
                      />
                    </FormControl>
                    <FormLabel
                      className={cn("font-normal", {
                        "opacity-50": option.disabled,
                      })}
                    >
                      {option.label}
                    </FormLabel>
                  </FormItem>
                  <FormDescription className="ml-6">
                    {option.description}
                  </FormDescription>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
