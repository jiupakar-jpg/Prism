import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "~/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b border-cyan-800/40 last:border-b-0",
      "bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur-sm",
      "rounded-lg my-2 overflow-hidden shadow-lg shadow-cyan-500/10",
      "transition-all duration-300 hover:shadow-cyan-500/20",
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-5 px-6 text-base font-semibold transition-all",
        "text-cyan-100 hover:text-cyan-300",
        "group relative overflow-hidden rounded-lg",
        "bg-gradient-to-r from-cyan-800/30 to-blue-800/30 hover:from-cyan-700/50 hover:to-blue-700/50",
        "border border-cyan-700/50",
        "hover:shadow-lg hover:shadow-cyan-500/30",
        "[&[data-state=open]>svg]:rotate-180",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Animated Background Glow */}
      <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <ChevronDown className="h-5 w-5 shrink-0 text-cyan-400 transition-transform duration-300 group-hover:text-cyan-300" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div
      className={cn(
        "px-6 pb-6 pt-2 text-cyan-200",
        "bg-gradient-to-b from-transparent via-cyan-900/30 to-transparent",
        "border-x border-b border-cyan-700/30 rounded-b-lg",
        "backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
