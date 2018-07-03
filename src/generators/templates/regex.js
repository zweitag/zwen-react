module.exports = {
  exportDefaultAs: /export { default as .* }/,
  exportAll: /export \* from/,
  importDefault: /import \w* from \'\..*\';/,

  exportDefaultCombine: /export default combineReducers\({/,
  exportCombine: /  \w*,/,
  combineEnd: /\n}\);/,

  exportAction: /export const \w* = \(.*\) =>/,
  exportType: /export const \w* = \'(\w+(\/\w+)*)\';/,

  describeActionTest: /\n  describe\(\'\w*\', \(\) => {\n/,

  doubleNewLine: /\n\n/,
};
