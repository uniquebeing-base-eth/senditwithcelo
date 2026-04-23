import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 rounded-xl border border-border/40 bg-background/70 backdrop-blur-sm shadow-sm",
        className
      )}
      classNames={{
        months:
          "flex flex-col sm:flex-row gap-5 sm:gap-7",
        month: "space-y-5",
        caption:
          "flex justify-center pt-2 relative items-center",
        caption_label:
          "text-sm font-semibold tracking-tight",
        nav: "flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-70",
          "transition-all duration-200 ease-out",
          "hover:opacity-100 hover:scale-110 hover:bg-muted/60"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-10 font-medium text-[0.75rem]",
        row: "flex w-full mt-2.5",
        cell:
          "h-10 w-10 text-center text-sm p-0 relative transition-all",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal rounded-md",
          "transition-all duration-200 ease-out",
          "hover:bg-muted/60 hover:scale-110",
          "aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary shadow-md",
        day_today:
          "bg-accent text-accent-foreground font-semibold ring-1 ring-accent/40",
        day_outside:
          "text-muted-foreground/40 aria-selected:bg-accent/40 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-40",
        day_range_middle:
          "aria-selected:bg-accent/80 aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <ChevronLeft className="h-4 w-4 transition-all duration-200 group-hover:-translate-x-1 group-hover:scale-110" />
        ),
        IconRight: () => (
          <ChevronRight className="h-4 w-4 transition-all duration-200 group-hover:translate-x-1 group-hover:scale-110" />
        ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
