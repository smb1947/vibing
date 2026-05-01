import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-black transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--guide)_22%,transparent)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--guide)_92%,black),var(--guide)_58%,color-mix(in_srgb,var(--theme-accent)_72%,var(--guide)))] text-white shadow-[0_14px_28px_color-mix(in_srgb,var(--guide)_24%,transparent)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_color-mix(in_srgb,var(--guide)_28%,transparent)]",
        secondary:
          "border border-[color-mix(in_srgb,var(--guide)_18%,var(--line))] bg-[color-mix(in_srgb,var(--theme-bg)_35%,white)] text-[var(--theme-ink)] hover:-translate-y-0.5",
        ghost: "text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--guide)_10%,white)] hover:text-[var(--guide)]",
        destructive: "border border-[color-mix(in_srgb,var(--red)_28%,var(--line))] bg-white text-[var(--red)] hover:bg-red-50"
      },
      size: {
        default: "min-h-12 px-4 py-2",
        sm: "min-h-9 rounded-xl px-3",
        icon: "size-11 rounded-2xl p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});

Button.displayName = "Button";

export { Button, buttonVariants };
