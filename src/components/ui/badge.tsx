import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold",
  "transition-all duration-300 ease-out whitespace-nowrap",
  "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2",
  "hover:scale-[1.06] active:scale-[0.96]",
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/85 hover:shadow-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85 hover:shadow-md",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/85 hover:shadow-md",
        outline:
          "border-border/50 text-foreground bg-transparent hover:bg-muted hover:border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        "before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "hover:before:opacity-100",
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
