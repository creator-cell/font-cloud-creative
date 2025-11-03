import axios, { isAxiosError } from "axios";
import crypto from "node:crypto";
import { env } from "../../config/env";

type AmazonChargeParams = {
  amountPaise: number;
  currencyCode: "INR" | "USD" | "SAR";
  referenceId: string;
  softDescriptor?: string;
  note?: string;
  customerEmail?: string;
};

export type AmazonChargeResult = {
  status: string;
  gateway: "amazon-pay";
  reference: string;
  chargeId?: string;
  captureId?: string;
  chargePermissionId?: string;
  amount: string;
  currencyCode: AmazonChargeParams["currencyCode"];
  rawResponse?: unknown;
};

type CachedToken = {
  token: string;
  expiresAt: number;
};

let cachedToken: CachedToken | null = null;

const requireConfiguration = () => {
  if (!env.amazonPay.enabled) {
    throw new Error("Amazon Pay is not configured. Please set the required environment variables.");
  }
};

const fetchAccessToken = async (): Promise<string> => {
  requireConfiguration();

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    scope: env.amazonPay.scope,
    client_id: env.amazonPay.clientId,
    client_secret: env.amazonPay.clientSecret
  });

  const { data } = await axios.post(env.amazonPay.authEndpoint, params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    timeout: 7_000
  });

  const expiresIn = typeof data.expires_in === "number" ? data.expires_in : 3600;
  cachedToken = {
    token: data.access_token as string,
    expiresAt: Date.now() + Math.max(expiresIn - 60, 60) * 1000
  };

  return cachedToken.token;
};

const formatAmount = (amountPaise: number): string => (amountPaise / 100).toFixed(2);

export const createAmazonCharge = async (params: AmazonChargeParams): Promise<AmazonChargeResult> => {
  if (env.amazonPay.simulateCharges) {
    const amount = formatAmount(params.amountPaise);
    return {
      status: "Simulation",
      gateway: "amazon-pay",
      reference: params.referenceId ?? `sim_${Date.now()}`,
      amount,
      currencyCode: params.currencyCode
    };
  }

  if (params.amountPaise <= 0) {
    return {
      status: "skipped",
      gateway: "amazon-pay",
      reference: params.referenceId,
      amount: "0.00",
      currencyCode: params.currencyCode
    };
  }

  requireConfiguration();
  const accessToken = await fetchAccessToken();
  const amount = formatAmount(params.amountPaise);
  const stage = env.amazonPay.sandbox ? "sandbox" : "live";
  const idempotencyKey = crypto.randomUUID();

  const payload: Record<string, unknown> = {
    chargePermissionId: env.amazonPay.chargePermissionId,
    chargeReferenceId: params.referenceId,
    chargeAmount: {
      amount,
      currencyCode: params.currencyCode
    },
    captureNow: true,
    softDescriptor: params.softDescriptor ?? env.amazonPay.softDescriptor,
    merchantMetadata: {
      merchantReferenceId: params.referenceId,
      merchantStoreName: env.amazonPay.storeName,
      noteToBuyer: params.note ?? `Subscription charge`,
      customInformation: params.customerEmail ?? undefined
    }
  };

  if (!env.amazonPay.chargePermissionId) {
    throw new Error("Amazon Pay charge permission is not configured.");
  }

  try {
    const { data } = await axios.post(
      `${env.amazonPay.apiEndpoint}/${stage}/v2/charges`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-amz-pay-Idempotency-Key": idempotencyKey,
          "x-amz-pay-Region": env.amazonPay.region,
          "x-amz-pay-MerchantId": env.amazonPay.merchantId,
          ...(env.amazonPay.sandbox ? { "x-amz-pay-Sandbox-Mode": "true" } : {})
        },
        timeout: 12_000
      }
    );

    return {
      status: data.statusDetails?.state ?? "unknown",
      gateway: "amazon-pay",
      reference: data.chargeReferenceId ?? params.referenceId,
      chargeId: data.chargeId,
      captureId: data.captureId,
      chargePermissionId: data.chargePermissionId ?? env.amazonPay.chargePermissionId,
      amount,
      currencyCode: params.currencyCode,
      rawResponse: data
    };
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.response?.statusText ??
        error.message;
      const err = new Error(`Amazon Pay charge failed: ${message}`);
      (err as Error & { status?: number; details?: unknown }).status = error.response?.status;
      (err as Error & { status?: number; details?: unknown }).details = error.response?.data;
      throw err;
    }

    throw error;
  }
};

export const resetAmazonPayTokenCache = () => {
  cachedToken = null;
};
