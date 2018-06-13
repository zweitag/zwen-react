export const pushSort = (arr : Array<any>, value : any, appendix? : any) => {
  arr.push(value);

  const newArr = arr.sort();

  if (appendix != null) {
    newArr.push(appendix);
  }
  return newArr;
}

export const addAlphabetically = (file : string, addition : string) => {
  const fileArray = file.split('\n').filter(line => line !== '');

  if (!fileArray.includes(addition)) {
    pushSort(fileArray, addition, '');
  }
  return fileArray.join('\n');
}
