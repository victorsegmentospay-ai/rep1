import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck, Lock, AlertTriangle } from "lucide-react";
import {
  HOTMART_OFFER_CODE,
  loadHotmartScript,
} from "@/lib/hotmart";
import tiktokLogo from "@/assets/tiktok.svg";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout – TikTok Rewards" },
      {
        name: "description",
        content:
          "Complete your purchase securely with the official Hotmart checkout.",
      },
      { property: "og:title", content: "Secure Checkout – TikTok Rewards" },
      {
        property: "og:description",
        content:
          "Complete your purchase securely with the official Hotmart checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

type Status = "loading" | "ready" | "error" | "not-configured";

function CheckoutPage() {
  const [status, setStatus] = useState<Status>("loading");
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return; // avoid double init on re-renders
    mountedRef.current = true;

    if (
      !HOTMART_OFFER_CODE ||
      HOTMART_OFFER_CODE === "YOUR_OFFER_CODE"
    ) {
      setStatus("not-configured");
      return;
    }

    let cancelled = false;

    loadHotmartScript()
      .then(() => {
        if (cancelled) return;
        const container = document.getElementById("inline_checkout");
        if (!container || !window.checkoutElements) {
          setStatus("error");
          return;
        }
        const elements = window.checkoutElements.init("inlineCheckout", {
          offer: HOTMART_OFFER_CODE,
        });
        elements.mount("#inline_checkout");
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="checkout-page">
      <header className="header">
        <div className="logo-wrap">
          <span className="logo-icon">
            <img src={tiktokLogo} alt="TikTok" className="h-5 w-5 invert" />
          </span>
          <span className="logo-text">TikTok Rewards</span>
        </div>
        <div className="secure-badge">
          <Lock className="h-3.5 w-3.5" />
          <span>Secure checkout</span>
        </div>
      </header>

      <main className="checkout-main">
        <h1 className="checkout-title">Complete your payment</h1>
        <p className="checkout-subtitle">
          Your payment is processed securely by Hotmart.
        </p>

        {status === "loading" && (
          <div className="checkout-state">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading the secure checkout…</p>
          </div>
        )}

        {status === "not-configured" && (
          <div className="checkout-state checkout-state--warn">
            <AlertTriangle className="h-8 w-8" />
            <p>
              The Hotmart offer code is not configured yet. Set your real offer
              code in <code>src/lib/hotmart.ts</code> to enable the checkout.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="checkout-state checkout-state--warn">
            <AlertTriangle className="h-8 w-8" />
            <p>
              We couldn't load the payment form. Please check your connection
              and try again.
            </p>
            <button
              type="button"
              className="btn"
              onClick={() => window.location.reload()}
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Official Hotmart inline checkout mounts here */}
        <div
          id="inline_checkout"
          className="checkout-embed"
          style={{ display: status === "ready" ? "block" : "none" }}
        />

        <div className="checkout-trust">
          <ShieldCheck className="h-4 w-4" />
          <span>
            Payments processed by Hotmart. We never store your card details.
          </span>
        </div>

        <Link to="/" className="checkout-back">
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
