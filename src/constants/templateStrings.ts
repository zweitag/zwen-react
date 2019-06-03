export const exportDefaultAs = (name: string) =>
  `export { default as ${name} } from './${name}';\n`;

export const exportStringConst = (name: string, value: string) =>
  `export const ${name} = '${value}';\n`;

export const exportAllFrom = (from: string) =>
  `export * from './${from}';\n`;

export const importDefaultFrom = (name: string, from: string) =>
  `import ${name} from '${from}';\n`;

export const importAllAsFrom = (as: string, from: string) =>
  `import * as ${as} from '${from}';\n`;

export const importNamedFrom = (name: string, from: string) =>
  `import { ${name} } from '${from}';\n`;

// ACTIONS
export const creatorTestHead = (path: string) =>
  `import * as t from '@/actions/types';\n` +
  `import * as actions from './creators';\n\n` +
  `describe('actions/${path}', () => {\n`;

export const creatorTestFoot = () => '});\n';

// REDUCERS
export const exportDefaultCombineReducers = () =>
  'export default combineReducers({\n';

// SELECTORS
export const exportAllFromReducers = () =>
  `/* zwen-keep-start */\n` +
  `export * from '@/reducers';\n` +
  `/* zwen-keep-end */\n\n`;
