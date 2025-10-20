import { requireServerRole } from "@/lib/roles";
import { SingleProviderChat } from "@/components/chat/single-provider-chat";

const ALLOWED_ROLES = ["owner", "admin", "developer"];

export default async function SingleChatPage() {
  await requireServerRole(ALLOWED_ROLES);
  return <SingleProviderChat />;
}

