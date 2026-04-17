"use client";

export default function PageContent({ content }) {
  if (!content) return null;

  // Split by double newlines for paragraphs, or single newlines for basic spacing
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className="space-y-6 text-gray-500 text-[15px] leading-relaxed">
      {paragraphs.map((para, i) => (
        <p key={i} className="whitespace-pre-line">
          {para}
        </p>
      ))}
    </div>
  );
}
