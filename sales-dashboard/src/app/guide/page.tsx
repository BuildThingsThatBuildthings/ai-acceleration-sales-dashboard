import fs from 'fs';
import path from 'path';

export default function GuidePage() {
  const filePath = path.join(process.cwd(), '..', 'sales_system', 'dashboard_guide.md'); 
  let content = 'Guide not found.';
  try {
     content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {}

  return (
    <div className="p-8 max-w-4xl mx-auto">
       <div className="prose prose-invert max-w-none">
         <h1 className="mb-8">Application Guide</h1>
         <pre className="whitespace-pre-wrap bg-transparent p-0 font-sans text-neutral-300">{content}</pre>
       </div>
    </div>
  );
}
