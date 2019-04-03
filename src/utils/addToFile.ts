/*
  Inserts a string to a file containing strings of the same format.
  Use the selector regex to describe this format. If you use a
  lookahead in the selector you should add its selection both to
  the separator and replaceStringSeparator, to ensure the string
  is being found and replaced correctly.

  Example:
    Usage of /(?<=\nX{2})myString/gs as a selector
    needs a separator of \nXX
    and a replaceStringSeparator of XX
*/

export default (
  file: string,
  addition: string,
  selector: RegExp,
  separator: string = '\n',
  appendixIfNew: string = '',
  replaceStringSeparator: string = '',
) => {
  if (file.includes(addition.trim())) {
    return file;
  }

  const selection = file.match(selector) || [];
  const stringToReplace = selection.join(replaceStringSeparator);

  if (stringToReplace === '') {
    return (file + addition + appendixIfNew).trim() + '\n';
  }

  const stringToInsert = selection
    .concat(addition)
    .map((c: string) => c.trim())
    .sort()
    .join(separator);

  return (file.replace(stringToReplace, stringToInsert)).trim() + '\n';
};
