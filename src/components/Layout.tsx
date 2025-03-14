
import { ReactNode } from "react";
import { motion } from "framer-motion";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="animated-gradient-bg min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
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
