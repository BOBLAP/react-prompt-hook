
import { ReactNode } from "react";
import { motion } from "framer-motion";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="animated-gradient-bg min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        className="w-full max-w-4xl glass-panel rounded-3xl p-6 md:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Layout;
