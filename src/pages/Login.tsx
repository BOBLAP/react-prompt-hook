
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, User, LogIn } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = login(username, password);
    
    if (success) {
      toast.success("Connexion réussie");
      navigate("/");
    } else {
      setError("Identifiants incorrects. Veuillez réessayer.");
      toast.error("Échec de connexion");
    }
  };

  return (
    <div className="animated-gradient-bg min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md glass-panel rounded-3xl p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <Lock className="mx-auto h-12 w-12 text-primary mb-3" />
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-muted-foreground mt-1">Veuillez vous connecter pour continuer</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full btn-accent py-6">
            <LogIn className="mr-2 h-4 w-4" /> Se connecter
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
