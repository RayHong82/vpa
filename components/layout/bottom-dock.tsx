"use client";

import { motion } from "framer-motion";
import { MessageSquare, Calculator, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const dockItems = [
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: Calculator, label: "Planner", href: "/planner" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function BottomDock() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200/50 dark:border-gray-800/50 safe-area-inset-bottom"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-20 max-w-md mx-auto">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="apple-interactive flex flex-col items-center justify-center space-y-1 px-6 py-2 rounded-xl"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-200 dark:bg-gray-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </motion.div>
                <span
                  className={`text-xs font-medium ${
                    isActive
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

