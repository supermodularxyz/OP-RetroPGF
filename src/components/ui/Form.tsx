import {
  cloneElement,
  type ReactElement,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
} from "react";
import {
  type SubmitHandler,
  type UseFormProps,
  type Resolver,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tv } from "tailwind-variants";
import clsx from "clsx";
import { type z } from "zod";

import { createComponent } from ".";

const inputBase =
  "border bg-white text-gray-900 rounded focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2 disabled:opacity-50";
const input = tv({
  base: inputBase,
});

const textarea = tv({
  base: inputBase,
});

const label = tv({
  base: "pb-1 block",
});

const select = tv({
  base: inputBase,
  // base: "text-gray-900 w-full bg-white text-sm rounded focus:ring-secondary-500 focus:border-secondary-500 block p-2",
});

export const Input = createComponent("input", input);
export const Textarea = createComponent("textarea", textarea);
export const Label = createComponent("label", label);
export const Select = createComponent("select", select);

export const FormControl = ({
  name,
  label,
  hint,
  required,
  children,
  className,
}: {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
} & ComponentPropsWithoutRef<"fieldset">) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  return (
    <fieldset className={clsx("mb-2 w-full", className)}>
      {label ? (
        <Label htmlFor={name}>
          {label}
          {required ? <span className="text-red-300">*</span> : ""}
        </Label>
      ) : null}
      {cloneElement(children as ReactElement, {
        id: name,
        required,
        ...register(name),
      })}
      {hint ? <div className="pt-1 text-xs text-gray-500">{hint}</div> : null}
      {error ? (
        <div className="pt-1 text-xs text-red-500">
          {error.message as string}
        </div>
      ) : null}
    </fieldset>
  );
};

export interface FormProps<S extends z.Schema> extends PropsWithChildren {
  defaultValues?: UseFormProps<z.infer<S>>["defaultValues"];
  schema: S;
  onSubmit: SubmitHandler<z.TypeOf<S>>;
  // onSubmit: (values: z.infer<S>) => Promise<unknown>;
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
  });
  // Pass the form methods to a FormProvider. This lets us access the form from components without passing props.
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
