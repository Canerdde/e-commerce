"use client";

import { useEffect } from "react";
import { useToast } from "@/context/ToastContext";

export function DevToolsProtection() {
  const { showToast } = useToast();

  useEffect(() => {
    // Prevent right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showToast("Sayfa içeriğine erişim kısıtlanmıştır!", "error");
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123 || e.key === "F12") {
        e.preventDefault();
        showToast("Geliştirici konsoluna erişim engellenmiştir!", "error");
        return;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) || 
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) || 
        (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c"))
      ) {
        e.preventDefault();
        showToast("Geliştirici araçları kısıtlanmıştır!", "error");
        return;
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        showToast("Kaynak kodunu görüntüleme engellenmiştir!", "error");
        return;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showToast]);

  return null;
}
