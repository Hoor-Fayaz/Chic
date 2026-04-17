import { fetchPage } from '@/lib/api';
import { notFound } from 'next/navigation';

/**
 * DynamicPage — fetches page content from the CMS/DB and renders it.
 * Used by all (info) storefront pages so they are editable from the admin.
 * Content is stored as plain text; line breaks and blank lines are preserved.
 */
export default async function DynamicPage({ slug }) {
  let page = null;

  try {
    const res = await fetchPage(slug);
    page = res?.data;
  } catch {
    return notFound();
  }

  if (!page) return notFound();

  // Split content into paragraphs/sections by blank lines
  const blocks = (page.content || '').split(/\n\n+/);

  return (
    <div className="space-y-8 pb-20 max-w-2xl">
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter(Boolean);
        if (!lines.length) return null;

        // First line of the first block = big heading
        if (i === 0 && lines.length >= 1) {
          return (
            <section key={i} className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                {page.title}
              </h2>
              <h1 className="text-4xl md:text-5xl font-display font-medium text-gray-900 tracking-tight leading-[1.1]">
                {lines[0]}
              </h1>
              {lines.slice(1).map((line, j) => (
                <p key={j} className="text-gray-500 text-[15px] leading-relaxed">
                  {line}
                </p>
              ))}
            </section>
          );
        }

        // Single-line blocks = section subheading
        if (lines.length === 1) {
          return (
            <h3 key={i} className="text-[11px] font-bold uppercase tracking-widest text-gray-900 border-t border-gray-100 pt-6 mt-2">
              {lines[0]}
            </h3>
          );
        }

        // Multi-line blocks: first line = subheading, rest = body
        const [heading, ...body] = lines;
        return (
          <div key={i} className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
              {heading}
            </h3>
            <div className="space-y-2">
              {body.map((line, j) => (
                <p key={j} className={`text-[14px] leading-relaxed ${line.startsWith('-') ? 'pl-4 text-gray-500' : 'text-gray-500'}`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
           );
        }

// 5. STANDARD CONTENT BLOCK
const isHeading = lines.length === 1 && lines[0].length < 60 && !lines[0].endsWith('.');
if (isHeading) {
  return (
    <h3 key={i} className="text-[12px] font-bold uppercase tracking-[0.2em] text-black border-t border-gray-100 pt-12 mt-4 block-fade-in">
      {heading}
    </h3>
  );
}

return (
  <div key={i} className="space-y-6 pt-12 border-t border-gray-50 block-fade-in">
    <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
      {heading}
    </h3>
    <div className="space-y-5">
      {bodyLines.map((line, j) => {
        const isBullet = line.trim().startsWith('-');
        return (
          <div key={j} className="flex gap-4">
            {isBullet && <div className="w-1.5 h-[1.5px] bg-gray-300 mt-2.5 shrink-0" />}
            <p className={`text-[15px] leading-relaxed text-gray-500 flex-1`}>
              {isBullet ? line.trim().replace(/^- \s*/, '') : line}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);
      })}
    </div >
  );
}
