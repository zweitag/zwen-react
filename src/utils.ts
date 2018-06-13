export const pushSort = (arr : Array<any>, value : any, appendix? : any) => {
  arr.push(value);

  const newArr = arr.sort();

  if (appendix != null) {
    newArr.push(appendix);
  }
  return newArr;
}

export const addAlphabetically = (file : string, addition : string, useAppendix : boolean = true) => {
  const fileArray = file.split('\n').filter(line => line !== '');

  if (!fileArray.includes(addition)) {
    pushSort(fileArray, addition, useAppendix ? '' : null);
  }
  return fileArray.join('\n');
}

export const addAlphabeticallyAsArray = (fileArray : Array<string>, addition : string, useAppendix : boolean = true) => {
  if (!fileArray.includes(addition)) {
    pushSort(fileArray, addition, useAppendix ? '' : null);
  }
  return fileArray;
}
