"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import type { DayPickerProps } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = DayPickerProps & {
  className?: string
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-white/50 rounded-md w-10 font-normal text-[0.8rem] flex-1",
        row: "flex w-full mt-2 justify-between",
        cell: "text-center text-sm p-0 relative flex-1 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 mx-auto font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-white/10 text-white hover:bg-white/20 hover:text-white focus:bg-white/20 focus:text-white",
        day_today: "bg-white/5 text-white",
        day_outside: "text-white/30 opacity-50",
        day_disabled: "text-white/30 opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
