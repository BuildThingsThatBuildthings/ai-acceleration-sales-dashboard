import { getFolders, getRootFiles } from '@/lib/resources';
import Link from 'next/link';
import { Folder, FileText, ChevronRight, BookOpen } from 'lucide-react';

const FOLDER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: 'bg-blue-900/20', border: 'border-blue-800/50', text: 'text-blue-400' },
  red: { bg: 'bg-red-900/20', border: 'border-red-800/50', text: 'text-red-400' },
  green: { bg: 'bg-green-900/20', border: 'border-green-800/50', text: 'text-green-400' },
  purple: { bg: 'bg-purple-900/20', border: 'border-purple-800/50', text: 'text-purple-400' },
  orange: { bg: 'bg-orange-900/20', border: 'border-orange-800/50', text: 'text-orange-400' },
  cyan: { bg: 'bg-cyan-900/20', border: 'border-cyan-800/50', text: 'text-cyan-400' },
  gray: { bg: 'bg-neutral-800/50', border: 'border-neutral-700', text: 'text-neutral-400' },
};

export default function ResourcesHub() {
  const folders = getFolders();
  const rootFiles = getRootFiles();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Sales System</h1>
            <p className="text-neutral-400">Documentation & Resources</p>
          </div>
        </div>
      </header>

      {/* Folder Grid */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-neutral-300 mb-4 flex items-center gap-2">
          <Folder className="w-5 h-5" /> Folders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => {
            const colors = FOLDER_COLORS[folder.color] || FOLDER_COLORS.gray;
            return (
              <Link
                key={folder.path}
                href={`/resources/${folder.path}`}
                className={`group p-5 rounded-xl border ${colors.border} ${colors.bg} hover:scale-[1.02] transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{folder.icon}</span>
                  <span className={`text-xs font-medium ${colors.text} bg-black/20 px-2 py-1 rounded-full`}>
                    {folder.fileCount} files
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {folder.name}
                </h3>
                <p className="text-sm text-neutral-400 mb-3">
                  {folder.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">
                  Browse <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Root Files */}
      {rootFiles.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-neutral-300 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Quick Reference
          </h2>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800">
            {rootFiles.map((file) => (
              <Link
                key={file.path}
                href={`/resources/${file.path}`}
                className="flex items-center gap-4 p-4 hover:bg-neutral-800/50 transition-colors group"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <span className="flex-1 font-medium text-neutral-200 group-hover:text-white transition-colors">
                  {file.name}
                </span>
                <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
