import addToFile from './addToFile';

describe('utils/addToFile', () => {
  let file: string;
  let addition: string;
  let selector: RegExp;

  beforeAll(() => {
    selector = /export(.+?(?=export|$))/gs;
  });

  describe('no existing selections', () => {
    beforeEach(() => {
      file = 'import test from test\n';
      addition = 'export something';
    });

    it('should insert the addition at the end of the file', () => {
      const result = addToFile(file, addition, selector);

      expect(result).toBe('import test from test\nexport something\n');
    });

    it('should allow the addition of an appendix', () => {
      const result = addToFile(file, addition, selector, '\n', '\n--end');

      expect(result).toBe('import test from test\nexport something\n--end\n');
    });
  });

  describe('existing selections', () => {
    beforeEach(() => {
      file = 'import test from test\n\nexport a\nexport b\n';
      addition = 'export c';
    });

    it('should insert the addition', () => {
      const result = addToFile(file, addition, selector);

      expect(result).toBe('import test from test\n\nexport a\nexport b\nexport c\n');
    });

    it('should sort the addition alphabetically', () => {
      addition = 'export abc';

      const result = addToFile(file, addition, selector);

      expect(result).toBe('import test from test\n\nexport a\nexport abc\nexport b\n');
    });

    it('should use a given separator', () => {
      const separator = '\n\n';

      const result = addToFile(file, addition, selector, separator);

      expect(result).toBe('import test from test\n\nexport a\n\nexport b\n\nexport c\n');
    });

    it('should do nothing if the addition already exists', () => {
      addition = 'export a';

      const result = addToFile(file, addition, selector);

      expect(result).toBe('import test from test\n\nexport a\nexport b\n');
    });

    it('should allow the use of an additional separator for positive lookaheads', () => {
      const replaceStringSeparator = '  ';
      file = 'import test from test\n\n  export a\n  export b\n';
      addition = '  export c';
      selector = /(?<=\n {2})export(.+?(?= {2}export|$))/gs;

      const result = addToFile(file, addition, selector, '\n  ', undefined, replaceStringSeparator);

      expect(result).toBe('import test from test\n\n  export a\n  export b\n  export c\n');
    });
  });
});
