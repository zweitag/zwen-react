import addToFile from './addToFile';

describe('utils/addToFile', () => {
  let file: string;
  let addition: string;
  let selector: RegExp;

  beforeEach(() => {
    selector = /export(.+?(?=export|$))/gs;
  });

  describe('no existing selections', () => {
    beforeEach(() => {
      file = 'import test from test\n';
      addition = 'export something';
    });

    it('should insert the addition at the end of the file', () => {
      const result = addToFile(file, addition, selector);

      expect(result).toBe('import test from test\nexport something');
    });

    it('should allow the addition of an appendix', () => {
      const options = {
        appendixIfNew: '\n--end',
      };
      const result = addToFile(file, addition, selector, options);

      expect(result).toBe('import test from test\nexport something\n--end');
    });
  });

  describe('existing selections', () => {
    beforeEach(() => {
      file = 'import test from test\n\nexport a\nexport b';
      addition = 'export c';
    });

    it('should insert the addition', () => {
      const result = addToFile(file, addition, selector);

      expect(result).toBe('import test from test\n\nexport a\nexport b\nexport c');
    });

    it('should sort the addition alphabetically', () => {
      addition = 'export abc';

      const result = addToFile(file, addition, selector);

      expect(result).toBe('import test from test\n\nexport a\nexport abc\nexport b');
    });

    it('should use a given separator', () => {
      const options = {
        separator: '\n\n',
      };

      const result = addToFile(file, addition, selector, options);

      expect(result).toBe('import test from test\n\nexport a\n\nexport b\n\nexport c');
    });

    it('should do nothing if the addition already exists', () => {
      addition = 'export a';

      const result = addToFile(file, addition, selector);

      expect(result).toBe('import test from test\n\nexport a\nexport b');
    });

    it('should allow the use of an additional separator for positive lookaheads', () => {
      file = 'import test from test\n\n  export a\n  export b\n';
      addition = '  export c';
      selector = /(?<=\n {2})export(.+?(?= {2}export|$))/gs;

      const options = {
        replaceStringSeparator: '  ',
        separator: '\n  ',
      };

      const result = addToFile(file, addition, selector, options);

      expect(result).toBe('import test from test\n\n  export a\n  export b\n  export c');
    });

    it('should add a given string if no selector is supplied', () => {
      addition = '\nend-of-file';
      const result = addToFile(file, addition);

      expect(result).toBe('import test from test\n\nexport a\nexport b\nend-of-file');
    });

    it('should add a prefix to all matches if one is provided', () => {
      const options = {
        prefixForAll: '--',
      };

      const result = addToFile(file, addition, selector, options);

      expect(result).toBe('import test from test\n\n--export a\n--export b\n--export c');
    });

    it('should add a prefix to all matches if one is provided', () => {
      const options = {
        suffixForAll: '--',
      };

      const result = addToFile(file, addition, selector, options);

      expect(result).toBe('import test from test\n\nexport a--\nexport b--\nexport c--');
    });

    it('should check for sections to keep at the beginning of a file', () => {
      file = '/* zwen-keep-start */KEEP/* zwen-keep-end */\n' + file;

      const result = addToFile(file, addition, selector);

      expect(result)
        .toBe('/* zwen-keep-start */KEEP/* zwen-keep-end */\nimport test from test\n\nexport a\nexport b\nexport c');
    });
  });
});
