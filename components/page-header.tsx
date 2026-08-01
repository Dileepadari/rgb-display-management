"use client"

import type React from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface PageHeaderProps {
  title: string
  purpose: string
  howTo?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  purpose,
  howTo,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("animate-slide-up space-y-3", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-gradient-brand">
            {title}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{purpose}</p>
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>

      {howTo ? (
        <Collapsible>
          <CollapsibleTrigger className="group inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
            <HelpCircle className="size-3.5" />
            How to use this page
            <ChevronDown className="size-3.5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 max-w-3xl rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_ul]:space-y-1">
            {howTo}
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </div>
  )
}
