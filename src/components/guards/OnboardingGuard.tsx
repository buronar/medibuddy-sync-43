import { Navigate } from "react-router-dom";
import { isOnboardingEnabled } from "@/config/features";

export function OnboardingGuard({ children }: { children: JSX.Element }) {
  if (!isOnboardingEnabled()) return <Navigate to="/dashboard" replace />;
  return children;
}