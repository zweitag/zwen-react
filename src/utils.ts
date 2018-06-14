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
