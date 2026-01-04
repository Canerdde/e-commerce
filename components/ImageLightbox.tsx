"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: ImageLightboxProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-background-secondary hover:bg-background transition-colors duration-200"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={onPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-background-secondary hover:bg-background transition-colors duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-background-secondary hover:bg-background transition-colors duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="relative aspect-[3/4] bg-background-secondary">
                <Image
                  src={images[currentIndex]}
                  alt={`Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 transition-all duration-200 ${
                      idx === currentIndex ? "bg-accent w-8" : "bg-foreground/30 w-8"
                    }`}
                  />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

