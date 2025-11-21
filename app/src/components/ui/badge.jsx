import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "~/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent",
  {
    variants: {
      variant: {
        default:
          "border-cyan-500/60 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:from-cyan-500/30 hover:to-blue-600/30 backdrop-blur-sm",

        secondary:
          "border-cyan-700/60 bg-gradient-to-r from-cyan-900/60 to-blue-900/60 text-cyan-200 hover:bg-cyan-800/60 backdrop-blur-sm",

        destructive:
          "border-red-500/60 bg-gradient-to-r from-red-900/70 to-rose-900/70 text-red-300 shadow-lg shadow-red-500/40 hover:shadow-red-500/60 backdrop-blur-sm",

        success:
          "border-emerald-500/60 bg-gradient-to-r from-emerald-900/60 to-teal-900/60 text-emerald-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 backdrop-blur-sm",

        online:
          "border-emerald-400/70 bg-emerald-400/20 text-emerald-300 shadow-lg shadow-emerald-400/50 relative overflow-hidden",
          "before:absolute before:inset-0 before:animate-ping before:bg-emerald-400/40 before:rounded-full",

        outline:
          "border-cyan-500/70 bg-transparent text-cyan-300 backdrop-blur-sm hover:bg-cyan-900/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: any }) {
  return (
    <div
      className={cn(badgeVariants({ variant }), "relative", className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
