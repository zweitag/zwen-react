import { fileParts } from '../types';

export default (
  fileParts : fileParts,
  addition : string,
  wrapExtracts : string = '\n',
  separateExtracts : string = '\n',
) => {
  let newFile = '';

  if (!fileParts.extracts.includes(addition)) {
    fileParts.extracts.pushSort(addition);
  }

  if (fileParts.before) {
    newFile += fileParts.before + wrapExtracts;
  }

  newFile += fileParts.extracts.join(separateExtracts);

  if (fileParts.after) {
    newFile += wrapExtracts + fileParts.after;
  }

  return newFile + '\n';
}
