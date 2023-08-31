import { type z } from "zod";
import { tv } from "tailwind-variants";
import {
  type ComponentPropsWithRef,
  type PropsWithChildren,
  type ComponentPropsWithoutRef,
  type ReactElement,
  forwardRef,
  cloneElement,
} from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type UseFormProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createComponent } from ".";
import { Search } from "../icons";

export const Input = createComponent(
  "input",
  tv({
    base: [
      "flex",
      "h-12",
      "w-full",
      "rounded-xl",
      "border",
      "border-gray-300",
      "bg-background",
      "px-3",
      "py-2",
      "text-gray-900",
      "ring-offset-background",
      "file:border-0",
      "placeholder:text-muted",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-ring",
      "focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed",
      "disabled:bg-gray-200",
      "disabled:opacity-50",
    ],
    variants: {
      error: {
        true: "ring-primary-500",
      },
    },
  })
);
export const InputWrapper = createComponent(
  "div",
  tv({
    base: "flex w-full relative",
    variants: {},
  })
);
export const InputAddon = createComponent(
  "div",
  tv({
    base: "absolute right-0 text-gray-900 inline-flex items-center justify-center h-full border-gray-300 border-l px-4 font-semibold",
    variants: {
      disabled: {
        true: "text-gray-500",
      },
    },
  })
);

export const InputIcon = createComponent(
  "div",
  tv({
    base: "absolute text-gray-600 left-0 inline-flex items-center justify-center h-full px-4",
  })
);

export const SearchInput = forwardRef(function SearchInput(
  { ...props }: ComponentPropsWithRef<typeof Input>,
  ref
) {
  return (
    <InputWrapper className="">
      <InputIcon>
        <Search />
      </InputIcon>
      <Input ref={ref} {...props} className="pl-10" />
    </InputWrapper>
  );
});

export interface FormProps<S extends z.Schema> extends PropsWithChildren {
  defaultValues?: UseFormProps<z.infer<S>>["defaultValues"];
  schema: S;
  onSubmit: (values: z.infer<S>) => void;
}

export function Form<S extends z.Schema>({
  defaultValues,
  schema,
  children,
  onSubmit,
}: FormProps<S>) {
  // Initialize the form with defaultValues and schema for validation
  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema),

    mode: "onBlur",
  });
  // Pass the form methods to a FormProvider. This lets us access the form from components without passing props.
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        {children}
      </form>
    </FormProvider>
  );
}
