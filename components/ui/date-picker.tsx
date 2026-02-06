"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date
  setDate: (date: Date) => void
  className?: string
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(date)

  React.useEffect(() => {
    setSelectedDate(date)
  }, [date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-8 justify-start text-left text-sm font-normal",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
          {format(date, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(newDate) => {
            if (!newDate) return
            setSelectedDate(newDate)
            setDate(newDate)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
