"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 200) {
                onClose()
              }
            }}
            className="fixed bottom-0 left-0 right-0 h-[90vh] bg-black rounded-t-[32px] z-50 overflow-y-auto border-t border-white"
          >
            <div 
              className="sticky top-0 w-full pt-4 pb-2 bg-black flex justify-center bg-gradient-to-b from-gray-800/20 to-transparent cursor-grab active:cursor-grabbing"
            >
              <div className="w-12 h-1.5 bg-gray-700 rounded-full" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}