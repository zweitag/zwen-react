export const addAlphabetically = (file : string, addition : string, useAppendix : boolean = true) => {
  const fileArray = file.split('\n').filter(line => line !== '');

  if (!fileArray.includes(addition)) {
    fileArray.pushSort(addition, useAppendix ? '' : null);
  }
  return fileArray.join('\n');
}

export const addAlphabeticallyAsArray = (fileArray : Array<string>, addition : string, useAppendix : boolean = true) => {
  if (!fileArray.includes(addition)) {
    fileArray.pushSort(addition, useAppendix ? '' : null);
  }
  return fileArray;
}

interface fileParts {
  before? : string,
  extracts? : string[],
  after? : string,
}

export function extractFileParts(file : string, extractTerm : RegExp, endTerm? : RegExp) {
  const parts : fileParts = {};
  const extr = new RegExp(extractTerm.source, 'g');

  const firstMatch = file.search(extr);
  if (firstMatch === -1) {
    return parts;
  }

  parts.before = file.substr(0, firstMatch);
  parts.extracts = [];

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
        parts.after = after;

        hasResults = false;
      }
    }
  }

  return parts;
}
