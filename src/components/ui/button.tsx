import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-black ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform",
  {
    variants: {
      variant: {
        default: "bg-neo-red text-neo-white border-3 border-neo-black shadow-neo hover:shadow-neo-xl hover:translate-x-[-2px] hover:translate-y-[-2px] hover:rotate-0 rotate-[-1deg] rounded-none",
        destructive:
          "bg-neo-red text-neo-white border-3 border-neo-black shadow-neo hover:shadow-neo-xl hover:translate-x-[-2px] hover:translate-y-[-2px] hover:rotate-0 rotate-[-1deg] rounded-none",
        outline:
          "bg-neo-white text-neo-black border-3 border-neo-black shadow-neo hover:shadow-neo-xl hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-neo-yellow hover:rotate-0 rotate-[1deg] rounded-none",
        secondary:
          "bg-neo-blue text-neo-white border-3 border-neo-black shadow-neo hover:shadow-neo-xl hover:translate-x-[-2px] hover:translate-y-[-2px] hover:rotate-0 rotate-[-2deg] rounded-none",
        ghost: "bg-transparent text-neo-black border-3 border-transparent hover:bg-neo-green hover:border-neo-black hover:text-neo-white hover:shadow-neo hover:rotate-0 rotate-[1deg] rounded-none",
        link: "text-neo-purple underline-offset-4 hover:underline font-black hover:text-neo-red transform hover:rotate-[-1deg] border-none shadow-none",
        brutal: "bg-neo-purple text-neo-white border-4 border-neo-black shadow-neo-xl hover:shadow-neo-2xl hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rotate-0 rotate-[-3deg] rounded-none",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-16 px-10 py-4 text-lg",
        icon: "h-12 w-12",
        xl: "h-20 px-12 py-6 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
