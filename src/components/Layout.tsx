
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="animated-gradient-bg min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div 
        className="mb-6 relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 via-teal-300 to-cyan-400 flex items-center justify-center alien-gradient animate-gradient-flow relative">
          <Rocket className="text-black w-16 h-16 z-10 relative" strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-400 blur-xl opacity-50 animate-pulse-gentle"></div>
      </motion.div>
      
      <motion.div
        className="w-full max-w-4xl glass-panel rounded-3xl p-6 md:p-10 shadow-lg backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.5)",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Layout;
