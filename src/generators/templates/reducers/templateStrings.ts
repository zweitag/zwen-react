export const topLevelExport = path => `export { default as ${path} } from './${path}';`
export const defaultImport = path => `import ${path} from './${path}';`;
export const exportAll = path => `export * from './${path}';`
export const exportCombine = path => `  ${path},`;

export const getImportMarkers = fileArr => ({
  importStart: fileArr.findIndex(line => /^import (?!{)/.test(line)),
  importEnd: fileArr.findIndex(line => /^export/.test(line)),
});

export const getCombineMarkers = fileArr => ({
  combineStart: fileArr.findIndex(line => /^export default combineReducers/.test(line)) + 1,
  combineEnd: fileArr.findIndex(line => /^}\);$/.test(line)),
});

export const getExportMarkers = fileArr => ({
  exportStart: fileArr.findIndex(line => /^export \* from/.test(line)),
  exportEnd: fileArr.findIndex(line => /^}\);$/.test(line)),
});
