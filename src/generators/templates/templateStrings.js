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

  // reducers
  exportCombine(path) {
    return `  ${path},`;
  },
};
