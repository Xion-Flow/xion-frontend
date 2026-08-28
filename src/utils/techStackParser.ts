export interface ParsedTechStack {
  [category: string]: string[];
}

/**
 * Parses tech stack string into structured category groups.
 * Supports:
 * - Category -> Tech1, Tech2
 * - Category: Tech1, Tech2
 * - JSON string {"Frontend": ["React", "Vite"]}
 * - Plain comma-separated text ("React, Node.js")
 */
export function parseTechStack(rawTechStack?: string | null): ParsedTechStack {
  if (!rawTechStack || !rawTechStack.trim()) {
    return {};
  }

  const trimmed = rawTechStack.trim();

  // 1. Try parsing JSON
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        const result: ParsedTechStack = {};
        for (const [key, val] of Object.entries(parsed)) {
          if (Array.isArray(val)) {
            result[key] = val.map(String);
          } else if (typeof val === 'string') {
            result[key] = val.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }
        if (Object.keys(result).length > 0) return result;
      }
    } catch (e) {
      // Fallback to text parser
    }
  }

  // 2. Parse Category -> Tech1, Tech2 or Category: Tech1, Tech2
  const lines = trimmed.split('\n');
  const result: ParsedTechStack = {};
  let hasCategoryFormat = false;

  for (const line of lines) {
    const lineTrimmed = line.trim();
    if (!lineTrimmed) continue;

    if (lineTrimmed.includes('->') || (lineTrimmed.includes(':') && !lineTrimmed.startsWith('http'))) {
      const separator = lineTrimmed.includes('->') ? '->' : ':';
      const parts = lineTrimmed.split(separator);
      const category = parts[0].trim();
      const techsStr = parts.slice(1).join(separator).trim();

      if (category && techsStr) {
        const techList = techsStr
          .split(',')
          .map((t) => t.trim().replace(/^[-*•]\s*/, ''))
          .filter(Boolean);

        if (techList.length > 0) {
          result[category] = techList;
          hasCategoryFormat = true;
        }
      }
    }
  }

  // 3. Fallback to simple comma-separated list
  if (!hasCategoryFormat) {
    const simpleList = trimmed
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (simpleList.length > 0) {
      result['Tech Stack'] = simpleList;
    }
  }

  return result;
}

/**
 * Formats a category object into a clean line-by-line string:
 * Frontend -> React, Vite
 * Backend -> Node.js, Express
 */
export function formatTechStackToString(stack: ParsedTechStack): string {
  return Object.entries(stack)
    .filter(([_, techs]) => techs.length > 0)
    .map(([category, techs]) => `${category} -> ${techs.join(', ')}`)
    .join('\n');
}
