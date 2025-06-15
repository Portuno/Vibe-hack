
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingSlides } from "@/components/OnboardingSlides";

// El onboarding ya fue modularizado, solo simplifico y aseguro responsividad
export default function Onboarding() {
  const onboarding = useOnboardingState();
  return (
    <div className="min-h-screen flex items-center justify-center bg-crema px-1 sm:px-2 py-4">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl p-2 sm:p-8">
        <OnboardingSlides {...onboarding} />
      </div>
    </div>
  );
}
