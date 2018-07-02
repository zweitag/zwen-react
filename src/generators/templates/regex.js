module.exports = {
  exportDefaultAs: /export { default as .* }/,
  exportAll: /export \* from/,
  importDefault: /import \w* from \'\..*\';/,

  exportDefaultCombine: /export default combineReducers\({/,
  exportCombine: /  \w*,/,
  combineEnd: /\n}\);/,

  exportAction: /export const \w* = \(.*\) =>/,

  describeActionTest: /\n  describe\(\'\w*\', \(\) => {\n/,
};
