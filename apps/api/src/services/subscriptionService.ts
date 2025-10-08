import { Types } from "mongoose";
import { env } from "../config/env";
import { stripe } from "../config/stripe";
import { SubscriptionModel, UserModel } from "../models";
import type Stripe from "stripe";
import type { PlanTier } from "../constants/plans";

type PaidPlan = Exclude<PlanTier, "free">;

const priceToPlan = new Map<string, PaidPlan>([
  [env.stripe.prices.starter, "starter"],
  [env.stripe.prices.pro, "pro"],
  [env.stripe.prices.team, "team"]
]);

const planToPrice = (plan: PaidPlan): string => {
  const value = env.stripe.prices[plan];
  if (!value) {
    throw new Error(`No Stripe price configured for plan ${plan}`);
  }
  return value;
};

export const createCheckoutSession = async (
  userId: string,
  email: string,
  plan: PaidPlan,
  origin: string
): Promise<string> => {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const price = planToPrice(plan);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/billing?state=success`,
    cancel_url: `${origin}/billing?state=cancel`,
    customer_email: email,
    metadata: { userId, plan },
    subscription_data: {
      metadata: { userId, plan }
    }
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
};

export const createBillingPortalSession = async (userId: string, origin: string): Promise<string> => {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }
  const subscription = await SubscriptionModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!subscription) {
    throw new Error("No subscription on file");
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${origin}/billing`
  });

  return portal.url;
};

const upsertSubscription = async (
  userId: string,
  plan: PaidPlan,
  payload: Pick<Stripe.Subscription, "id" | "status" | "current_period_start" | "current_period_end"> & {
    customer: string | Stripe.Customer | Stripe.DeletedCustomer;
  }
): Promise<void> => {
  const customerId = typeof payload.customer === "string" ? payload.customer : payload.customer.id;
  await SubscriptionModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    {
      plan,
      status: payload.status,
      currentPeriodStart: new Date(payload.current_period_start * 1000),
      currentPeriodEnd: new Date(payload.current_period_end * 1000),
      stripeCustomerId: customerId,
      stripeSubscriptionId: payload.id
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await UserModel.findByIdAndUpdate(userId, { plan });
};

export const handleStripeWebhook = async (
  signature: string | string[] | undefined,
  payload: Buffer
): Promise<void> => {
  if (!stripe || !env.stripe.webhookSecret) {
    throw new Error("Stripe webhook is not configured");
  }

  const sig = Array.isArray(signature) ? signature[0] : signature;
  if (!sig) {
    throw new Error("Missing Stripe signature");
  }

  const event = stripe.webhooks.constructEvent(payload, sig, env.stripe.webhookSecret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as PaidPlan | undefined;
      if (!userId || !plan) break;
      if (!session.subscription) break;
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0]?.price.id;
      const resolvedPlan = priceToPlan.get(priceId ?? "") ?? plan;
      await upsertSubscription(userId, resolvedPlan, subscription);
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;
      const priceId = subscription.items.data[0]?.price.id ?? "";
      const plan = priceToPlan.get(priceId);
      if (!plan) break;
      await upsertSubscription(userId, plan, subscription);
      break;
    }
    default:
      break;
  }
};
