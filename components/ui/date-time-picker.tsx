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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
  date: Date
  setDate: (date: Date) => void
  className?: string
}

export function DateTimePicker({ date, setDate, className }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(date)
  const [time, setTime] = React.useState<string>(
    format(date, "HH:mm")
  )

  React.useEffect(() => {
    setSelectedDate(date)
    setTime(format(date, "HH:mm"))
  }, [date])

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return

    const [hours, minutes] = time.split(":").map(Number)
    const updatedDate = new Date(newDate)
    updatedDate.setHours(hours, minutes, 0, 0)
    setSelectedDate(updatedDate)
    setDate(updatedDate)
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)

    const [hours, minutes] = newTime.split(":").map(Number)
    const updatedDate = new Date(selectedDate)
    updatedDate.setHours(hours, minutes, 0, 0)
    setSelectedDate(updatedDate)
    setDate(updatedDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal h-8 text-sm",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
          {format(date, "PPP 'at' h:mm a")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <Label htmlFor="time" className="text-xs mb-1.5 block">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
