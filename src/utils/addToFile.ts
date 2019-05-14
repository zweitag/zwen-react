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
import * as r from '../constants/regex';
import { AdditionOptions } from '../types';

const defaultOptions: AdditionOptions = {
  appendixIfNew: '',
  prefixForAll: '',
  replaceStringSeparator: '',
  separator: '\n',
  suffixForAll: '',
};

export default (
  file: string,
  addition: string,
  selector: RegExp = /a^/,       // default: match nothing
  options: AdditionOptions = {},
) => {
  const opts = {
    ...defaultOptions,
    ...options,
  };

  if (file.includes(addition.trim())) {
    return file;
  }

  let keptSection = '';
  const keptSectionMatch = file.match(r.zwenKeepSection);

  if (keptSectionMatch) {
    keptSection = keptSectionMatch[0];
    file = file.replace(keptSection, '');
  }

  const selection = file.match(selector) || [];
  const stringToReplace = selection.join(opts.replaceStringSeparator);

  if (stringToReplace === '') {
    const additionWithAffixes = opts.prefixForAll + addition + opts.suffixForAll;

    return keptSection + file + additionWithAffixes + opts.appendixIfNew;
  }

  const stringToInsert = selection
    .concat(addition)
    .map((c: string) => `${opts.prefixForAll}${c.trim()}${opts.suffixForAll}`)
    .sort()
    .join(opts.separator);

  return keptSection + file.replace(stringToReplace, stringToInsert);
};
