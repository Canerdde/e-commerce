"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "error";
}

export function Toast({ message, isVisible, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-6 z-50 bg-background-secondary border border-foreground/10 p-4 flex items-center gap-3 min-w-[300px] shadow-lg"
        >
          {type === "success" ? (
            <div className="w-5 h-5 bg-accent flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-background" />
            </div>
          ) : (
            <div className="w-5 h-5 bg-red-500 flex items-center justify-center flex-shrink-0">
              <X className="w-3 h-3 text-background" />
            </div>
          )}
          <p className="text-sm flex-1">{message}</p>
          <button
            onClick={onClose}
            className="p-1 hover:bg-background transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

