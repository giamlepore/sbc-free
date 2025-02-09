"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface TypewriterEffectProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ text, speed = 20, onComplete }) => {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping) {
      if (displayText.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1))
          if (textRef.current) {
            const lastLine = textRef.current.lastElementChild
            if (lastLine) {
              lastLine.scrollIntoView({ behavior: "smooth", block: "nearest" })
            }
          }
        }, speed)
      } else {
        setIsTyping(false)
        onComplete && onComplete()
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isTyping, text, speed, onComplete])

  return (
    <div ref={textRef} className="overflow-y-auto max-h-[300px] text-white">
      {displayText.split("\n").map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  )
}

