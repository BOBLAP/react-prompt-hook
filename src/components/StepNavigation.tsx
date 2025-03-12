
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type StepNavigationProps = {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  isLastStep?: boolean;
};

const StepNavigation = ({
  onPrevious,
  onNext,
  isPreviousDisabled = false,
  isNextDisabled = false,
  isLastStep = false,
}: StepNavigationProps) => {
  return (
    <motion.div
      className="flex justify-between mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        className="flex items-center gap-2 btn-ghost"
      >
        <ArrowLeft size={16} /> Précédent
      </Button>
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className={isLastStep ? "bg-accent hover:bg-accent/90 btn-accent" : "btn-primary"}
      >
        {isLastStep ? "Envoyer" : "Suivant"} <ArrowRight size={16} className="ml-2" />
      </Button>
    </motion.div>
  );
};

export default StepNavigation;
