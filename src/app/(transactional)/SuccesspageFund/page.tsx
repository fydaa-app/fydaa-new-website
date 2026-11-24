import { Suspense } from "react";
import { CallbackStatus } from "@/features/transactional/callback-status";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CallbackStatus flow="fund" />
    </Suspense>
  );
}
