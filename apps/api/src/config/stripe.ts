import Stripe from "stripe";
import { env } from "./env";

export const stripe = env.stripe.secretKey
  ? new Stripe(env.stripe.secretKey, {
      apiVersion: "2023-10-16"
    })
  : null;
