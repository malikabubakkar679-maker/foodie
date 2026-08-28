import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatWindow } from '@/components/chat/ChatWindow';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-white border border-foodie-border flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow-soft shadow-xs transition-all shrink-0 active:scale-95"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foodie-charcoal tracking-tight">
            Customer Support Chat 💬
          </h2>
          <p className="text-xs sm:text-sm text-foodie-muted mt-0.5">
            Instant answers to queries regarding deliveries, ingredients, and coupons
          </p>
        </div>
      </div>

      <ChatWindow />
    </div>
  );
};
