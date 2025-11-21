import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-bold uppercase tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:from-cyan-400 hover:to-blue-500 hover:scale-[1.02] active:scale-95",

        destructive:
          "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/40 hover:shadow-red-500/70 hover:from-red-500 hover:to-rose-500 hover:scale-[1.02] active:scale-95",

        outline:
          "border-2 border-cyan-500/70 bg-transparent text-cyan-300 backdrop-blur-sm hover:bg-cyan-900/40 hover:text-cyan-200 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30",

        secondary:
          "bg-gradient-to-r from-cyan-900/70 to-blue-900/70 text-cyan-200 border border-cyan-700/60 backdrop-blur-sm hover:from-cyan-800/80 hover:to-blue-800/80 hover:text-cyan-100 hover:shadow-lg hover:shadow-cyan-500/30",

        ghost:
          "text-cyan-300 hover:bg-cyan-900/40 hover:text-cyan-100 hover:shadow-md hover:shadow-cyan-500/30 backdrop-blur-sm",

        link:
          "text-cyan-400 hover:text-cyan-300 underline underline-offset-4 hover:underline-offset-8 transition-all",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    asChild?: boolean
  }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
