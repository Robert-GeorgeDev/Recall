"use client";

import RequireAuth from "@/components/require-auth";
import AiChat from "@/components/ai-chat";

export default function AssistantPage() {
  return (
    <RequireAuth>
      <AiChat />
    </RequireAuth>
  );
}
