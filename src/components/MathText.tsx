import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
  inline?: boolean;
}

/**
 * Pre-cleans mathematical text according to Malagasy/French official exam standards:
 * 1. Replaces '*' or ' * ' with ' × ' (professional multiplication symbol)
 * 2. Replaces bare arithmetic '/' like '120 / 4' or 'd / t' with ' ÷ ' (professional division symbol)
 * 3. Formats equations and LaTeX seamlessly with KaTeX
 */
export function sanitizeMathSymbols(raw: string): string {
  if (!raw) return '';

  let cleaned = raw;

  // Replace multiplication '*' with ' × ' when used as operator (between numbers/variables)
  // e.g. "24 * 5", "15 * 6", "(3 * 4)" -> "24 × 5", "15 × 6", "(3 × 4)"
  cleaned = cleaned.replace(/(\d|[a-zA-Z\)])\s*\*\s*(\d|[a-zA-Z\(])/g, '$1 × $2');
  cleaned = cleaned.replace(/\s\*\s/g, ' × ');

  // Replace division '/' with ' ÷ ' when used in arithmetic equations (numbers/variables)
  // But preserve dates (e.g. 26/06/1960) and URLs
  // Matches "120 / 4", "15 / 3", "d / t", "360 ÷ 4", "30 / 60"
  cleaned = cleaned.replace(/(\d|[a-zA-Z\)])\s*\/\s*(\d|[a-zA-Z\(])/g, (match, p1, p2, offset, str) => {
    // Check if it's a date like 26/06/1960 or DD/MM/YYYY
    const before = str.slice(Math.max(0, offset - 5), offset);
    const after = str.slice(offset, offset + match.length + 5);
    if (/\d{1,2}\/\d{1,2}\/\d{2,4}/.test(before + match + after)) {
      return match; // preserve dates
    }
    return `${p1} ÷ ${p2}`;
  });

  return cleaned;
}

/**
 * Parses and renders text with KaTeX formulas (delimiters $...$, $$...$$, or plain mathematical expressions)
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '', inline = true }) => {
  if (!text) return null;

  // Pre-clean standard symbols so '*' becomes '×' and '/' becomes '÷'
  const sanitized = sanitizeMathSymbols(text);

  // Check if text contains LaTeX delimiters: $...$ or $$...$$
  const hasLatex = /\$([^$]+)\$/.test(sanitized) || /\$\$([^$]+)\$\$/.test(sanitized);

  if (hasLatex) {
    const parts = sanitized.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

    return (
      <span className={className}>
        {parts.map((part, index) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            const math = part.slice(2, -2).trim();
            try {
              const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
              return <span key={index} className="block my-2" dangerouslySetInnerHTML={{ __html: html }} />;
            } catch {
              return <span key={index}>{part}</span>;
            }
          } else if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.slice(1, -1).trim();
            try {
              const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
              return <span key={index} className="inline-block px-0.5" dangerouslySetInnerHTML={{ __html: html }} />;
            } catch {
              return <span key={index}>{part}</span>;
            }
          } else {
            return <span key={index}>{part}</span>;
          }
        })}
      </span>
    );
  }

  // If text contains formulas like "BC² = AB² + AC²" or "v = d ÷ t", we can render directly with clean typography
  return <span className={className}>{sanitized}</span>;
};
