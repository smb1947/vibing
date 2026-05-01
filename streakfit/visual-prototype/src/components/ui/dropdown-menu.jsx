import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "../../lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[72vh] min-w-72 overflow-y-auto rounded-3xl border border-[color-mix(in_srgb,var(--guide)_18%,var(--line))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--theme-bg)_36%,white),white)] p-2.5 shadow-[var(--shadow)] data-[side=bottom]:animate-in data-[side=bottom]:slide-in-from-top-1",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-2xl px-3 py-2.5 text-sm outline-none transition hover:bg-[color-mix(in_srgb,var(--guide)_10%,white)] focus:bg-[color-mix(in_srgb,var(--guide)_10%,white)]",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
