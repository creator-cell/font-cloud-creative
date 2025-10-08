import crypto from "crypto";

export const createWatermark = (userId: string): string => {
  const hash = crypto.createHash("sha1").update(userId).digest("hex").slice(0, 8);
  return `front-cloud-free-${hash}`;
};
