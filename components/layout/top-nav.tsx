"use client";

import { motion } from "framer-motion";

export function TopNav() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">SG Prop-Agent</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Add navigation items here */}
        </div>
      </div>
    </motion.nav>
  );
}

