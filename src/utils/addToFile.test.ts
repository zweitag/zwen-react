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
      file = 'import test from test';
      addition = 'export something';
    });

    it('should insert the addition at the end of the file', () => {
      const result = addToFile(file, addition, selector);

      expect(result).toBe('import test from test\n\nexport something\n');
    });
  });

  describe('existing selections', () => {
    beforeEach(() => {
      file = 'import test from test\n\nexport a\n\nexport b\n';
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
  });
});
