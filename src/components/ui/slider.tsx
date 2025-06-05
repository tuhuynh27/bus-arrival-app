import * as React from "react"
import { cn } from "@/lib/utils"

export type SliderProps = React.InputHTMLAttributes<HTMLInputElement>

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, value, defaultValue, onChange, ...props }, ref) => {
    const pct = (() => {
      const val =
        typeof value === "number"
          ? value
          : typeof value === "string"
            ? parseFloat(value)
            : typeof defaultValue === "number"
              ? defaultValue
              : typeof defaultValue === "string"
                ? parseFloat(defaultValue)
                : Number(min)
      return ((val - Number(min)) / (Number(max) - Number(min))) * 100
    })()
    return (
      <input
        type="range"
        ref={ref}
        min={min}
        max={max}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        data-slot="slider"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary)) ${pct}% , hsl(var(--secondary)) ${pct}%)`
        }}
        className={cn(
          "relative w-full h-2 cursor-pointer appearance-none rounded-full bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background",
          "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background",
          className
        )}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

