import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode, PropsWithChildren, ComponentProps } from "react";
import { Button } from "./Button";

export const Dialog = ({
  title,
  isOpen,
  children,
  onOpenChange,
}: {
  title?: string | ReactNode;
  isOpen?: boolean;
  onOpenChange?: ComponentProps<typeof RadixDialog.Root>["onOpenChange"];
} & PropsWithChildren) => (
  <RadixDialog.Root open={isOpen} onOpenChange={onOpenChange}>
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed left-0 top-0 h-full w-full bg-black/70" />
      <RadixDialog.Content className="fixed bottom-0 rounded-t-2xl bg-white px-7 py-6 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[456px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl md:w-[800px]">
        <RadixDialog.Title className="mb-6 text-2xl font-bold">
          {title}
        </RadixDialog.Title>
        {children}
        <RadixDialog.Close asChild>
          <Button variant="ghost" className="absolute right-4 top-4">
            &times;
          </Button>
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);
