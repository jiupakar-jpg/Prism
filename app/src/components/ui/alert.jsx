import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "~/lib/utils"
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-xl border px-6 py-5 text-sm font-medium transition-all duration-300",
  "backdrop-blur-xl shadow-lg",
  "[&>svg+div]:translate-y-[-2px] [&>svg]:absolute [&>svg]:left-5 [&>svg]:top-5 [&>svg~*]:pl-10",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-900/60 to-cyan-900/60 border-cyan-500/40 text-cyan-100",
          "shadow-cyan-500/20 hover:shadow-cyan-500/40",

        success:
          "bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border-emerald-500/50 text-emerald-100",
          "shadow-emerald-500/20 hover:shadow-emerald-500/40",

        destructive:
          "bg-gradient-to-r from-red-900/70 to-rose-900/70 border-red-500/60 text-red-200",
          "shadow-red-500/30 hover:shadow-red-500/50",

        warning:
          "bg-gradient-to-r from-amber-900/60 to-orange-900/60 border-amber-500/50 text-amber-100",
          "shadow-amber-500/20 hover:shadow-amber-500/40",

        info:
          "bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-indigo-500/50 text-indigo-100",
          "shadow-indigo-500/20 hover:shadow-indigo-500/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "success" | "destructive" | "warning" | "info" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), "animate-in fade-in slide-in-from-top-2 duration-500", className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        "mb-2 font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r",
        "from-cyan-300 to-blue-400",
        className
      )}
      {...props}
    />
  )
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm opacity-90 leading-relaxed [&_p]:my-2", className)}
      {...props}
    />
  )
)
AlertDescription.displayName = "AlertDescription"

// Optional: Auto-icon based on variant
const AlertIcon = ({ variant }: { variant: "default" | "success" | "destructive" | "warning" | "info" }) => {
  switch (variant) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-emerald-400" />
    case "destructive":
      return <XCircle className="h-5 w-5 text-red-400" />
    case "warning":
      return <AlertCircle className="h-5 w-5 text-amber-400" />
    case "info":
      return <Info className="h-5 w-5 text-indigo-400" />
    default:
      return <Info className="h-5 w-5 text-cyan-400" />
  }
}

export { Alert, AlertTitle, AlertDescription, AlertIcon }
