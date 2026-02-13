"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ResponsiveDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ResponsiveDialogTriggerProps {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

interface ResponsiveDialogContentProps {
  className?: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}

interface ResponsiveDialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const ResponsiveDialogContext = React.createContext<{
  isMobile: boolean;
}>({
  isMobile: false,
});

function ResponsiveDialog({
  children,
  open,
  onOpenChange,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  const contextValue = React.useMemo(
    () => ({
      isMobile,
    }),
    [isMobile]
  );

  if (isMobile) {
    return (
      <ResponsiveDialogContext.Provider value={contextValue}>
        <Sheet open={open} onOpenChange={onOpenChange}>
          {children}
        </Sheet>
      </ResponsiveDialogContext.Provider>
    );
  }

  return (
    <ResponsiveDialogContext.Provider value={contextValue}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    </ResponsiveDialogContext.Provider>
  );
}

function ResponsiveDialogTrigger({
  className,
  children,
  asChild,
  ...props
}: ResponsiveDialogTriggerProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <SheetTrigger className={className} asChild={asChild} {...props}>
        {children}
      </SheetTrigger>
    );
  }

  return (
    <DialogTrigger className={className} asChild={asChild} {...props}>
      {children}
    </DialogTrigger>
  );
}

function ResponsiveDialogContent({
  className,
  children,
  side = "bottom",
  showCloseButton = true,
  ...props
}: ResponsiveDialogContentProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <SheetContent
        side={side}
        className={cn(
          // Full height/width on mobile
          side === "bottom" && "h-[100vh] max-h-none rounded-t-none",
          side === "top" && "h-[100vh] max-h-none rounded-b-none",
          side === "left" && "w-full max-w-none",
          side === "right" && "w-full max-w-none",
          className
        )}
        {...props}
      >
        {children}
      </SheetContent>
    );
  }

  return (
    <DialogContent
      className={cn(" max-h-[95vh] overflow-y-auto", className)}
      showCloseButton={showCloseButton}
      {...props}
    >
      {children}
    </DialogContent>
  );
}

function ResponsiveDialogHeader({
  className,
  children,
  ...props
}: ResponsiveDialogHeaderProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <SheetHeader className={className} {...props}>
        {children}
      </SheetHeader>
    );
  }

  return (
    <DialogHeader className={className} {...props}>
      {children}
    </DialogHeader>
  );
}

function ResponsiveDialogFooter({
  className,
  children,
  ...props
}: ResponsiveDialogFooterProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <SheetFooter className={className} {...props}>
        {children}
      </SheetFooter>
    );
  }

  return (
    <DialogFooter className={className} {...props}>
      {children}
    </DialogFooter>
  );
}

function ResponsiveDialogTitle({
  className,
  children,
  ...props
}: ResponsiveDialogTitleProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <SheetTitle className={className} {...props}>
        {children}
      </SheetTitle>
    );
  }

  return (
    <DialogTitle className={className} {...props}>
      {children}
    </DialogTitle>
  );
}

function ResponsiveDialogDescription({
  className,
  children,
  ...props
}: ResponsiveDialogDescriptionProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <SheetDescription className={className} {...props}>
        {children}
      </SheetDescription>
    );
  }

  return (
    <DialogDescription className={className} {...props}>
      {children}
    </DialogDescription>
  );
}

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
};
