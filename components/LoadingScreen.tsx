import { motion } from "framer-motion"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#111111] flex items-center justify-center">
      <div className="relative">
        <motion.div
          className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/logo-sbc.png" 
            alt="SBC Logo" 
            className="h-12 w-auto opacity-80"
          />
        </div>
      </div>
    </div>
  )
}