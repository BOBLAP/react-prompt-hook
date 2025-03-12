
import { motion } from "framer-motion";

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
    </motion.div>
  );
};

export default Header;
