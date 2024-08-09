"use client"

import * as React from "react"
import { useImperativeHandle, useRef, useState } from "react"
import { add, format, differenceInCalendarDays, parse } from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DayPicker } from "react-day-picker"
import { enUS, Locale } from "date-fns/locale"

// Utility functions
function isValidHour(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value)
}

function isValidMinuteOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value)
}

function getValidNumber(value: string, max: number, min = 0) {
  const numericValue = parseInt(value, 10)
  if (!isNaN(numericValue)) {
    return Math.max(min, Math.min(numericValue, max)).toString().padStart(2, '0')
  }
  return '00'
}

type TimePickerInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string
  onChange: (value: string) => void
  max: number
  onRightFocus?: () => void
  onLeftFocus?: () => void
}

const TimePickerInput = React.forwardRef<HTMLInputElement, TimePickerInputProps>(
  ({ className, value, onChange, max, onRightFocus, onLeftFocus, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowRight') onRightFocus?.()
      if (e.key === 'ArrowLeft') onLeftFocus?.()
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        const step = e.key === 'ArrowUp' ? 1 : -1
        const newValue = getValidNumber((parseInt(value, 10) + step).toString(), max)
        onChange(newValue)
      }
    }

    return (
      <Input
        ref={ref}
        className={cn(
          "w-[40px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        value={value}
        onChange={(e) => {
          const newValue = getValidNumber(e.target.value, max)
          onChange(newValue)
        }}
        type="text"
        inputMode="numeric"
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)

TimePickerInput.displayName = "TimePickerInput"

type TimePickerProps = {
  date: Date | undefined
  onChange: (date: Date) => void
  granularity?: "hour" | "minute" | "second"
}

function TimePicker({ date, onChange, granularity = "second" }: TimePickerProps) {
  const hourRef = useRef<HTMLInputElement>(null)
  const minuteRef = useRef<HTMLInputElement>(null)
  const secondRef = useRef<HTMLInputElement>(null)

  const handleTimeChange = (type: "hour" | "minute" | "second", value: string) => {
    if (!date) return
    const newDate = new Date(date)
    switch (type) {
      case "hour":
        newDate.setHours(parseInt(value, 10))
        break
      case "minute":
        newDate.setMinutes(parseInt(value, 10))
        break
      case "second":
        newDate.setSeconds(parseInt(value, 10))
        break
    }
    onChange(newDate)
  }

  return (
    <div className="flex items-center gap-2">
      <TimePickerInput
        value={date ? format(date, "HH") : "00"}
        onChange={(value) => handleTimeChange("hour", value)}
        max={23}
        ref={hourRef}
        onRightFocus={() => minuteRef.current?.focus()}
      />
      {granularity !== "hour" && (
        <>
          :
          <TimePickerInput
            value={date ? format(date, "mm") : "00"}
            onChange={(value) => handleTimeChange("minute", value)}
            max={59}
            ref={minuteRef}
            onLeftFocus={() => hourRef.current?.focus()}
            onRightFocus={() => secondRef.current?.focus()}
          />
        </>
      )}
      {granularity === "second" && (
        <>
          :
          <TimePickerInput
            value={date ? format(date, "ss") : "00"}
            onChange={(value) => handleTimeChange("second", value)}
            max={59}
            ref={secondRef}
            onLeftFocus={() => minuteRef.current?.focus()}
          />
        </>
      )}
    </div>
  )
}

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  yearRange?: number
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  yearRange = 50,
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
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
      }}
      {...props}
    />
  )
}

type DateTimePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  yearRange?: number
  displayFormat?: string
  granularity?: "day" | "hour" | "minute" | "second"
} & Pick<CalendarProps, "locale" | "weekStartsOn" | "showWeekNumber" | "showOutsideDays">

const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
  (
    {
      locale = enUS,
      value,
      onChange,
      yearRange = 50,
      disabled = false,
      displayFormat = "PPP HH:mm:ss",
      granularity = "second",
      placeholder = "Pick a date",
      ...props
    },
    ref
  ) => {
    const [month, setMonth] = useState<Date>(value ?? new Date())
    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleSelect = (newDay: Date | undefined) => {
      if (!newDay) return
      const newDate = value ? new Date(value) : new Date()
      newDate.setFullYear(newDay.getFullYear(), newDay.getMonth(), newDay.getDate())
      onChange?.(newDate)
      setMonth(newDate)
    }

    const handleTimeChange = (newDate: Date) => {
      onChange?.(newDate)
    }

    useImperativeHandle(
      ref,
      () => ({
        ...buttonRef.current!,
      }),
      []
    )

    return (
      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            ref={buttonRef}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, displayFormat, { locale }) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            month={month}
            onSelect={handleSelect}
            onMonthChange={setMonth}
            {...props}
          />
          {granularity !== "day" && (
            <div className="border-t border-border p-3">
              <TimePicker
                date={value}
                onChange={handleTimeChange}
                granularity={granularity}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    )
  }
)

DateTimePicker.displayName = "DateTimePicker"

export { DateTimePicker, Calendar }