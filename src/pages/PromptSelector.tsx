
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import Stepper from "@/components/Stepper";
import StepNavigation from "@/components/StepNavigation";
import PromptCard, { PromptType } from "@/components/PromptCard";
import PromptEditor from "@/components/PromptEditor";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

// Initial prompts data
const initialPrompts: PromptType[] = [
  {
    id: "1",
    title: "Vidéo historique YouTube",
    content: "Contexte : Tu es un expert en recherche avancée sur Internet...",
  },
  {
    id: "2",
    title: "Guide conceptuel simple",
    content: "Contexte : Tu es un expert en pédagogie capable de simplifier des concepts complexes...",
  },
];

type PromptSelectorProps = {
  selectedPrompt: PromptType | null;
  setSelectedPrompt: (prompt: PromptType | null) => void;
  onNext: () => void;
  onPrevious: () => void;
};

const PromptSelector = ({ selectedPrompt, setSelectedPrompt, onNext, onPrevious }: PromptSelectorProps) => {
  const [prompts, setPrompts] = useState<PromptType[]>(initialPrompts);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptType | null>(null);

  // Load saved prompts from localStorage
  useEffect(() => {
    const savedPrompts = localStorage.getItem("contentCreationPrompts");
    if (savedPrompts) {
      setPrompts(JSON.parse(savedPrompts));
    }
  }, []);

  // Save prompts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("contentCreationPrompts", JSON.stringify(prompts));
  }, [prompts]);

  const handleSelectPrompt = (prompt: PromptType) => {
    setSelectedPrompt(prompt);
  };

  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setIsEditorOpen(true);
  };

  const handleEditPrompt = (prompt: PromptType) => {
    setEditingPrompt(prompt);
    setIsEditorOpen(true);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter((p) => p.id !== id));
    if (selectedPrompt?.id === id) {
      setSelectedPrompt(null);
    }
    toast.success("Modèle supprimé avec succès");
  };

  const handleSavePrompt = (prompt: PromptType) => {
    if (editingPrompt) {
      // Edit existing prompt
      setPrompts(prompts.map((p) => (p.id === prompt.id ? prompt : p)));
      
      // Update selected prompt if it was edited
      if (selectedPrompt?.id === prompt.id) {
        setSelectedPrompt(prompt);
      }
      
      toast.success("Modèle modifié avec succès");
    } else {
      // Add new prompt
      setPrompts([...prompts, prompt]);
      toast.success("Nouveau modèle créé avec succès");
    }
  };

  const handleNext = () => {
    if (!selectedPrompt) {
      toast.error("Veuillez sélectionner un modèle");
      return;
    }
    onNext();
  };

  return (
    <Layout>
      <Stepper
        steps={["Thématique", "Prompt", "Narratif", "Envoi"]}
        currentStep={1}
      />
      
      <Header 
        title="Choisissez un modèle de prompt" 
        subtitle="Sélectionnez un modèle existant ou créez-en un nouveau"
      />
      
      <div className="w-full">
        <Button 
          onClick={handleAddPrompt} 
          className="mb-6 btn-ghost flex items-center gap-2"
        >
          <PlusCircle size={18} /> Créer un nouveau modèle
        </Button>
      
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                selected={selectedPrompt?.id === prompt.id}
                onSelect={handleSelectPrompt}
                onEdit={handleEditPrompt}
                onDelete={handleDeletePrompt}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        <StepNavigation
          onPrevious={onPrevious}
          onNext={handleNext}
          isNextDisabled={!selectedPrompt}
        />
      </div>
      
      <PromptEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSavePrompt}
        editingPrompt={editingPrompt}
      />
    </Layout>
  );
};

export default PromptSelector;
