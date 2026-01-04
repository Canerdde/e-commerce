"use client";

import { Twitter, Facebook, Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

interface SocialShareProps {
  productName: string;
  productUrl: string;
}

export function SocialShare({ productName, productUrl }: SocialShareProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.origin + productUrl : "";
  const shareText = `Check out ${productName} on CURATED`;

  const handleShare = async (platform: string) => {
    const url = shareUrl;
    const text = shareText;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "copy":
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          showToast("Link copied to clipboard");
          setTimeout(() => setCopied(false), 2000);
        }
        break;
      case "native":
        if (navigator.share) {
          try {
            await navigator.share({
              title: productName,
              text: text,
              url: url,
            });
          } catch (error) {
            // User cancelled or error occurred
          }
        }
        break;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium tracking-wider uppercase text-foreground-muted">
        Share:
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleShare("twitter")}
          className="p-2 hover:bg-background-secondary transition-colors duration-200"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleShare("facebook")}
          className="p-2 hover:bg-background-secondary transition-colors duration-200"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
        {typeof navigator !== "undefined" && navigator.share && (
          <button
            onClick={() => handleShare("native")}
            className="p-2 hover:bg-background-secondary transition-colors duration-200"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => handleShare("copy")}
          className="p-2 hover:bg-background-secondary transition-colors duration-200"
          aria-label="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

