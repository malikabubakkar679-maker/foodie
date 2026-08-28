import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="hidden md:block bg-foodie-charcoal text-white mt-auto border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍔</span>
              <span className="text-2xl font-black tracking-tight text-foodie-yellow">Foodie.</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Delivering artisan stone-baked pizza, smash burgers, crispy chicken, and mouth-watering meals right to your doorstep in minutes.
            </p>
            <div className="flex gap-4 text-xs font-bold text-zinc-400">
              <a href="#" className="hover:text-foodie-yellow transition-colors">Instagram</a>
              <a href="#" className="hover:text-foodie-yellow transition-colors">Twitter</a>
              <a href="#" className="hover:text-foodie-yellow transition-colors">Facebook</a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Explore Menu</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link to="/?cat=pizza" className="hover:text-foodie-yellow transition-colors">Artisan Pizza</Link></li>
              <li><Link to="/?cat=burgers" className="hover:text-foodie-yellow transition-colors">Smash Burgers</Link></li>
              <li><Link to="/?cat=pasta" className="hover:text-foodie-yellow transition-colors">Truffle Pasta</Link></li>
              <li><Link to="/?cat=chicken" className="hover:text-foodie-yellow transition-colors">Crispy Chicken</Link></li>
              <li><Link to="/?cat=desserts" className="hover:text-foodie-yellow transition-colors">Sweet Desserts</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Customer Care</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link to="/chat" className="hover:text-foodie-yellow transition-colors">Live Support Chat</Link></li>
              <li><Link to="/orders" className="hover:text-foodie-yellow transition-colors">Track Active Order</Link></li>
              <li><a href="#" className="hover:text-foodie-yellow transition-colors">Delivery Locations</a></li>
              <li><a href="#" className="hover:text-foodie-yellow transition-colors">FAQ & Help Center</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Legal & Company</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-foodie-yellow transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foodie-yellow transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foodie-yellow transition-colors">Cookie Preferences</a></li>
              <li><a href="#" className="hover:text-foodie-yellow transition-colors">Careers at Foodie</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
          <p>© 2026 Foodie Delivery Technologies Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
