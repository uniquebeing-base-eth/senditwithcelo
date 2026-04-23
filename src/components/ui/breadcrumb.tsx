import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="breadcrumb"
    className={cn("w-full", className)}
    {...props}
  />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-2 sm:gap-3",
      "text-sm text-muted-foreground",
      "break-words",
      "group",
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "inline-flex items-center gap-2",
      "transition-all duration-200",
      className
    )}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn(
        "relative transition-all duration-200 ease-out",
        "hover:text-foreground",
        "after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-foreground after:transition-all after:duration-300",
        "hover:after:w-full",
        "hover:tracking-tight",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm",
        className
      )}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn(
      "font-semibold text-foreground",
      "tracking-tight",
      "relative",
      "after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:bg-primary/60 after:rounded-full",
      className
    )}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(
      "text-muted-foreground/60 transition-all duration-200",
      "[&>svg]:size-3.5 [&>svg]:transition-all",
      "group-hover:[&>svg]:scale-110 group-hover:[&>svg]:text-foreground",
      className
    )}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "Breadcrumb
