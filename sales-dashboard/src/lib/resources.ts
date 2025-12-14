import fs from 'fs';
import path from 'path';

const RESOURCES_DIR = path.join(process.cwd(), 'src', 'data', 'resources');

export interface ResourceItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: ResourceItem[];
}

export interface FolderInfo {
  name: string;
  path: string;
  icon: string;
  color: string;
  description: string;
  fileCount: number;
}

// Folder metadata
const FOLDER_META: Record<string, { icon: string; color: string; description: string }> = {
  playbook: {
    icon: '📖',
    color: 'blue',
    description: 'Scripts, workflows, and call training'
  },
  objections: {
    icon: '🛡️',
    color: 'red',
    description: 'Objection handling by tier'
  },
  value_library: {
    icon: '💰',
    color: 'green',
    description: 'ROI calculators and case studies'
  },
  lead_management: {
    icon: '📋',
    color: 'purple',
    description: 'CRM guides and data capture'
  },
  email_sequences: {
    icon: '✉️',
    color: 'orange',
    description: 'Email templates and voicemail scripts'
  },
  metrics: {
    icon: '📊',
    color: 'cyan',
    description: 'KPIs and reporting templates'
  }
};

// Get all folders with metadata
export function getFolders(): FolderInfo[] {
  const items = fs.readdirSync(RESOURCES_DIR, { withFileTypes: true });

  return items
    .filter(item => item.isDirectory())
    .map(item => {
      const meta = FOLDER_META[item.name] || { icon: '📁', color: 'gray', description: '' };
      const folderPath = path.join(RESOURCES_DIR, item.name);
      const files = countMarkdownFiles(folderPath);

      return {
        name: formatName(item.name),
        path: item.name,
        icon: meta.icon,
        color: meta.color,
        description: meta.description,
        fileCount: files
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Count markdown files recursively
function countMarkdownFiles(dir: string): number {
  let count = 0;
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      count += countMarkdownFiles(path.join(dir, item.name));
    } else if (item.name.endsWith('.md')) {
      count++;
    }
  }

  return count;
}

// Get files in a specific folder
export function getFilesInFolder(folderPath: string): ResourceItem[] {
  const fullPath = path.join(RESOURCES_DIR, folderPath);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const items = fs.readdirSync(fullPath, { withFileTypes: true });

  return items
    .filter(item => item.isDirectory() || item.name.endsWith('.md'))
    .map(item => ({
      name: item.isDirectory() ? formatName(item.name) : formatFileName(item.name),
      path: path.join(folderPath, item.name),
      type: item.isDirectory() ? 'folder' as const : 'file' as const
    }))
    .sort((a, b) => {
      // Folders first, then files
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

// Get root level markdown files
export function getRootFiles(): ResourceItem[] {
  const items = fs.readdirSync(RESOURCES_DIR, { withFileTypes: true });

  return items
    .filter(item => item.isFile() && item.name.endsWith('.md'))
    .map(item => ({
      name: formatFileName(item.name),
      path: item.name,
      type: 'file' as const
    }));
}

// Read a markdown file
export function getFileContent(filePath: string): { content: string; title: string } | null {
  const fullPath = path.join(RESOURCES_DIR, filePath);

  if (!fs.existsSync(fullPath) || !filePath.endsWith('.md')) {
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const title = extractTitle(content) || formatFileName(path.basename(filePath));

  return { content, title };
}

// Extract title from markdown (first H1)
function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : null;
}

// Format folder name
function formatName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Format file name
function formatFileName(name: string): string {
  return name
    .replace(/\.md$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Get breadcrumb path
export function getBreadcrumbs(pathStr: string): { name: string; path: string }[] {
  const parts = pathStr.split('/').filter(Boolean);
  const breadcrumbs: { name: string; path: string }[] = [
    { name: 'Resources', path: '/resources' }
  ];

  let currentPath = '';
  for (const part of parts) {
    currentPath += '/' + part;
    const isFile = part.endsWith('.md');
    breadcrumbs.push({
      name: isFile ? formatFileName(part) : formatName(part),
      path: `/resources${currentPath}`
    });
  }

  return breadcrumbs;
}

// Heading type for Table of Contents
export interface Heading {
  id: string;
  text: string;
  level: number;
}

// Extract headings from markdown content for TOC
export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split('\n');

  lines.forEach((line) => {
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);

    if (h2Match) {
      const text = h2Match[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: 2 });
    } else if (h3Match) {
      const text = h3Match[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: 3 });
    }
  });

  return headings;
}
