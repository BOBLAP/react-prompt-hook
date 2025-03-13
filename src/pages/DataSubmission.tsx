
import { useState } from "react";
import { useWebhookSettings } from "@/hooks/useWebhookSettings";
import { useBasicAuth } from "@/hooks/useBasicAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Send, FileText, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DataSubmissionProps = {
  theme: string;
  selectedPrompt: any;
  selectedNarrative: any;
  onPrevious: () => void;
  onReset: () => void;
};

const DataSubmission = ({
  theme,
  selectedPrompt,
  selectedNarrative,
  onPrevious,
  onReset,
}: DataSubmissionProps) => {
  const { webhookUrl, testWebhook } = useWebhookSettings();
  const { generateBasicAuth } = useBasicAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    status: "success" | "error" | null;
    message: string | null;
  }>({ status: null, message: null });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionResult({ status: null, message: null });

    const data = {
      theme,
      prompt: selectedPrompt?.text,
      narrative: selectedNarrative?.text,
    };

    try {
      const authHeader = generateBasicAuth();
      if (!authHeader) {
        setSubmissionResult({
          status: "error",
          message: "Échec de la génération de l'en-tête d'authentification"
        });
        toast({
          title: "Erreur d'authentification",
          description: "Impossible de générer l'en-tête d'authentification",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmissionResult({
          status: "success",
          message: "Données envoyées avec succès!"
        });
        toast({
          title: "Envoi réussi",
          description: "Vos données ont été envoyées avec succès",
          variant: "default",
        });
      } else {
        setSubmissionResult({
          status: "error",
          message: `Échec de l'envoi: ${response.statusText}`
        });
        toast({
          title: "Échec de l'envoi",
          description: `${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setSubmissionResult({
        status: "error",
        message: `Échec de l'envoi: ${error.message}`
      });
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="container mx-auto p-4 max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md">
        <CardHeader className="pb-0 pt-6">
          <CardTitle className="text-2xl font-bold text-center text-primary">Récapitulatif des données</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Veuillez vérifier vos informations avant de les soumettre
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-medium text-lg text-blue-700 mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Détails de la soumission
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/80 rounded-lg p-4 border border-blue-100 transition-all hover:shadow-md">
                  <p className="text-sm text-muted-foreground mb-1">Thème</p>
                  <p className="font-medium text-foreground">{theme}</p>
                </div>
                
                <div className="bg-white/80 rounded-lg p-4 border border-blue-100 transition-all hover:shadow-md">
                  <p className="text-sm text-muted-foreground mb-1">Prompt</p>
                  <p className="font-medium text-foreground">{selectedPrompt?.text}</p>
                </div>
                
                <div className="bg-white/80 rounded-lg p-4 border border-blue-100 transition-all hover:shadow-md">
                  <p className="text-sm text-muted-foreground mb-1">Narrative</p>
                  <p className="font-medium text-foreground">{selectedNarrative?.text}</p>
                </div>
              </div>
            </div>

            {submissionResult.status && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                submissionResult.status === "success" 
                  ? "bg-green-50 border border-green-200 text-green-700" 
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}>
                {submissionResult.status === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium">
                    {submissionResult.status === "success" ? "Succès" : "Erreur"}
                  </p>
                  <p className="text-sm opacity-90">{submissionResult.message}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={onPrevious}
                className="flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" /> Précédent
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onReset}
                  className="flex items-center gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <RefreshCw className="h-4 w-4" /> Réinitialiser
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Envoyer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataSubmission;
