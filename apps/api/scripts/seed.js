#!/usr/bin/env tsx
import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";
import { PlanModel, UserModel } from "../src/models/index.js";
const PLANS = [
    {
        key: "free",
        name: "Free",
        monthlyPriceINR: 0,
        monthlyTokens: 15000,
        features: ["Watermarked output", "Community support"],
        premiumModelAccess: ["gpt-4o-mini", "llama3-8b"],
        overagePer1K: 0
    },
    {
        key: "starter",
        name: "Starter",
        monthlyPriceINR: 2400,
        monthlyTokens: 300000,
        features: ["Anthropic Haiku", "Gemini Flash"],
        premiumModelAccess: ["claude-3-haiku", "gemini-1.5-flash"],
        overagePer1K: 6
    },
    {
        key: "pro",
        name: "Pro",
        monthlyPriceINR: 8200,
        monthlyTokens: 1000000,
        features: ["GPT-4o", "Claude Sonnet", "Priority support"],
        premiumModelAccess: ["gpt-4o", "claude-3-sonnet"],
        overagePer1K: 12
    },
    {
        key: "team",
        name: "Team",
        monthlyPriceINR: 19800,
        monthlyTokens: 3000000,
        features: ["Seats", "Custom limits", "Dedicated CSM"],
        premiumModelAccess: ["gpt-4o", "claude-3-sonnet", "gemini-1.5-pro"],
        overagePer1K: 10
    }
];
const ownerEmail = process.env.SEED_OWNER_EMAIL;
if (!ownerEmail) {
    console.error("SEED_OWNER_EMAIL is required");
    process.exit(1);
}
async function run() {
    await connectDatabase();
    for (const plan of PLANS) {
        await PlanModel.findOneAndUpdate({ key: plan.key }, plan, {
            upsert: true,
            setDefaultsOnInsert: true
        });
    }
    const existingOwner = await UserModel.findOne({ email: ownerEmail });
    if (!existingOwner) {
        await UserModel.create({
            email: ownerEmail,
            plan: "team",
            roles: ["owner", "admin", "user"],
            seats: 5
        });
        console.log(`Owner account created for ${ownerEmail}`);
    }
    else if (!existingOwner.roles.includes("owner")) {
        existingOwner.roles = Array.from(new Set([...existingOwner.roles, "owner", "admin"]));
        await existingOwner.save();
        console.log(`Existing user ${ownerEmail} promoted to owner.`);
    }
    else {
        console.log("Owner already exists. Skipping user creation.");
    }
    await disconnectDatabase();
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
