import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "min-h-12 w-full rounded-2xl border border-[color-mix(in_srgb,var(--guide)_14%,var(--line))] bg-[linear-gradient(180deg,white,color-mix(in_srgb,var(--theme-bg)_18%,white))] px-3.5 py-2.5 text-[var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(29,35,32,0.04)] outline-none transition focus:border-[var(--guide)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--guide)_16%,transparent)]",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";

export { Input };
