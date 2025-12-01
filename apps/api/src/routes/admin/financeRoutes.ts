import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { adminRateLimit } from "../../middleware/adminRateLimit.js";
import { adjustAdminWallet, listAdminLedger, listAdminWallets } from "../../controllers/admin/index.js";

const router = Router();

router.get("/wallets", requireRole("owner", "admin"), listAdminWallets);

router.post(
  "/wallets/adjust",
  requireRole("owner", "admin"),
  adminRateLimit,
  adjustAdminWallet
);

router.get("/ledger", requireRole("owner", "admin"), listAdminLedger);

export default router;
