'use client';

import { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';
import type { Heading } from '@/lib/resources';

interface TableOfContentsProps {
  headings: Heading[];
  variant?: 'mobile' | 'desktop' | 'both';
}

export default function TableOfContents({ headings, variant = 'both' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setIsExpanded(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile: Collapsible */}
      {(variant === 'mobile' || variant === 'both') && (
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm font-medium text-neutral-300"
        >
          <span className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Table of Contents
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <nav className="mt-2 p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      heading.level === 3 ? 'pl-6' : ''
                    } ${
                      activeId === heading.id
                        ? 'bg-blue-600/20 text-blue-400 font-medium'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      )}

      {/* Desktop: Sticky Sidebar */}
      {(variant === 'desktop' || variant === 'both') && (
      <nav className="hidden lg:block sticky top-24 w-64 shrink-0 max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
            <List className="w-4 h-4" />
            On this page
          </h4>
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-all ${
                    heading.level === 3 ? 'pl-5 text-xs' : ''
                  } ${
                    activeId === heading.id
                      ? 'bg-blue-600/20 text-blue-400 font-medium border-l-2 border-blue-500'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      )}
    </>
  );
}
