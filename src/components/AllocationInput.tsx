import { type ComponentPropsWithRef, forwardRef } from "react";
import { Input, InputAddon, InputWrapper } from "./ui/Form";
import { NumericFormat } from "react-number-format";
import { useFormContext, Controller } from "react-hook-form";

export const AllocationInput = ({
  name,
  onBlur,
  disabled,
  ...props
}: { disabled?: boolean } & ComponentPropsWithRef<typeof Input>) => {
  const form = useFormContext();

  return (
    <InputWrapper className="min-w-[160px]">
      <Controller
        control={form.control}
        name={name}
        render={({ field: { ref, ...field } }) => (
          <NumericFormat
            customInput={Input}
            {...field}
            disabled={disabled}
            defaultValue={props.defaultValue}
            onChange={(v) =>
              // Parse decimal string to number to adhere to AllocationSchema
              field.onChange(parseFloat(v.target.value.replace(/,/g, "")))
            }
            onBlur={onBlur}
            thousandSeparator=","
          />
        )}
      />
      <InputAddon disabled={disabled}>OP</InputAddon>
    </InputWrapper>
  );
};
