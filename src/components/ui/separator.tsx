
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";


import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border/70", // softer color
      "transition-colors duration-200",
      orientation === "horizontal"
        ? "h-[1px] w-full my-2" // better spacing rhythm
        : "h-full w-[1px] mx-2",
      className
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
