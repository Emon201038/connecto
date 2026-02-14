"use client"

import type React from "react"

import { useRef, useEffect, forwardRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface ReactionsModalProps {
  isOpen: boolean
  onClose: () => void
  onReactionSelect: (reaction: string, event: React.MouseEvent) => void
  position: { x: number; y: number }
}

const ReactionsModal = forwardRef<HTMLButtonElement, ReactionsModalProps>(({
  isOpen,
  onClose,
  onReactionSelect,
  // position,
}: ReactionsModalProps, triggerRef) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  // Define the reactions
  const reactions = [
    {
      name: "like", emoji: <Image src="/images/like.svg" alt="like" width={24} height={24}
      />, color: "#2078f4"
    },
    { name: "love", emoji: <Image src="/images/love.svg" alt="angry" width={24} height={24} />, color: "#f33e58" },
    { name: "haha", emoji: <Image src="/images/haha.svg" alt="angry" width={24} height={24} />, color: "#f7b125" },
    { name: "wow", emoji: <Image src="/images/wow.svg" alt="angry" width={24} height={24} />, color: "#f7b125" },
    { name: "sad", emoji: <Image src="/images/sad.svg" alt="angry" width={24} height={24} />, color: "#f7b125" },
    { name: "angry", emoji: <Image src="/images/angry.svg" alt="angry" width={24} height={24} />, color: "#e9710f" },
  ]

  // Auto-close timer
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (triggerRef && 'current' in triggerRef && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setModalPosition({ x: rect.left + rect.width / 2, y: rect.top })
    }
  }, [triggerRef])


  // Set up event listeners when modal opens
  useEffect(() => {
    if (!isOpen) return

    // Start auto-close timer (close after 5 seconds of inactivity)
    autoCloseTimerRef.current = setTimeout(() => {
      onClose()
    }, 5000)

    // Handle clicks outside the modal
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Don't close if clicking on the trigger button
      if (triggerRef && 'current' in triggerRef && triggerRef.current && triggerRef.current.contains(event.target as Node)) {
        return
      }

      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Handle scroll events
    const handleScroll = () => {
      onClose()
    }

    // Handle escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    // Handle any modal or dialog opening
    const handleFocusChange = () => {
      // If focus moves to another modal or dialog, close this one
      if (
        document.activeElement &&
        document.activeElement !== document.body &&
        modalRef.current &&
        !modalRef.current.contains(document.activeElement)
      ) {
        onClose()
      }
    }

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("focusin", handleFocusChange)

    // Handle any touch move (for mobile scrolling)
    const handleTouchMove = () => {
      onClose()
    }
    document.addEventListener("touchmove", handleTouchMove, { passive: true })

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("focusin", handleFocusChange)
      document.removeEventListener("touchmove", handleTouchMove)

      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current)
      }
    }
  }, [isOpen, onClose, triggerRef])

  // Reset auto-close timer when user interacts with the modal
  const resetAutoCloseTimer = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current)
    }

    autoCloseTimerRef.current = setTimeout(() => {
      onClose()
    }, 5000)
  }

  if (!isOpen) return null

  // Calculate position to ensure the modal stays within viewport
  const modalX = Math.max(10, Math.min(modalPosition.x - 100, window.innerWidth - 320))
  const modalY = Math.max(10, modalPosition.y - 60)

  return (
    <div className="fixed inset-0 z-[101] flex items-start justify-start" style={{ pointerEvents: "none" }}>
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        style={{
          position: "absolute",
          left: `${modalX}px`,
          top: `${modalY}px`,
          pointerEvents: "auto",
        }}
        className="bg-background rounded-full shadow-lg border p-1 flex items-center"
        onMouseEnter={resetAutoCloseTimer}
        onTouchStart={resetAutoCloseTimer}
      >
        {reactions.map((reaction) => (
          <motion.button
            key={reaction.name}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full flex items-center justify-center relative group"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReactionSelect(reaction.name, e)
              onClose()
            }}
          >
            <span className="text-2xl">{reaction.emoji}</span>
            <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-1 py-0.5 capitalize">
              {reaction.name}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
})
ReactionsModal.displayName = "ReactionsModal"

export default ReactionsModal