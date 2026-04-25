
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 shadow-sm transition-all duration-300 ease-out",
  " [&>svg~*]:pl-9 [&>svg+div]:translate-y-[-1px]",
  " [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg]:transition-all",
  " hover:shadow-lg hover:-translate-y-[2px]",
  " group",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground border-border/40 hover:border-border/70",
        destructive:
          "border-destructive/40 bg-destructive/10 text-destructive dark:border-destructive [&>svg]:text-destructive hover:bg-destructive/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-semibold leading-tight tracking-tight text-base",
      "transition-colors duration-200 group-hover:text-foreground",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground leading-relaxed",
      "opacity-90 transition-opacity duration-200",
      "group-hover:opacity-100",
      "[&_p]:leading-relaxed",
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
