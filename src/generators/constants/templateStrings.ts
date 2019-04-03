export const exportStringConst = (name: string, value: string) =>
  `export const ${name} = '${value}';\n`;

export const exportAllFrom = (from: string) => `export * from './${from}';\n`;
export const importAllAsFrom = (as: string, from: string) => `import * as ${as} from '${from}';\n`;

export const creatorTestHead = (path: string) =>
  `import * as t from '@/actions/types';\n` +
  `import * as actions from './creators';\n\n` +
  `describe('actions/${path}', () => {\n`;

export const creatorTestFoot = () => '});\n';
