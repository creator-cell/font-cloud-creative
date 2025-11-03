import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { adminRateLimit } from "../../middleware/adminRateLimit";
import { adjustAdminWallet, listAdminLedger, listAdminWallets } from "../../controllers/admin";

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
