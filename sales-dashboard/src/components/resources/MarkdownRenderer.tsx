'use client';

import { useState, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// Copyable code block component
function CodeBlock({ children, className }: { children: ReactNode; className?: string }) {
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
    <div className="relative group my-6">
      <pre className={`bg-neutral-950 border border-neutral-800 rounded-xl p-4 md:p-5 overflow-x-auto text-sm leading-relaxed ${className || ''}`}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 backdrop-blur-sm"
        title="Copy to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400 hidden sm:inline">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

// Smart blockquote that detects tips/warnings/examples
function SmartBlockquote({ children }: { children: ReactNode }) {
  const extractText = (node: ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && typeof node === 'object' && 'props' in node) {
      return extractText((node as { props: { children?: ReactNode } }).props.children);
    }
    return '';
  };

  const text = extractText(children);

  // Detect callout type and set styling
  let Icon = Info;
  let colors = 'border-blue-500/50 bg-blue-900/10';
  let iconColor = 'text-blue-400';

  if (text.toLowerCase().includes('tip:') || text.includes('💡')) {
    Icon = Lightbulb;
    colors = 'border-yellow-500/50 bg-yellow-900/10';
    iconColor = 'text-yellow-400';
  } else if (text.toLowerCase().includes('warning:') || text.includes('⚠️') || text.toLowerCase().includes('important:')) {
    Icon = AlertTriangle;
    colors = 'border-red-500/50 bg-red-900/10';
    iconColor = 'text-red-400';
  } else if (text.toLowerCase().includes('example:') || text.includes('✅') || text.toLowerCase().includes('why this works')) {
    Icon = CheckCircle;
    colors = 'border-green-500/50 bg-green-900/10';
    iconColor = 'text-green-400';
  }

  return (
    <blockquote className={`my-6 p-4 md:p-5 rounded-xl border-l-4 ${colors}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
        <div className="flex-1 text-neutral-300 [&>p]:m-0">
          {children}
        </div>
      </div>
    </blockquote>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Generate slug from text for heading IDs
  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings with IDs for TOC navigation
        h1: ({ children }) => (
          <h1 className="text-2xl md:text-3xl font-bold text-white border-b border-neutral-800 pb-4 mb-8">
            {children}
          </h1>
        ),
        h2: ({ children }) => {
          const text = typeof children === 'string' ? children : String(children);
          const id = slugify(text);
          return (
            <h2 id={id} className="text-xl md:text-2xl font-bold text-blue-300 mt-12 mb-4 scroll-mt-24">
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          const text = typeof children === 'string' ? children : String(children);
          const id = slugify(text);
          return (
            <h3 id={id} className="text-lg md:text-xl font-semibold text-neutral-200 mt-8 mb-3 scroll-mt-24">
              {children}
            </h3>
          );
        },
        h4: ({ children }) => (
          <h4 className="text-base md:text-lg font-semibold text-neutral-300 mt-6 mb-2">
            {children}
          </h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="text-neutral-300 leading-relaxed mb-4">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-5 mb-4 space-y-2 text-neutral-300 marker:text-neutral-600">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-5 mb-4 space-y-2 text-neutral-300 marker:text-neutral-500">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed pl-1">
            {children}
          </li>
        ),

        // Strong and emphasis
        strong: ({ children }) => (
          <strong className="text-white font-semibold">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="text-neutral-200 italic">
            {children}
          </em>
        ),

        // Inline code
        code: ({ className, children, ...props }) => {
          // Check if this is inside a pre tag (block code)
          const isBlock = className?.includes('language-');
          if (isBlock) {
            return <code className={`text-blue-300 ${className || ''}`} {...props}>{children}</code>;
          }
          return (
            <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-blue-300 text-sm font-mono">
              {children}
            </code>
          );
        },

        // Code blocks with copy button
        pre: ({ children }) => (
          <CodeBlock>{children}</CodeBlock>
        ),

        // Blockquotes with smart detection
        blockquote: ({ children }) => (
          <SmartBlockquote>{children}</SmartBlockquote>
        ),

        // Tables with mobile scroll
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto rounded-xl border border-neutral-700">
            <table className="min-w-full divide-y divide-neutral-700">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-neutral-800">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-neutral-800 bg-neutral-900/50">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-neutral-800/50 transition-colors">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-sm font-semibold text-white whitespace-nowrap">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-sm text-neutral-300">
            {children}
          </td>
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),

        // Horizontal rule
        hr: () => (
          <hr className="my-8 border-neutral-800" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
