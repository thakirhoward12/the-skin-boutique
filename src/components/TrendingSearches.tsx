import React from 'react';
import { Search } from 'lucide-react';

const TRENDS = ['Medicube', 'Retinol', 'Glass Skin', 'SPF', 'Centella', 'Vegan'];

export default function TrendingSearches({
  onSelectTrend
}: {
  onSelectTrend: (trend: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <div className="flex items-center text-ink-500 mr-2 text-sm font-medium">
        <Search className="w-4 h-4 mr-2" />
        Trending Searches:
      </div>
      {TRENDS.map((trend) => (
        <button
          key={trend}
          onClick={() => onSelectTrend(trend)}
          className="px-4 py-1.5 rounded-full text-xs font-medium bg-pastel-pink-light/30 text-ink-700 hover:bg-pastel-pink-dark hover:text-white transition-colors border border-pastel-pink-dark/20 hover:border-pastel-pink-dark"
        >
          {trend}
        </button>
      ))}
    </div>
  );
}
