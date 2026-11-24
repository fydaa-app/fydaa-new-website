import { Suspense } from "react";
import { CallbackFallback, CallbackStatus } from "@/features/transactional/callback-status";

export default function Page() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <CallbackStatus flow="setu" />
    </Suspense>
  );
}
