
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

// Initial narrative prompts data
const initialNarrativePrompts: PromptType[] = [
  {
    id: "1",
    title: "Diapositive YouTube Histoire",
    content: "🔹 Contexte : Tu es un expert en storytelling et en écriture de scripts immersifs...",
  },
  {
    id: "2",
    title: "Format pédagogique interactif",
    content: "🔹 Contexte : Tu es un expert en conception de contenu pédagogique engageant...",
  },
];

type NarrativeSelectorProps = {
  selectedNarrative: PromptType | null;
  setSelectedNarrative: (prompt: PromptType | null) => void;
  onNext: () => void;
  onPrevious: () => void;
};

const NarrativeSelector = ({ 
  selectedNarrative, 
  setSelectedNarrative, 
  onNext, 
  onPrevious 
}: NarrativeSelectorProps) => {
  const [narrativePrompts, setNarrativePrompts] = useState<PromptType[]>(initialNarrativePrompts);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptType | null>(null);

  // Load saved narrative prompts from localStorage
  useEffect(() => {
    const savedPrompts = localStorage.getItem("contentCreationNarrativePrompts");
    if (savedPrompts) {
      setNarrativePrompts(JSON.parse(savedPrompts));
    }
  }, []);

  // Save narrative prompts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("contentCreationNarrativePrompts", JSON.stringify(narrativePrompts));
  }, [narrativePrompts]);

  const handleSelectPrompt = (prompt: PromptType) => {
    setSelectedNarrative(prompt);
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
    setNarrativePrompts(narrativePrompts.filter((p) => p.id !== id));
    if (selectedNarrative?.id === id) {
      setSelectedNarrative(null);
    }
    toast.success("Modèle de narratif supprimé avec succès");
  };

  const handleSavePrompt = (prompt: PromptType) => {
    if (editingPrompt) {
      // Edit existing prompt
      setNarrativePrompts(narrativePrompts.map((p) => (p.id === prompt.id ? prompt : p)));
      
      // Update selected narrative if it was edited
      if (selectedNarrative?.id === prompt.id) {
        setSelectedNarrative(prompt);
      }
      
      toast.success("Modèle de narratif modifié avec succès");
    } else {
      // Add new prompt
      setNarrativePrompts([...narrativePrompts, prompt]);
      toast.success("Nouveau modèle de narratif créé avec succès");
    }
  };

  const handleNext = () => {
    if (!selectedNarrative) {
      toast.error("Veuillez sélectionner un modèle de narratif");
      return;
    }
    onNext();
  };

  return (
    <Layout>
      <Stepper
        steps={["Thématique", "Prompt", "Narratif", "Envoi"]}
        currentStep={2}
      />
      
      <Header 
        title="Définissez le narratif" 
        subtitle="Choisissez un modèle de narratif pour structurer votre contenu"
      />
      
      <div className="w-full">
        <Button 
          onClick={handleAddPrompt} 
          className="mb-6 btn-ghost flex items-center gap-2"
        >
          <PlusCircle size={18} /> Créer un nouveau modèle de narratif
        </Button>
      
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {narrativePrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                selected={selectedNarrative?.id === prompt.id}
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
          isNextDisabled={!selectedNarrative}
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

export default NarrativeSelector;
