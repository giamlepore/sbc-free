"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface TypewriterEffectProps {
  text: string
  speed?: number
  onComplete?: () => void
  splitParagraphs?: boolean
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ 
  text, 
  speed = 20, 
  onComplete,
  splitParagraphs = false 
}) => {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const textRef = useRef<HTMLDivElement>(null)

  const formattedText = splitParagraphs 
    ? text.split('. ')
        .reduce((acc: string[], sentence: string, i: number) => {
          if (i % 2 === 0) {
            acc.push(sentence + (i + 1 < text.split('. ').length ? '. ' : ''));
          } else {
            acc[acc.length - 1] += sentence + '.\n\n';
          }
          return acc;
        }, [])
        .join('')
    : text;

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping) {
      if (displayText.length < formattedText.length) {
        timeout = setTimeout(() => {
          setDisplayText(formattedText.slice(0, displayText.length + 1))
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
  }, [displayText, isTyping, formattedText, speed, onComplete])

  return (
    <div ref={textRef} className="overflow-y-auto max-h-[300px] text-white">
      {displayText.split("\n").map((line, index) => (
        <p key={index} className={line.trim() ? "" : "mb-4"}>{line}</p>
      ))}
    </div>
  )
}

