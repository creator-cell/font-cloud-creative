import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import router from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { stripeWebhook } from "./controllers/webhookController";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));

app.post("/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use(errorHandler);

export default app;
