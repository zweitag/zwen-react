export const pushSort = (arr : Array<any>, value : any, appendix? : any) => {
  arr.push(value);

  const newArr = arr.sort();

  if (appendix != null) {
    newArr.push(appendix);
  }
  return newArr;
}
