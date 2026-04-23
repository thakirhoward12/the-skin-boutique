import React from 'react';
import { motion } from 'motion/react';

const CONCERNS = [
  { id: 'All', label: 'All Concerns' },
  { id: 'acne', label: 'Acne & Blemishes' },
  { id: 'dark spots', label: 'Dark Spots' },
  { id: 'dryness', label: 'Dryness' },
  { id: 'pigmentation', label: 'Pigmentation' },
  { id: 'oiliness', label: 'Oiliness' },
  { id: 'anti-aging', label: 'Anti-Aging' },
  { id: 'redness', label: 'Redness & Irritation' },
];

export default function SkinConcernFilter({
  selectedConcern,
  onSelectConcern
}: {
  selectedConcern: string;
  onSelectConcern: (concern: string) => void;
}) {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-3 min-w-max">
        {CONCERNS.map((concern) => {
          const isSelected = selectedConcern === concern.id || (selectedConcern === '' && concern.id === 'All');
          return (
            <button
              key={concern.id}
              onClick={() => onSelectConcern(concern.id === 'All' ? '' : concern.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 border ${
                isSelected
                  ? 'bg-ink-900 border-ink-900 text-white shadow-md'
                  : 'bg-white border-ink-200 text-ink-600 hover:border-pastel-pink-dark hover:text-pastel-pink-dark'
              }`}
            >
              {concern.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
