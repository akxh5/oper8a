import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full bg-neo-white px-4 py-3 text-base font-bold text-neo-black border-3 border-neo-black shadow-neo placeholder:text-neo-charcoal placeholder:font-bold focus-visible:outline-none focus-visible:shadow-neo-lg focus-visible:translate-x-[-2px] focus-visible:translate-y-[-2px] focus-visible:border-neo-purple disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-out transform rotate-[-1deg] focus:rotate-0 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-neo-black md:text-base",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
