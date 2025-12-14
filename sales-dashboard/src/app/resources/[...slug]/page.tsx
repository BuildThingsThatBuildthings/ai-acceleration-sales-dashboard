import { getFileContent, getFilesInFolder, getBreadcrumbs, extractHeadings } from '@/lib/resources';
import Link from 'next/link';
import { FileText, Folder, ChevronRight } from 'lucide-react';
import MarkdownRenderer from '@/components/resources/MarkdownRenderer';
import TableOfContents from '@/components/resources/TableOfContents';

export default async function ResourcePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const pathStr = slug.join('/');
  const breadcrumbs = getBreadcrumbs(pathStr);

  // Check if it's a file or folder
  const isFile = pathStr.endsWith('.md');

  if (isFile) {
    // Render document
    const file = getFileContent(pathStr);

    if (!file) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-2">File Not Found</h1>
            <p className="text-neutral-400">The requested document does not exist.</p>
            <Link href="/resources" className="inline-block mt-4 text-blue-400 hover:text-blue-300">
              ← Back to Resources
            </Link>
          </div>
        </div>
      );
    }

    // Extract headings for TOC
    const headings = extractHeadings(file.content);

    return (
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-4 h-4 text-neutral-600" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-white font-medium">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="text-neutral-400 hover:text-white transition-colors">
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Document Header */}
        <header className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-neutral-800 rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{file.title}</h1>
              <p className="text-neutral-400 text-sm mt-1">Sales System Documentation</p>
            </div>
          </div>
        </header>

        {/* Mobile TOC */}
        <TableOfContents headings={headings} variant="mobile" />

        {/* Main Content with Desktop TOC Sidebar */}
        <div className="flex gap-8">
          {/* Article Content */}
          <article className="flex-1 min-w-0 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-5 md:p-8 lg:p-10">
              <MarkdownRenderer content={file.content} />
            </div>
          </article>

          {/* Desktop TOC Sidebar */}
          <div className="hidden lg:block">
            <TableOfContents headings={headings} variant="desktop" />
          </div>
        </div>
      </div>
    );
  }

  // Render folder view
  const files = getFilesInFolder(pathStr);
  const folderName = slug[slug.length - 1].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.path} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="w-4 h-4 text-neutral-600" />}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-white font-medium">{crumb.name}</span>
            ) : (
              <Link href={crumb.path} className="text-neutral-400 hover:text-white transition-colors">
                {crumb.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Folder Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{folderName}</h1>
        <p className="text-neutral-400">{files.length} document{files.length !== 1 ? 's' : ''}</p>
      </header>

      {/* File List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
        {files.map((item) => (
          <Link
            key={item.path}
            href={`/resources/${item.path}`}
            className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-colors group"
          >
            {item.type === 'folder' ? (
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Folder className="w-5 h-5 text-amber-400" />
              </div>
            ) : (
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
            )}
            <span className="flex-1 font-medium text-neutral-200 group-hover:text-white transition-colors">
              {item.name}
            </span>
            <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
          </Link>
        ))}

        {files.length === 0 && (
          <div className="p-8 text-center text-neutral-500">
            No documents in this folder
          </div>
        )}
      </div>
    </div>
  );
}
