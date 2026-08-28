import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types/food.types';

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Hi there! 👋 Welcome to Foodie Assistant. How can I help you today with your order status, menu recommendations, or promo codes?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Automated intelligent bot response
    setTimeout(() => {
      let reply = "Thanks for reaching out! Our kitchen and support team are looking into your request right now.";
      const lower = text.toLowerCase();

      if (lower.includes('order') || lower.includes('where') || lower.includes('status') || lower.includes('track')) {
        reply = 'Your active order #FD-8492 is currently Out for Delivery with live GPS courier tracking. Estimated arrival: ~18 minutes! 🛵';
      } else if (lower.includes('pizza') || lower.includes('recommend') || lower.includes('best') || lower.includes('menu')) {
        reply = 'We highly recommend our Artisan Double Pepperoni Feast or Margherita Classica! Handcrafted with stone-baked crusts and 100% Buffalo mozzarella. 🍕';
      } else if (lower.includes('code') || lower.includes('coupon') || lower.includes('discount') || lower.includes('promo')) {
        reply = 'Use promo code FOODIE50 at checkout for 50% OFF your entire feast, or FREESHIP for free instant delivery! 🏷️';
      } else if (lower.includes('vegan') || lower.includes('veg') || lower.includes('salad')) {
        reply = 'We have delicious 100% vegetarian options like the Garden Veggie Supreme Pizza, Truffle Fettuccine Alfredo, and Crispy Herb Fries! 🌱';
      } else if (lower.includes('burger')) {
        reply = 'Try our Prime Angus Smash Burger with melted aged cheddar and secret smoked burger sauce on toasted brioche! 🍔';
      }

      const botMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'bot',
        text: reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <div className="w-full bg-white/85 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-230px)] min-h-[460px] sm:min-h-[560px] max-h-[700px] select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-foodie-yellow-soft/80 via-white/80 to-foodie-yellow-soft/60 border-b border-foodie-border/60">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-foodie-yellow text-foodie-charcoal flex items-center justify-center text-xl shadow-xs font-black">
            👩‍🍳
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-foodie-green rounded-full border-2 border-white shadow-xs" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-foodie-charcoal">Foodie AI Concierge</h4>
            <span className="text-[11px] font-bold text-foodie-green flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-foodie-green animate-ping" />
              Online • Instant smart replies under 1 sec
            </span>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-foodie-charcoal text-white font-bold rounded-br-xs'
                    : 'bg-white/95 text-foodie-charcoal font-bold rounded-bl-xs border border-white/80'
                }`}
              >
                <p>{m.text}</p>
                <span className={`text-[10px] block text-right mt-1.5 font-semibold ${m.sender === 'user' ? 'text-white/60' : 'text-foodie-muted'}`}>
                  {m.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 p-3.5 bg-white/90 rounded-2xl rounded-bl-none border border-white/80 w-fit shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-foodie-amber-dark animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-foodie-amber-dark animate-bounce [animation-delay:0.15s]" />
            <span className="w-2 h-2 rounded-full bg-foodie-amber-dark animate-bounce [animation-delay:0.3s]" />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-foodie-app/70 border-t border-foodie-border/60 overflow-x-auto scrollbar-none">
        <Sparkles className="w-4 h-4 text-foodie-amber-dark shrink-0" />
        {[
          'Where is my order? 🛵',
          'Best pizza recommendation? 🍕',
          'Active discount codes? 🏷️',
          'Smash burger details? 🍔',
          'Vegetarian options? 🌱',
        ].map((q) => (
          <motion.button
            key={q}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendMessage(q)}
            className="px-3.5 py-1.5 bg-white hover:bg-foodie-yellow hover:text-foodie-charcoal border border-foodie-border/60 rounded-full text-xs font-black text-foodie-charcoal shrink-0 transition-all shadow-2xs"
          >
            {q}
          </motion.button>
        ))}
      </div>

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2.5 p-3 sm:p-4 bg-white/95 border-t border-foodie-border/60"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about delicious meals, live orders, promos..."
          className="flex-1 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold bg-foodie-app/80 border border-foodie-border/80 rounded-2xl focus:outline-none focus:border-foodie-yellow focus:ring-2 focus:ring-foodie-yellow/20"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={!inputText.trim()}
          className="w-11 h-11 rounded-2xl bg-foodie-yellow flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow-dark transition-all shrink-0 shadow-sm disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </form>
    </div>
  );
};

