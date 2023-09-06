import { type ComponentPropsWithRef } from "react";
import { Input, InputAddon, InputWrapper } from "./ui/Form";
import { NumericFormat } from "react-number-format";
import { useFormContext, Controller } from "react-hook-form";

export const AllocationInput = ({
  name,
  onBlur,
  ...props
}: {
  disabled?: boolean;
  error?: boolean;
} & ComponentPropsWithRef<"input">) => {
  const form = useFormContext();

  return (
    <InputWrapper className="min-w-[160px]">
      <Controller
        control={form.control}
        name={name!}
        render={({ field: { ref, ...field } }) => (
          <NumericFormat
            customInput={Input}
            error={props.error}
            {...field}
            disabled={props.disabled}
            defaultValue={props.defaultValue as string}
            onChange={(v) =>
              // Parse decimal string to number to adhere to AllocationSchema
              field.onChange(parseFloat(v.target.value.replace(/,/g, "")))
            }
            onBlur={onBlur}
            thousandSeparator=","
          />
        )}
      />
      <InputAddon disabled={props.disabled}>OP</InputAddon>
    </InputWrapper>
  );
};
