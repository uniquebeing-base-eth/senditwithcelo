import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "group border-b border-border/50 last:border-b-0",
      "transition-all duration-300 ease-out",
      "hover:border-border hover:bg-muted/40",
      "rounded-lg px-3",
      "data-[state=open]:bg-muted/50 data-[state=open]:shadow-sm",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-center justify-between",
        "py-4 px-2 text-sm font-medium tracking-tight",
        "transition-all duration-300 ease-out",
        "hover:text-primary hover:pl-1",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md",
        "data-[state=open]:text-primary",
        className
      )}
      {...props}
    >
      <span className="transition-all duration-200 group-hover:text-primary/90">
        {children}
      </span>

      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0",
          "transition-all duration-300 ease-in-out",
          "group-hover:scale-110 group-hover:text-primary",
          "data-[state=open]:rotate-180 data-[state=open]:text-primary",
          "will-change-transform"
        )}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm text-muted-foreground",
      "transition-all duration-300 ease-in-out",
      "data-[state=closed]:animate-accordion-up",
      "data-[state=open]:animate-accordion-down"
    )}
    {...props}
  >
    <div
      className={cn(
        "pb-5 pt-2 px-2 leading-relaxed",
        "opacity-90",
        "transition-all duration-300",
        "data-[state=open]:opacity-100 data-[state=open]:translate-y-0",
        "data-[state=closed]:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
