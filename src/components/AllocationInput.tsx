import { type ComponentPropsWithRef, forwardRef } from "react";
import { Input, InputAddon, InputWrapper } from "./ui/Form";

export const AllocationInput = forwardRef(function AllocationInput(
  { ...props }: { disabled: boolean } & ComponentPropsWithRef<typeof Input>,
  ref
) {
  return (
    <InputWrapper className="min-w-[160px]">
      <Input
        ref={ref}
        min={0}
        {...props}
        type="number"
        className="pr-16 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <InputAddon disabled={props.disabled}>OP</InputAddon>
    </InputWrapper>
  );
});
