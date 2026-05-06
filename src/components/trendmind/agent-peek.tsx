"use client";

import type { AgentId } from "@/lib/types";

export function AgentPeek({
  agent = "director",
  reasoning,
  children,
}: {
  agent?: AgentId;
  reasoning: string;
  children: React.ReactNode;
}) {
  void agent;
  void reasoning;
  return <>{children}</>;
}
