export default (
  file: string,
  addition: string,
  selector: RegExp,
  separator: string = '\n',
) => {
  const selection = file.match(selector) || [];
  const stringToReplace = selection.join('');
  const stringToInsert = selection
    .concat(addition)
    .map((c: string) => c.trim())
    .sort()
    .join(separator);

  let updatedFile: string;

  if (stringToReplace === '') {
    updatedFile = file + '\n\n' + stringToInsert;

  } else {
    updatedFile = file.replace(stringToReplace, stringToInsert);
  }

  return updatedFile + '\n';
};
