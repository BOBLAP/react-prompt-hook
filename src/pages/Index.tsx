
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ThemeSelector from "./ThemeSelector";
import PromptSelector from "./PromptSelector";
import NarrativeSelector from "./NarrativeSelector";
import DataSubmission from "./DataSubmission";
import { PromptType } from "@/components/PromptCard";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [theme, setTheme] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptType | null>(null);
  const [selectedNarrative, setSelectedNarrative] = useState<PromptType | null>(null);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setTheme("");
    setSelectedPrompt(null);
    setSelectedNarrative(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ThemeSelector
            theme={theme}
            setTheme={setTheme}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <PromptSelector
            selectedPrompt={selectedPrompt}
            setSelectedPrompt={setSelectedPrompt}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <NarrativeSelector
            selectedNarrative={selectedNarrative}
            setSelectedNarrative={setSelectedNarrative}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <DataSubmission
            theme={theme}
            selectedPrompt={selectedPrompt}
            selectedNarrative={selectedNarrative}
            onPrevious={handlePrevious}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {renderCurrentStep()}
      </AnimatePresence>
    </div>
  );
};

export default Index;
