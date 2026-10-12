import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-2xl border border-border-soft bg-white px-4 text-base text-plum placeholder:text-muted-strong/70 transition-colors focus-visible:border-blush focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-rose-deep/60 disabled:opacity-50 sm:text-sm",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-28 w-full resize-y rounded-2xl border border-border-soft bg-white px-4 py-3 text-base leading-relaxed text-plum placeholder:text-muted-strong/70 transition-colors focus-visible:border-blush focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-rose-deep/60 disabled:opacity-50 sm:text-sm",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Input, Textarea };
