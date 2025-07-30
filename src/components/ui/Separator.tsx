import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  withText?: boolean;
  textClassName?: string;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, withText, textClassName, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative flex items-center", className)}
        {...props}
      >
        <div className="flex-grow border-t border-border" />
        {withText && (
          <span
            className={cn(
              "mx-2 flex-shrink text-sm text-muted-foreground",
              textClassName
            )}
          >
            {children}
          </span>
        )}
        <div className="flex-grow border-t border-border" />
      </div>
    );
  }
);
Separator.displayName = "Separator";

export { Separator };