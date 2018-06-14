interface Array<T> {
  filterEmptyStrings(): Array<T>;
}

Array.prototype.filterEmptyStrings =
  Array.prototype.filterEmptyStrings ||
  function filterEmpty(this : Array<any>) {
    return this.filter(s => s !== '');
  }
