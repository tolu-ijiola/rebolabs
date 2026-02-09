"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ]

  const [fromMonth, setFromMonth] = React.useState<number>(
    date?.from?.getMonth() ?? new Date().getMonth()
  )
  const [fromYear, setFromYear] = React.useState<number>(
    date?.from?.getFullYear() ?? new Date().getFullYear()
  )
  const [fromDay, setFromDay] = React.useState<number>(
    date?.from?.getDate() ?? 1
  )

  const [toMonth, setToMonth] = React.useState<number>(
    date?.to?.getMonth() ?? new Date().getMonth()
  )
  const [toYear, setToYear] = React.useState<number>(
    date?.to?.getFullYear() ?? new Date().getFullYear()
  )
  const [toDay, setToDay] = React.useState<number>(
    date?.to?.getDate() ?? new Date().getDate()
  )

  React.useEffect(() => {
    if (date?.from) {
      setFromMonth(date.from.getMonth())
      setFromYear(date.from.getFullYear())
      setFromDay(date.from.getDate())
    }
    if (date?.to) {
      setToMonth(date.to.getMonth())
      setToYear(date.to.getFullYear())
      setToDay(date.to.getDate())
    }
  }, [date])

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const handleApply = () => {
    const fromDate = new Date(fromYear, fromMonth, fromDay)
    const toDate = new Date(toYear, toMonth, toDay)
    
    if (fromDate > toDate) {
      onDateChange?.({ from: toDate, to: fromDate })
    } else {
      onDateChange?.({ from: fromDate, to: toDate })
    }
    setIsOpen(false)
  }

  const fromDays = getDaysInMonth(fromMonth, fromYear)
  const toDays = getDaysInMonth(toMonth, toYear)

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full sm:w-[280px] justify-start text-left font-normal h-9 px-3 text-sm rounded-2xl",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            {/* From Date */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">From</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={fromMonth.toString()}
                  onValueChange={(value) => {
                    const month = parseInt(value)
                    setFromMonth(month)
                    const daysInMonth = getDaysInMonth(month, fromYear)
                    if (fromDay > daysInMonth) {
                      setFromDay(daysInMonth)
                    }
                  }}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={fromDay.toString()}
                  onValueChange={(value) => setFromDay(parseInt(value))}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: fromDays }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={fromYear.toString()}
                  onValueChange={(value) => {
                    const year = parseInt(value)
                    setFromYear(year)
                    const daysInMonth = getDaysInMonth(fromMonth, year)
                    if (fromDay > daysInMonth) {
                      setFromDay(daysInMonth)
                    }
                  }}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">To</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={toMonth.toString()}
                  onValueChange={(value) => {
                    const month = parseInt(value)
                    setToMonth(month)
                    const daysInMonth = getDaysInMonth(month, toYear)
                    if (toDay > daysInMonth) {
                      setToDay(daysInMonth)
                    }
                  }}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={toDay.toString()}
                  onValueChange={(value) => setToDay(parseInt(value))}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: toDays }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={toYear.toString()}
                  onValueChange={(value) => {
                    const year = parseInt(value)
                    setToYear(year)
                    const daysInMonth = getDaysInMonth(toMonth, year)
                    if (toDay > daysInMonth) {
                      setToDay(daysInMonth)
                    }
                  }}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Apply Button */}
            <Button
              onClick={handleApply}
              className="w-full rounded-2xl mt-2"
              size="sm"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}










