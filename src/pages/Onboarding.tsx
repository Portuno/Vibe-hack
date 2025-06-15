
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingSlides } from "@/components/OnboardingSlides";

// Onboarding page, solo actúa como entry point
export default function Onboarding() {
  const onboarding = useOnboardingState();

  return (
    <div className="min-h-screen flex items-center justify-center bg-crema px-2">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl p-8">
        <OnboardingSlides {...onboarding} />
      </div>
    </div>
  );
}
