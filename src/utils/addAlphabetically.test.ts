import '../prototypes';

import addAlphabetically from './addAlphabetically';

describe('utils', () => {
  describe('addAlphabetically', () => {
    it('should add the addition to the file extracts', () => {
      const testFileParts = {
        after: 'lastLine',
        before: 'testLine',
        extracts: ['abc', 'def', 'qwe'],
      };
      const addition = 'asd';
      const result = addAlphabetically(testFileParts, addition);
      expect(result).toBe(`testLine\nabc\nasd\ndef\nqwe\nlastLine\n`);
    });

    it('should wrap the extracts accordingly', () => {
      const testFileParts = {
        after: 'lastLine',
        before: 'testLine',
        extracts: ['abc', 'def', 'qwe'],
      };
      const addition = 'asd';
      const result = addAlphabetically(testFileParts, addition, '\n\n');
      expect(result).toBe(`testLine\n\nabc\nasd\ndef\nqwe\n\nlastLine\n`);
    });

    it('should separate the extracts accordingly', () => {
      const testFileParts = {
        after: 'lastLine',
        before: 'testLine',
        extracts: ['abc', 'def', 'qwe'],
      };
      const addition = 'asd';
      const result = addAlphabetically(testFileParts, addition, undefined, '\n\n');
      expect(result).toBe(`testLine\nabc\n\nasd\n\ndef\n\nqwe\nlastLine\n`);
    });
  });
});
