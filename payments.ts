// =============================================================================
// PAGAMENTOS — registo da taxa de saque
// =============================================================================
// PONTO DE INTEGRAÇÃO DA GATEWAY
// Hoje o pagamento é apenas registado (simulação local). Quando ligares a tua
// gateway, substitui o corpo de `createPayment` por uma chamada a uma server
// function que crie a sessão de pagamento na gateway e devolva a referência /
// o URL de checkout reais. O resto do site continua igual, porque só consome
// o objeto `Payment` devolvido por aqui.
// =============================================================================

export type PaymentMethod = "paypal" | "zelle";
export type PaymentStatus = "pending" | "paid" | "cancelled";

export interface Payment {
  id: string;
  reference: string;
  amount: number;
  currency: "USD";
  label: string;
  method: PaymentMethod;
  email: string;
  status: PaymentStatus;
  createdAt: string;
  paidAt: string | null;
  gateway: "none";
}

export const FEE_AMOUNT = 10.9;
export const FEE_LABEL = "$10.90";
export const BALANCE_LABEL = "$325.00";

const STORAGE_KEY = "tiktok-rewards:payments";

function safeRead(): Payment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Payment[]) : [];
  } catch {
    return [];
  }
}

function safeWrite(list: Payment[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-50)));
  } catch {
    // armazenamento indisponível: o fluxo continua a funcionar em memória
  }
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function makeReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `TK-${out}`;
}

/** Cria o registo de pagamento da taxa de saque. */
export function createPayment({ method, email }: { method: PaymentMethod; email: string }): Payment {
  // >>> GATEWAY: substituir por createCheckoutSession({ amount, currency, method })
  const payment: Payment = {
    id: makeId(),
    reference: makeReference(),
    amount: FEE_AMOUNT,
    currency: "USD",
    label: FEE_LABEL,
    method,
    email,
    status: "pending",
    createdAt: new Date().toISOString(),
    paidAt: null,
    gateway: "none",
  };
  // <<< GATEWAY
  safeWrite([...safeRead(), payment]);
  return payment;
}

export function getPayment(reference: string): Payment | null {
  if (!reference) return null;
  return safeRead().find((p) => p.reference === reference) ?? null;
}

/** Confirmação simulada — a gateway deve chamar aqui via webhook. */
export function markPaymentPaid(reference: string): Payment | null {
  let updated: Payment | null = null;
  const next = safeRead().map((p) => {
    if (p.reference !== reference) return p;
    updated = { ...p, status: "paid" as PaymentStatus, paidAt: new Date().toISOString() };
    return updated;
  });
  safeWrite(next);
  return updated;
}

export function listPayments(): Payment[] {
  return safeRead();
}
