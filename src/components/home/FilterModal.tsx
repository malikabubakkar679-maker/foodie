import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useFoodStore } from '@/store/useFoodStore';
import { formatCurrency, cn } from '@/lib/utils';

export const FilterModal: React.FC = () => {
  const {
    isFilterModalOpen,
    closeFilterModal,
    filterVeg,
    setFilterVeg,
    filterSpicy,
    setFilterSpicy,
    filterMaxPrice,
    setFilterMaxPrice,
    filterMinRating,
    setFilterMinRating,
    resetFilters,
  } = useFoodStore();

  return (
    <Modal isOpen={isFilterModalOpen} onClose={closeFilterModal} title="Filter Menu">
      <div className="space-y-6">
        {/* Dietary Preferences */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal mb-3">
            Dietary Preferences
          </h4>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setFilterVeg(!filterVeg)}
              className={cn(
                'px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all',
                filterVeg
                  ? 'bg-emerald-50 border-emerald-400 text-foodie-green font-black shadow-sm'
                  : 'bg-white border-foodie-border text-foodie-charcoal hover:border-foodie-yellow'
              )}
            >
              🌱 100% Vegetarian
            </button>
            <button
              onClick={() => setFilterSpicy(!filterSpicy)}
              className={cn(
                'px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all',
                filterSpicy
                  ? 'bg-red-50 border-red-400 text-foodie-red font-black shadow-sm'
                  : 'bg-white border-foodie-border text-foodie-charcoal hover:border-foodie-yellow'
              )}
            >
              🌶️ Spicy Specials Only
            </button>
          </div>
        </div>

        {/* Max Price Range Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal">
              Maximum Price
            </h4>
            <strong className="text-sm font-black text-foodie-amber-dark">
              {formatCurrency(filterMaxPrice)}
            </strong>
          </div>
          <input
            type="range"
            min="5"
            max="35"
            step="1"
            value={filterMaxPrice}
            onChange={(e) => setFilterMaxPrice(parseFloat(e.target.value))}
            className="w-full accent-foodie-yellow h-2 bg-foodie-app rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-foodie-muted font-bold mt-1">
            <span>$5.00</span>
            <span>$35.00</span>
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-foodie-charcoal">
              Minimum Rating
            </h4>
            <strong className="text-sm font-black text-foodie-amber-dark">
              {filterMinRating > 0 ? `${filterMinRating.toFixed(1)}+ ⭐` : 'Any Rating'}
            </strong>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filterMinRating}
            onChange={(e) => setFilterMinRating(parseFloat(e.target.value))}
            className="w-full accent-foodie-yellow h-2 bg-foodie-app rounded-lg cursor-pointer"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-foodie-border">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            Reset Filters
          </Button>
          <Button onClick={closeFilterModal} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  );
};
