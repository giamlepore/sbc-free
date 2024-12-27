import { useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => Promise<void>;
  moduleId: number;
  courseId: number;
}

export function RatingModal({ isOpen, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(0);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-gray-200 mb-4 text-center">
              Como você avalia esta aula?
            </h3>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      value <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-300"
                disabled={isSubmitting}
              >
                Pular
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="relative"
              >
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">Avaliar</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    </div>
                  </>
                ) : (
                  "Avaliar"
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
