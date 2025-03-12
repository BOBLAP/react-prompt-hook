
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type StepperProps = {
  steps: string[];
  currentStep: number;
};

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex flex-col items-center relative">
              {/* Step indicator */}
              <motion.div
                className={`flex items-center justify-center w-10 h-10 rounded-full 
                  ${isCompleted ? "bg-primary text-white" : isCurrent ? "bg-white border border-primary text-primary" : "bg-white/70 border border-gray-200 text-gray-400"}`}
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : index + 1}
              </motion.div>

              {/* Step label */}
              <motion.span
                className={`mt-2 text-xs ${isCompleted || isCurrent ? "text-primary font-medium" : "text-gray-400"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              >
                {step}
              </motion.span>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-10 w-[calc(100%-20px)] h-[2px]">
                  <motion.div
                    className="h-full bg-gray-200"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    style={{ transformOrigin: "left" }}
                  />
                  {isCompleted && (
                    <motion.div
                      className="h-full bg-primary absolute top-0 left-0"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
