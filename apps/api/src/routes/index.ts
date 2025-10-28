import { Router } from "express";
import chatRouter from "./chatRoutes";
import { registerPublicRoutes } from "./publicRoutes";
import { registerAuthRoutes } from "./authRoutes";
import { registerApplicationRoutes } from "./applicationRoutes";
import adminRouter from "./adminRoutes";

const router = Router();

registerPublicRoutes(router);
registerAuthRoutes(router);
registerApplicationRoutes(router);

router.use("/v1/chat", chatRouter);
router.use("/admin", adminRouter);

export default router;
