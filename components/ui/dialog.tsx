"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay
    className={cn("fixed inset-0 z-50 bg-plum/40 backdrop-blur-sm", className)}
    {...props}
  />
);

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** "sheet" slides up from the bottom on mobile. */
  variant?: "center" | "sheet";
}

const DialogContent = ({
  className,
  children,
  variant = "center",
  ...props
}: DialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed z-50 w-full bg-cream p-6 shadow-lift focus:outline-none",
        variant === "center"
          ? "left-1/2 top-1/2 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border-soft w-[calc(100%-2rem)]"
          : "inset-x-0 bottom-0 rounded-t-3xl border-t border-border-soft pb-safe sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className="absolute right-4 top-4 rounded-full p-2 text-muted-strong transition-colors hover:bg-rose-light hover:text-plum focus-visible:outline-2 focus-visible:outline-rose-deep"
        aria-label="Close"
      >
        <X className="size-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

const DialogTitle = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn("font-display text-xl font-semibold text-plum", className)}
    {...props}
  />
);

const DialogDescription = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("mt-1.5 text-sm text-muted-strong", className)}
    {...props}
  />
);

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
