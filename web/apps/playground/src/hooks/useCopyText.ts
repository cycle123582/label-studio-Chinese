import { useCallback } from "react";
import { useToast, ToastType } from "@humansignal/ui";

interface UseCopyTextOptions {
  successMessage?: string;
  errorMessage?: string;
}

export const useCopyText = (options: UseCopyTextOptions = {}) => {
  const toast = useToast();
  const { successMessage = "Copied to clipboard", errorMessage = "Failed to copy to clipboard" } = options;

  // Fallback function for copying text to clipboard
  const fallbackCopyToClipboard = useCallback(
    (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Avoid scrolling to bottom of page in MS Edge
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          toast?.show({ message: successMessage });
        } else {
          toast?.show({ message: errorMessage, type: ToastType.error });
        }
      } catch (err) {
        console.error("Failed to copy text: ", err);
        toast?.show({ message: errorMessage, type: ToastType.error });
      }

      document.body.removeChild(textArea);
    },
    [toast, successMessage, errorMessage],
  );

  const copyText = useCallback(
    async (text: string) => {
      // Try using the Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        try {
          // Ensure the document is focused before attempting to copy
          if (!document.hasFocus()) {
            // If document is not focused, use the fallback method
            fallbackCopyToClipboard(text);
            return;
          }

          await navigator.clipboard.writeText(text);
          toast?.show({ message: successMessage });
        } catch (error) {
          console.error("Failed to copy to clipboard", error);
          fallbackCopyToClipboard(text);
        }
      } else {
        // Fallback for non-secure contexts or when Clipboard API is not available
        fallbackCopyToClipboard(text);
      }
    },
    [toast, successMessage, fallbackCopyToClipboard],
  );

  return copyText;
};
