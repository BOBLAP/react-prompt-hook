
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWebhookSettings } from "@/hooks/useWebhookSettings";
import { useBasicAuth } from "@/hooks/useBasicAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Settings as SettingsIcon, Save, Lock, Webhook, Key, ArrowLeft, Check } from "lucide-react";

const Settings = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { credentials, updateCredentials } = useAuth();
  const { webhookUrl, updateWebhookUrl, testWebhook } = useWebhookSettings();
  
  // Form state
  const [newUsername, setNewUsername] = useState(credentials.username);
  const [newPassword, setNewPassword] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState(webhookUrl);
  const [isWebhookTesting, setIsWebhookTesting] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveCredentials = () => {
    if (!newUsername) {
      toast.error("Le nom d'utilisateur ne peut pas être vide");
      return;
    }
    
    if (newPassword) {
      updateCredentials(newUsername, newPassword);
      toast.success("Identifiants mis à jour avec succès");
      setNewPassword("");
    } else if (newUsername !== credentials.username) {
      updateCredentials(newUsername, credentials.password);
      toast.success("Nom d'utilisateur mis à jour avec succès");
    }
  };

  const handleSaveWebhook = () => {
    if (newWebhookUrl) {
      updateWebhookUrl(newWebhookUrl);
      toast.success("URL du webhook mise à jour avec succès");
    }
  };

  const handleTestWebhook = async () => {
    setIsWebhookTesting(true);
    const testData = { test: true, timestamp: new Date().toISOString() };
    
    try {
      const success = await testWebhook(testData);
      
      if (success) {
        toast.success("Le webhook fonctionne correctement");
      } else {
        toast.error("Échec du test du webhook");
      }
    } catch (error) {
      console.error("Error testing webhook:", error);
      toast.error("Erreur lors du test du webhook");
    } finally {
      setIsWebhookTesting(false);
    }
  };

  const handleReset = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    // Reset to defaults
    updateCredentials("bob", "1234");
    updateWebhookUrl("https://n8n.lagratte.net/webhook-test/aa5d0585-dc51-4609-a503-4837195fc08d");
    
    // Update form state
    setNewUsername("bob");
    setNewPassword("");
    setNewWebhookUrl("https://n8n.lagratte.net/webhook-test/aa5d0585-dc51-4609-a503-4837195fc08d");
    
    setIsResetConfirmOpen(false);
    toast.success("Paramètres réinitialisés avec succès");
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <SettingsIcon className="h-5 w-5" /> Paramètres
            </SheetTitle>
            <SheetDescription>
              Configurez les paramètres de l'application
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-8">
            {/* Authentication Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Lock className="h-5 w-5" /> Authentification
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Nouveau nom d'utilisateur"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Mot de passe {" "}
                    <span className="text-muted-foreground text-xs">(Laisser vide pour ne pas changer)</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleSaveCredentials}
                >
                  <Save className="mr-2 h-4 w-4" /> Enregistrer les identifiants
                </Button>
              </div>
            </div>
            
            {/* Webhook Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Webhook className="h-5 w-5" /> Configuration du Webhook
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">URL du Webhook</Label>
                  <Textarea
                    id="webhookUrl"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    placeholder="URL du webhook"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={handleTestWebhook}
                    disabled={isWebhookTesting}
                  >
                    {isWebhookTesting ? (
                      <>Teste en cours...</>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" /> Tester le webhook
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    className="flex-1" 
                    onClick={handleSaveWebhook}
                  >
                    <Save className="mr-2 h-4 w-4" /> Enregistrer l'URL
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Reset Settings */}
            <div className="pt-4 border-t">
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleReset}
              >
                Réinitialiser tous les paramètres
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Reset Confirmation Dialog */}
      <AlertDialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser les paramètres</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ?
              <br /><br />
              Identifiants par défaut : <br />
              - Nom d'utilisateur : bob<br />
              - Mot de passe : 1234
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>
              Réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Settings;
