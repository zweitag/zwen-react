module.exports = {
  exportDefaultAs: /export { default as .* }/,
  exportAll: /export \* from/,
  importDefault: /import \w* from \'\..*\';/,
  exportDefaultCombine: /export default combineReducers\({/,
  exportCombine: /  \w*,/,
  combineEnd: /}\);/,
};
