// src/config/features.ts
export const FEATURES = {
  ONBOARDING_ENABLED: false, // toggle padrão: DESATIVADO
};

// helper opcional: permite override via localStorage, útil para revert rápido sem rebuild
export function isOnboardingEnabled(): boolean {
  const override = localStorage.getItem("feature:onboarding");
  if (override === "true") return true;
  if (override === "false") return false;
  return FEATURES.ONBOARDING_ENABLED;
}