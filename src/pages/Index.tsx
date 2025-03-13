
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ThemeSelector from "./ThemeSelector";
import PromptSelector from "./PromptSelector";
import NarrativeSelector from "./NarrativeSelector";
import DataSubmission from "./DataSubmission";
import { PromptType } from "@/components/PromptCard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
import Settings from "./Settings";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [theme, setTheme] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptType | null>(null);
  const [selectedNarrative, setSelectedNarrative] = useState<PromptType | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { logout } = useAuth();

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
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsSettingsOpen(true)}
          className="bg-opacity-75 backdrop-blur-sm"
        >
          <SettingsIcon className="mr-2 h-4 w-4" /> Paramètres
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="bg-opacity-75 backdrop-blur-sm"
        >
          <LogOut className="mr-2 h-4 w-4" /> Déconnexion
        </Button>
      </div>
      
      {/* Settings Modal */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      
      <AnimatePresence mode="wait">
        {renderCurrentStep()}
      </AnimatePresence>
    </div>
  );
};

export default Index;
