module.exports = {
  // global
  exportDefaultAs(path) {
    return `export { default as ${path} } from './${path}';`;
  },
  defaultImport(path) {
    return `import ${path} from './${path}';`;
  },
  exportAll(path) {
    return `export * from './${path}';`;
  },
  describeTestSuite(path) {
    return `describe('${path}', () => {`;
  },

  // reducers
  exportCombine(path) {
    return `  ${path},`;
  },

  // action types
  importAllTypes() {
    return `import * as t from '@/actions/types';`
  },
  exportType(name, path) {
    return `export const ${name} = '${path}/${name}';`
  }
};
