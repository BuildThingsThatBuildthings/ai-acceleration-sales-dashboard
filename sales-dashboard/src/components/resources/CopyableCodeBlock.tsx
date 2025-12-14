'use client';

import { useState, ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyableCodeBlockProps {
  children: ReactNode;
  className?: string;
}

export default function CopyableCodeBlock({ children, className }: CopyableCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const extractText = (node: ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && typeof node === 'object' && 'props' in node) {
      return extractText((node as { props: { children?: ReactNode } }).props.children);
    }
    return '';
  };

  const handleCopy = async () => {
    const text = extractText(children);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <pre className={`bg-neutral-950 border border-neutral-800 rounded-xl p-4 overflow-x-auto text-sm ${className || ''}`}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5"
        title="Copy to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="text-xs">Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
