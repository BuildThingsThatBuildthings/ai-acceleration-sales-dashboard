import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft, FileText, ShieldAlert, Zap, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ResourceViewer({ filename, title }: { filename: string, title: string }) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'resources', filename);
  
  let content = 'File not found.';
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.error(`Could not read resource: ${filePath}`, e);
    content = '# Error\nCould not load resource file. Ensure it exists in src/data/resources.';
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">
      <Link href="/resources" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors text-sm font-medium group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Resources
      </Link>
      
      <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="border-b border-neutral-800 bg-neutral-900/80 p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
           <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
             <FileText className="w-8 h-8 text-blue-400" />
           </div>
           <div>
             <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">{title}</h1>
             <p className="text-neutral-400 font-medium">Internal Sales Asset • 2025 Edition</p>
           </div>
        </div>
        
        {/* Content */}
        <div className="p-8 md:p-12">
          <article className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white prose-li:text-neutral-300">
            <ReactMarkdown
              components={{
                // H1 - Title Styled (though usually we skip H1 in content if header exists)
                h1: ({node, ...props}) => <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 mb-8 pb-4 border-b border-neutral-800" {...props} />,
                
                // H2 - Section Headers
                h2: ({node, ...props}) => (
                  <div className="mt-12 mb-6 flex items-center gap-3">
                    <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white m-0" {...props} />
                  </div>
                ),

                // H3 - Sub-sections
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-blue-200 mt-8 mb-4 flex items-center gap-2" {...props} />,

                // Blockquotes -> Callout Cards
                blockquote: ({children}) => (
                  <div className="bg-blue-900/10 border-l-4 border-blue-500 p-6 my-8 rounded-r-xl italic text-blue-100/90 shadow-sm relative">
                    <div className="absolute -top-3 -left-3 bg-neutral-900 p-1 rounded-full border border-blue-900/50">
                        <Zap className="w-4 h-4 text-blue-400" />
                    </div>
                    {children}
                  </div>
                ),

                // Lists
                ul: ({node, ...props}) => <ul className="space-y-2 my-6 pl-4" {...props} />,
                li: ({node, ...props}) => (
                  <li className="flex gap-3 text-neutral-300">
                    <span className="text-blue-500/50 mt-1.5">•</span>
                    <span className="flex-1" {...props} />
                  </li>
                ),

                // Paragraphs
                p: ({node, ...props}) => <p className="leading-relaxed text-neutral-300 text-lg mb-6" {...props} />,

                // Strong/Bold
                strong: ({node, ...props}) => <strong className="font-bold text-white bg-white/5 py-0.5 px-1.5 rounded mx-0.5" {...props} />,

                // Horizontal Rule
                hr: ({node, ...props}) => <hr className="border-neutral-800 my-12" {...props} />
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
