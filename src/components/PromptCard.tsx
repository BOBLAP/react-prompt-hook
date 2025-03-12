
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Check } from "lucide-react";

export type PromptType = {
  id: string;
  title: string;
  content: string;
};

type PromptCardProps = {
  prompt: PromptType;
  selected?: boolean;
  onSelect: (prompt: PromptType) => void;
  onEdit: (prompt: PromptType) => void;
  onDelete: (id: string) => void;
};

const PromptCard = ({ prompt, selected, onSelect, onEdit, onDelete }: PromptCardProps) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${selected ? "prompt-card selected" : "prompt-card"}`}
      onClick={() => onSelect(prompt)}
    >
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-semibold text-primary">{prompt.title}</CardTitle>
          <CardDescription className="text-sm">
            {prompt.content.length > 60 ? `${prompt.content.substring(0, 60)}...` : prompt.content}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-2">
          <div className="flex space-x-2 mt-2">
            {selected && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                <Check size={14} className="mr-1" /> Sélectionné
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-0 pt-2 pb-0 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(prompt);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-rose-500 border-rose-500/30 hover:bg-rose-500/10 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prompt.id);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PromptCard;
