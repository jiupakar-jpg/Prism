"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "~/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer relative h-5 w-5 shrink-0 rounded-md border-2",
      "border-cyan-600/70 bg-transparent",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
      "disabled:cursor-not-allowed disabled:opacity-40",
      "transition-all duration-300",
      "data-[state=checked]:border-cyan-400 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-cyan-500/30 data-[state=checked]:to-blue-600/30",
      "data-[state=checked]:shadow-lg data-[state=checked]:shadow-cyan-500/50",
      "hover:border-cyan-400 hover:shadow-cyan-500/30",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4 text-cyan-300 font-bold drop-shadow-md" />
    </CheckboxPrimitive.Indicator>

    {/* Optional: subtle inner glow when checked */}
    <div className="pointer-events-none absolute inset-0 rounded-md opacity-0 data-[state=checked]:opacity-100 transition-opacity">
      <div className="h-full w-full rounded-md bg-cyan-400/20 blur-xl" />
    </div>
  </CheckboxPrimitive.Root>
))

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
