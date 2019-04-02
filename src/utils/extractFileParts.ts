import { FileParts } from '../types';

export default (
  file: string,
  extractTerm: RegExp,
  endTerm?: RegExp,
  keepNewLines?: boolean|undefined,
) => {
  const parts: FileParts = { before: '', extracts: [], after: '' };
  const extr = new RegExp(extractTerm.source, 'g');

  const firstMatch = file.search(extr);
  if (firstMatch === -1) {
    if (endTerm) {
      const splitTerm = new RegExp(`(?=${endTerm.source})`);
      const [before, after] = file.split(splitTerm);
      parts.before = before;
      parts.after = after;

    } else {
      parts.before = file;
    }

    return parts;
  }

  parts.before = file.substr(0, firstMatch);

  const firstResult = extr.exec(file);

  if (firstResult) {
    let prevIndex = firstResult.index;
    let hasResults = true;

    while (hasResults) {
      const result = extr.exec(file);

      if (result) {
        const nextIndex = result.index;
        parts.extracts.push(file.substring(prevIndex, nextIndex));
        prevIndex = nextIndex;

      } else {
        let lastPart = file.substr(prevIndex);
        let after;

        if (endTerm) {
          const splitTerm = new RegExp(`(?=${endTerm.source})`);
          [lastPart, after] = lastPart.split(splitTerm);
        }

        parts.extracts.push(lastPart);
        parts.after = after ? after : '';

        hasResults = false;
      }
    }
  }

  if (!keepNewLines) {
    parts.before = parts.before.removeNewLines();
    parts.after = parts.after.removeNewLines();
    parts.extracts = parts.extracts.map(p => p.removeNewLines());
  }

  return parts;
};
