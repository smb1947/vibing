import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black", {
  variants: {
    variant: {
      default: "bg-[color-mix(in_srgb,var(--guide)_12%,white)] text-[var(--guide)]",
      outline: "border border-[color-mix(in_srgb,var(--guide)_18%,var(--line))] bg-white text-[var(--theme-ink)]",
      success: "bg-emerald-50 text-emerald-700",
      miss: "bg-rose-50 text-rose-700"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
