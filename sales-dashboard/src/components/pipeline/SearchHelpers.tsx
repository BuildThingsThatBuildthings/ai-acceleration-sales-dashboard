'use client';

import { ExternalLink, Search, Linkedin, Building2, Newspaper } from 'lucide-react';

interface SearchHelpersProps {
  company: string;
  city: string;
  state: string;
  website?: string;
}

export default function SearchHelpers({ company, city, state, website }: SearchHelpersProps) {
  const searches = [
    {
      label: 'Find Owner/Broker',
      icon: Search,
      query: `"${company}" ${city} owner OR president OR broker OR "managing broker"`,
      description: 'Look for team/about pages, LinkedIn profiles',
    },
    {
      label: 'LinkedIn Search',
      icon: Linkedin,
      query: `site:linkedin.com "${company}" ${city}`,
      description: 'Find decision makers on LinkedIn',
    },
    {
      label: 'Company News',
      icon: Newspaper,
      query: `"${company}" ${city} news OR award OR growth OR "million"`,
      description: 'Find achievements, awards, sales volume',
    },
    {
      label: 'About Page',
      icon: Building2,
      query: `site:${website?.replace(/^https?:\/\//, '').replace(/^www\./, '') || company.toLowerCase().replace(/\s+/g, '')} about OR team OR leadership`,
      description: 'Find team page on their website',
    },
  ];

  const openSearch = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-blue-400" />
        Research Helpers
      </h4>
      <div className="space-y-2">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => openSearch(search.query)}
            className="w-full flex items-center justify-between p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors group text-left"
          >
            <div className="flex items-center gap-3">
              <search.icon className="w-4 h-4 text-neutral-500 group-hover:text-blue-400" />
              <div>
                <span className="text-white text-sm font-medium">{search.label}</span>
                <p className="text-neutral-500 text-xs">{search.description}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-blue-400" />
          </button>
        ))}
      </div>

      {website && (
        <div className="mt-3 pt-3 border-t border-neutral-800">
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-blue-900/20 hover:bg-blue-900/30 rounded-lg transition-colors group"
          >
            <span className="text-blue-400 text-sm font-medium">Open Company Website</span>
            <ExternalLink className="w-4 h-4 text-blue-400" />
          </a>
        </div>
      )}
    </div>
  );
}
