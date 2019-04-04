import camelCase from 'camel-case';
import constantCase from 'constant-case';
import pascalCase from 'pascal-case';

declare global {
  interface Array<T> {
    filterEmptyStrings(): T[];
    toString(delimiter?: string, prefix?: string, suffix?: string): string;
  }

  interface String {
    toCamelCase(): string;
    toConstantCase(): string;
    toPascalCase(): string;
  }
}

Array.prototype.filterEmptyStrings =
  Array.prototype.filterEmptyStrings ||
  function filterEmpty(this: any[]) {
    return this.filter(s => s !== '');
  };

Array.prototype.toString = function toString(this: any[], delimiter = ',', prefix = '', suffix = '') {
  const reducedArray = this.reduce((str, cur) => str + delimiter + cur);
  return `${prefix}${reducedArray}${suffix}`;
};

String.prototype.toCamelCase =
  String.prototype.toCamelCase ||
  function toCamelCase(this: string) {
    return camelCase(this);
  };

String.prototype.toConstantCase =
  String.prototype.toConstantCase ||
  function toConstantCase(this: string) {
    return constantCase(this);
  };

String.prototype.toPascalCase =
  String.prototype.toPascalCase ||
  function toPascalCase(this: string) {
    return pascalCase(this);
  };
