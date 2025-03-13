
import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import Stepper from "@/components/Stepper";
import StepNavigation from "@/components/StepNavigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PromptType } from "@/components/PromptCard";
import { useBasicAuth } from "@/hooks/useBasicAuth";

type DataSubmissionProps = {
  theme: string;
  selectedPrompt: PromptType | null;
  selectedNarrative: PromptType | null;
  onPrevious: () => void;
  onReset: () => void;
};

type SubmissionState = "idle" | "loading" | "success" | "error";

const DataSubmission = ({
  theme,
  selectedPrompt,
  selectedNarrative,
  onPrevious,
  onReset,
}: DataSubmissionProps) => {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [response, setResponse] = useState<any>(null);
  const { generateBasicAuth } = useBasicAuth();

  const handleSubmit = async () => {
    if (!selectedPrompt || !selectedNarrative) {
      toast.error("Données manquantes pour l'envoi");
      return;
    }

    setSubmissionState("loading");

    try {
      const payload = {
        theme,
        prompt: selectedPrompt,
        narrative: selectedNarrative,
      };

      // Generate Basic Auth token for authentication
      const authHeader = generateBasicAuth();

      const url = import.meta.env.PROD 
        ? "https://n8n.lagratte.net/webhook/aa5d0585-dc51-4609-a503-4837195fc08d"
        : "https://n8n.lagratte.net/webhook-test/aa5d0585-dc51-4609-a503-4837195fc08d";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader || '',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResponse(data);
      
      if (response.ok) {
        setSubmissionState("success");
        toast.success("Demande envoyée avec succès");
      } else {
        setSubmissionState("error");
        toast.error("Erreur lors de l'envoi de la demande");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setSubmissionState("error");
      toast.error("Erreur de connexion au serveur");
    }
  };

  const renderSubmissionStatus = () => {
    switch (submissionState) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 size={48} className="text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Envoi en cours...</p>
          </div>
        );
      case "success":
        return (
          <motion.div 
            className="flex flex-col items-center justify-center py-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle size={48} className="text-green-500 mb-4" />
            <p className="text-xl font-medium mb-2">Envoi réussi!</p>
            <p className="text-muted-foreground mb-6">Votre demande a été traitée avec succès.</p>
            <Button onClick={onReset} className="btn-primary">Nouvelle demande</Button>
          </motion.div>
        );
      case "error":
        return (
          <motion.div 
            className="flex flex-col items-center justify-center py-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle size={48} className="text-destructive mb-4" />
            <p className="text-xl font-medium mb-2">Erreur lors de l'envoi</p>
            <p className="text-muted-foreground mb-6">Une erreur est survenue, veuillez réessayer.</p>
            <div className="flex gap-4">
              <Button onClick={() => setSubmissionState("idle")} variant="outline">Réessayer</Button>
              <Button onClick={onReset} className="btn-primary">Nouvelle demande</Button>
            </div>
          </motion.div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Récapitulatif de votre demande</h3>
              
              <Card className="glass-panel">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-primary mb-1">Thématique</h4>
                    <p className="text-sm text-muted-foreground">{theme}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-primary mb-1">Modèle de prompt</h4>
                    <p className="text-sm font-medium">{selectedPrompt?.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedPrompt?.content}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-primary mb-1">Modèle de narratif</h4>
                    <p className="text-sm font-medium">{selectedNarrative?.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedNarrative?.content}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Button 
              onClick={handleSubmit} 
              className="w-full btn-accent py-6"
            >
              Envoyer la demande
            </Button>
          </div>
        );
    }
  };

  return (
    <Layout>
      <Stepper
        steps={["Thématique", "Prompt", "Narratif", "Envoi"]}
        currentStep={3}
      />
      
      <Header 
        title="Envoyer votre demande" 
        subtitle="Vérifiez les informations et confirmez l'envoi"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {renderSubmissionStatus()}
        
        {submissionState === "idle" && (
          <StepNavigation
            onPrevious={onPrevious}
            onNext={handleSubmit}
            isLastStep={true}
          />
        )}
      </motion.div>
    </Layout>
  );
};

export default DataSubmission;
