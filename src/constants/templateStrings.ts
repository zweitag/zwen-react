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

export const describeTestStart = (path: string) =>
  `describe('${path}', () => {\n`;

export const describeTestEnd = () =>
  `});\n`;

// REDUCERS
export const exportDefaultCombineReducers = () =>
  'export default combineReducers({\n';

// SELECTORS
export const exportAllFromReducers = () =>
  `/* zwen-keep-start */\n` +
  `export * from '@/reducers';\n` +
  `/* zwen-keep-end */\n\n`;
