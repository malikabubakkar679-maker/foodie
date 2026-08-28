import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ChatMessage } from '@/types/food.types';

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Hi there! 👋 Welcome to Foodie. How can I help you today with your order or meal recommendations?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    // Automated intelligent bot response
    setTimeout(() => {
      let reply = "Thanks for asking! Our Foodie support team is looking into this.";
      const lower = text.toLowerCase();

      if (lower.includes('order') || lower.includes('where') || lower.includes('status')) {
        reply = 'Your active order #FD-8492 is currently Out for Delivery with courier Alex Rodriguez. Estimated arrival is in 15-20 minutes! 🛵';
      } else if (lower.includes('pizza') || lower.includes('recommend') || lower.includes('best')) {
        reply = 'We highly recommend our Double Pepperoni Feast or Margherita Classica! Handcrafted with stone-baked crusts and fresh mozzarella. 🍕';
      } else if (lower.includes('code') || lower.includes('coupon') || lower.includes('discount') || lower.includes('promo')) {
        reply = 'You can use promo code FOODIE50 for 50% OFF your first order or FREESHIP for zero delivery fee! 🏷️';
      } else if (lower.includes('vegan') || lower.includes('veg')) {
        reply = 'We have delicious vegetarian options like the Garden Veggie Supreme Pizza and Truffle Fettuccine Alfredo! 🌱';
      }

      const botMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'bot',
        text: reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 650);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-foodie-border rounded-3xl shadow-foodie-card overflow-hidden flex flex-col h-[580px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-foodie-yellow-soft border-b border-foodie-border">
        <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
          👩‍🍳
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-foodie-green rounded-full border-2 border-white" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-foodie-charcoal">Foodie Support Assistant</h4>
          <span className="text-[11px] font-bold text-foodie-green">Online • Instant automated replies</span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-foodie-yellow text-foodie-charcoal font-semibold rounded-br-none shadow-sm'
                  : 'bg-foodie-app text-foodie-charcoal rounded-bl-none border border-foodie-border'
              }`}
            >
              <p>{m.text}</p>
              <span className="text-[10px] text-foodie-muted block text-right mt-1 font-normal">
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 px-4 py-2 bg-foodie-cream border-t border-foodie-border overflow-x-auto scrollbar-none">
        <Sparkles className="w-3.5 h-3.5 text-foodie-amber-dark shrink-0" />
        {[
          'Where is my order? 🛵',
          'Best pizza recommendation? 🍕',
          'Active discount codes? 🏷️',
          'Vegetarian options? 🌱',
        ].map((q) => (
          <button
            key={q}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 bg-white hover:bg-foodie-yellow-soft border border-foodie-border rounded-full text-[11px] font-bold text-foodie-charcoal shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-3 bg-white border-t border-foodie-border"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about food, orders, delivery..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-foodie-app border border-foodie-border rounded-full focus:outline-none focus:border-foodie-yellow"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-foodie-yellow flex items-center justify-center text-foodie-charcoal hover:bg-foodie-yellow-dark transition-colors shrink-0 shadow-sm"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
