const camelCase = require('camel-case');
const constantCase = require('constant-case');
const pascalCase = require('pascal-case');

interface Array<T> {
  filterEmptyStrings() : Array<T>
  pushSort(value : any, appendix? : any) : Array<T>
}

Array.prototype.filterEmptyStrings =
  Array.prototype.filterEmptyStrings ||
  function filterEmpty(this : Array<any>) {
    return this.filter(s => s !== '');
  }

Array.prototype.pushSort =
  Array.prototype.pushSort ||
  function pushSort(this : Array<any>, value : any, appendix? : any) {
    this.push(value);

    const newArr = this.sort();

    if (appendix != null) {
      newArr.push(appendix);
    }
    return newArr;
  }

interface String {
  replaceNewLine() : string,
  toCamelCase() : string,
  toConstantCase() : string,
  toPascalCase() : string,
  splitAt(startIndex : number, endIndex? : number) : Array<string>
}

String.prototype.toCamelCase =
  String.prototype.toCamelCase ||
  function toCamelCase(this : string) {
    return camelCase(this);
  }

String.prototype.toConstantCase =
  String.prototype.toConstantCase ||
  function toConstantCase(this : string) {
    return constantCase(this);
  }

String.prototype.toPascalCase =
  String.prototype.toPascalCase ||
  function toPascalCase(this : string) {
    return pascalCase(this);
  }

String.prototype.splitAt =
  String.prototype.splitAt ||
  function splitAt(this : string, startIndex : number, endIndex : number = this.length) {
    return [
      this.slice(0, startIndex),
      this.slice(startIndex, endIndex),
      this.slice(endIndex)].filterEmptyStrings();
  }

String.prototype.replaceNewLine =
  String.prototype.replaceNewLine ||
  function replaceNewLine(this : string) {
    return this.replace(/\n\n?$/, '');
  }
