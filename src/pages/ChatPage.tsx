import React from 'react';
import { ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChatWindow } from '@/components/chat/ChatWindow';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4 w-full max-w-5xl mx-auto select-none"
    >
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow shadow-xs transition-all shrink-0"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-foodie-charcoal tracking-tight flex items-center gap-2">
            <span>Customer Support Chat</span>
            <span>💬</span>
          </h1>
          <p className="text-xs sm:text-sm text-foodie-muted font-bold mt-0.5">
            Instant 24/7 AI Foodie Assistant for order status, recipes, and discounts
          </p>
        </div>
      </div>

      <ChatWindow />
    </motion.div>
  );
};

