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

  const firstMatch = file.search(extractTerm);
  if (firstMatch === -1) {
    return parts;
  }

  parts.before = file.substr(0, firstMatch);

  if (endTerm) {
    const endMatch = file.search(endTerm);
    if (endMatch) {
      parts.after = file.substr(endMatch);
    }
  }

  return parts;
}
