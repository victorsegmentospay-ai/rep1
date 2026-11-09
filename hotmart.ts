// Hotmart Checkout Elements — single configuration point.
// Set your real Hotmart offer code here (from your Hotmart dashboard).
// Never put private API tokens or secrets in this file.

export const HOTMART_OFFER_CODE: string = "8w1vw7s1";

export const HOTMART_SCRIPT_URL =
  "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";

declare global {
  interface Window {
    checkoutElements?: {
      init: (
        type: "inlineCheckout",
        options: { offer: string }
      ) => { mount: (selector: string) => void };
    };
  }
}

let scriptPromise: Promise<void> | null = null;

/**
 * Loads the official Hotmart Checkout Elements library exactly once.
 * Safe to call multiple times — returns the same promise.
 */
export function loadHotmartScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Hotmart checkout requires a browser environment."));
      return;
    }
    if (window.checkoutElements) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${HOTMART_SCRIPT_URL}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load the Hotmart library.")),
        { once: true }
      );
      return;
    }
    const script = document.createElement("script");
    script.src = HOTMART_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null; // allow retry on next visit
      reject(new Error("Failed to load the Hotmart library."));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}
