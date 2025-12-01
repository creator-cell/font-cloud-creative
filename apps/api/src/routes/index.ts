import { Router } from "express";
import chatRouter from "./chatRoutes.js";
import { registerPublicRoutes } from "./publicRoutes.js";
import { registerAuthRoutes } from "./authRoutes.js";
import { registerApplicationRoutes } from "./applicationRoutes.js";
import adminRouter from "./adminRoutes.js";

const router = Router();

registerPublicRoutes(router);
registerAuthRoutes(router);
registerApplicationRoutes(router);

router.use("/v1/chat", chatRouter);
router.use("/admin", adminRouter);

export default router;
