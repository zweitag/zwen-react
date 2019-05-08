import config from '../../config';

const escapeRegEx = (regexStr: string) => regexStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const indent = escapeRegEx(config.indent);

export const selectExports = new RegExp(
  'export(.+?(?=export|$))',
  'gs',
);
export const selectExportsAll = new RegExp(
  'export \\*(.+?(?=export \\*|$))',
  'gs',
);
export const selectDefaultImports = new RegExp(
  'import \\w(.+?(?=import|$|\\n\\n))',
  'gs',
);
export const selectDescribes = new RegExp(
  `(?<=\\n${indent})describe(.+?(?=${indent}describe|\\n}\\)))`,
  'gs',
);
export const selectCombineReducersMethod = new RegExp(
  'combineReducers\\({\\n',
);
export const selectCombinedReducers = new RegExp(
  `(?<=combineReducers\\({\\n(${indent}\\w+,\\n)*)${indent}\\w+,\\n`,
  'g',
);
export const selectLastNewCombinedReducer = new RegExp(
  `(?<=combineReducers\\({\\n( {2}\\w+,\\n)*) {2}\\w+,\\n$`,
  'g',
);
