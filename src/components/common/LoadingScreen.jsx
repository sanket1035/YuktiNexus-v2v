import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-luxury-cream-50 dark:bg-luxury-purple-950 transition-colors duration-500">
      <div className="relative flex items-center justify-center">
        {/* Soft Radial Glows */}
        <div className="absolute w-32 h-32 rounded-full bg-luxury-peach/25 blur-xl animate-pulse-slow"></div>
        <div className="absolute w-24 h-24 rounded-full bg-luxury-purple-300/20 blur-lg animate-float"></div>

        {/* Premium Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-[3px] border-luxury-cream-200 border-t-luxury-purple-700 dark:border-luxury-purple-800/80 dark:border-t-luxury-peach"
        ></motion.div>

        {/* Core Logo Placeholder */}
        <div className="absolute text-xs font-bold tracking-widest font-sans uppercase text-luxury-purple-700 dark:text-luxury-peach">
          SR
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 text-sm font-semibold tracking-widest uppercase font-sans text-luxury-purple-800/60 dark:text-luxury-peach/60"
      >
        SheRise AI
      </motion.p>
    </div>
  );
};
