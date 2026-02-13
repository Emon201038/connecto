import { cn } from "@/lib/utils"

interface ChattingIndicatorProps {
  size?: "small" | "medium" | "large"
  color?: "gray" | "blue" | "green" | "purple"
  className?: string
}

export function ChattingIndicator({ size = "medium", color = "gray", className }: ChattingIndicatorProps) {
  const sizeClasses = {
    small: "w-1 h-1",
    medium: "w-1.5 h-1.5",
    large: "w-2 h-2",
  }

  const colorClasses = {
    gray: "bg-gray-400",
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
  }

  const containerPadding = {
    small: "px-2 py-1",
    medium: "px-3 py-2",
    large: "px-4 py-3",
  }

  return (
    <div className={cn("flex items-center space-x-1", containerPadding[size], className)}>
      <div
        className={cn("rounded-full animate-chat-bounce", sizeClasses[size], colorClasses[color])}
        style={{
          animationDelay: "0ms",
          animationDuration: "1.4s",
        }}
      />
      <div
        className={cn("rounded-full animate-chat-bounce", sizeClasses[size], colorClasses[color])}
        style={{
          animationDelay: "160ms",
          animationDuration: "1.4s",
        }}
      />
      <div
        className={cn("rounded-full animate-chat-bounce", sizeClasses[size], colorClasses[color])}
        style={{
          animationDelay: "320ms",
          animationDuration: "1.4s",
        }}
      />
    </div>
  )
}
