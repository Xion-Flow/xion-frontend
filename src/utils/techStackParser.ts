export interface ParsedTechStack {
  [category: string]: string[];
}

/**
 * Parses tech stack input into structured category groups.
 * Robust against:
 * - HTML entities (e.g. -&gt; => ->)
 * - Single-line pasted text ("Frontend -> React Backend -> Python")
 * - Multiline formatted text ("Frontend -> React\nBackend -> Python")
 * - JSON format {"Frontend": ["React", "Vite"]}
 * - Plain comma/space separated text
 */
export function parseTechStack(rawTechStack?: string | null): ParsedTechStack {
  if (!rawTechStack || !rawTechStack.trim()) {
    return {};
  }

  // 1. Decode HTML entities & normalize basic whitespace
  let text = rawTechStack
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

  // 2. Check JSON
  if (text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'object' && parsed !== null) {
        const result: ParsedTechStack = {};
        for (const [key, val] of Object.entries(parsed)) {
          if (Array.isArray(val)) {
            result[key] = val.map(String);
          } else if (typeof val === 'string') {
            result[key] = val.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
          }
        }
        if (Object.keys(result).length > 0) return result;
      }
    } catch (e) {
      // Fallback to text parser
    }
  }

  // 3. Pre-process text: Insert newlines before category markers if user pasted on a single line
  // Example: "React.js Recharts Backend -> Python" => "React.js Recharts\nBackend -> Python"
  text = text.replace(/([^\n])\s+([A-Za-z0-9\/\s&-]{2,25})\s*(?:->|:)/g, '$1\n$2 ->');

  const result: ParsedTechStack = {};
  const lines = text.split('\n');
  let hasCategoryFormat = false;

  for (const line of lines) {
    const lineTrimmed = line.trim();
    if (!lineTrimmed) continue;

    if (lineTrimmed.includes('->') || (lineTrimmed.includes(':') && !lineTrimmed.startsWith('http'))) {
      const separator = lineTrimmed.includes('->') ? '->' : ':';
      const parts = lineTrimmed.split(separator);
      let category = parts[0].trim().replace(/^[-*•]\s*/, '');
      const techsStr = parts.slice(1).join(separator).trim();

      if (category) {
        // Clean out category label prefixes if present
        category = category.replace(/^tech\s*stack/i, '').trim() || category;

        // Split techs by comma, newline, or multiple spaces if no commas exist
        let techList: string[] = [];
        if (techsStr) {
          if (techsStr.includes(',') || techsStr.includes(';')) {
            techList = techsStr.split(/[,;]/).map((t) => t.trim());
          } else {
            // If space-separated, split smart (preserve Multi-word Techs like "Tailwind CSS")
            techList = techsStr.split(/\s\s+|\n/).map((t) => t.trim());
            if (techList.length <= 1) {
              techList = [techsStr];
            }
          }

          techList = techList
            .map((t) => t.replace(/^[-*•]\s*/, '').replace(/->|:/g, '').trim())
            .filter((t) => Boolean(t) && t !== '->' && t !== ':');
        }

        result[category] = techList;
        hasCategoryFormat = true;
      }
    }
  }

  // 4. Fallback to simple list
  if (!hasCategoryFormat) {
    const simpleList = text
      .split(/[,;\n]/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (simpleList.length > 0) {
      result['Tech Stack'] = simpleList;
    }
  }

  return result;
}

/**
 * Formats parsed stack back into clean input text
 */
export function formatTechStackToString(stack: ParsedTechStack): string {
  return Object.entries(stack)
    .filter(([category]) => Boolean(category && category.trim()))
    .map(([category, techs]) => (techs && techs.length > 0 ? `${category} -> ${techs.join(', ')}` : `${category} ->`))
    .join('\n');
}
