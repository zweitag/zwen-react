module.exports = {
  getImportMarkers(fileArr) {
    return {
      importStart: fileArr.findIndex(line => /^import (?!{)/.test(line)),
      importEnd: fileArr.findIndex(line => /^export/.test(line)),
    };
  },

  getCombineMarkers(fileArr) {
    return {
      combineStart: fileArr.findIndex(line => /^export default combineReducers/.test(line)) + 1,
      combineEnd: fileArr.findIndex(line => /^}\);$/.test(line)),
    };
  },

  getExportMarkers(fileArr) {
    return {
      exportStart: fileArr.findIndex(line => /^export \* from/.test(line)),
      exportEnd: fileArr.findIndex(line => /^}\);$/.test(line)),
    };
  },
};