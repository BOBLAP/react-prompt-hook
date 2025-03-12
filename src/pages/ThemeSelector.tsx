
import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import Stepper from "@/components/Stepper";
import StepNavigation from "@/components/StepNavigation";
import { Textarea } from "@/components/ui/textarea";

type ThemeSelectorProps = {
  theme: string;
  setTheme: (theme: string) => void;
  onNext: () => void;
};

const ThemeSelector = ({ theme, setTheme, onNext }: ThemeSelectorProps) => {
  const handleSubmit = () => {
    if (theme.trim() === "") return;
    onNext();
  };

  return (
    <Layout>
      <Stepper
        steps={["Thématique", "Prompt", "Narratif", "Envoi"]}
        currentStep={0}
      />
      
      <Header 
        title="Quelle est votre thématique ?" 
        subtitle="Définissez le sujet principal de votre contenu pédagogique"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full space-y-6"
      >
        <Textarea
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Décrivez votre thématique..."
          className="textarea-field min-h-[200px]"
        />
        
        <StepNavigation
          onPrevious={() => {}}
          onNext={handleSubmit}
          isPreviousDisabled={true}
          isNextDisabled={theme.trim() === ""}
        />
      </motion.div>
    </Layout>
  );
};

export default ThemeSelector;
