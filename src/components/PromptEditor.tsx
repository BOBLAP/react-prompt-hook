
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PromptType } from "./PromptCard";

type PromptEditorProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: PromptType) => void;
  editingPrompt: PromptType | null;
};

const PromptEditor = ({ isOpen, onClose, onSave, editingPrompt }: PromptEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingPrompt) {
      setTitle(editingPrompt.title);
      setContent(editingPrompt.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingPrompt, isOpen]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    if (!content.trim()) {
      toast.error("Le contenu est requis");
      return;
    }

    onSave({
      id: editingPrompt?.id || crypto.randomUUID(),
      title,
      content,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-panel border-primary/20 animate-fade-in">
        <DialogHeader>
          <DialogTitle>{editingPrompt ? "Modifier le prompt" : "Créer un nouveau prompt"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titre
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du modèle"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Contenu
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu du modèle..."
              className="textarea-field min-h-[200px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} className="btn-primary">
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptEditor;
