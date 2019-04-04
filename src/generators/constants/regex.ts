export const selectExports = /export(.+?(?=export|$))/gs;
export const selectExportsAll = /export \*(.+?(?=export \*|$))/gs;
export const selectDefaultImports = /import \w(.+?(?=import|$|\n\n))/gs;
export const selectDescribes = /(?<=\n {2})describe(.+?(?= {2}describe|\n}\)))/gs;
export const selectCombineReducersMethod = /combineReducers\({\n/;
export const selectCombinedReducers = /(?<=combineReducers\({\n( {2}\w+,\n)*) {2}\w+,\n/g;
export const selectLastNewCombinedReducer = /(?<=combineReducers\({\n( {2}\w+,\n)*) {2}\w+,\n$/g;
