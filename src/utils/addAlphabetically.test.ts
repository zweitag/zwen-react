import * as expect from 'jest-matchers';
import './prototypes';

import addAlphabetically from './addAlphabetically';

describe('utils', () => {
  describe('addAlphabetically', () => {
    it('should add the addition to the file extracts', () => {
      const testFileParts = {
        before: 'testLine',
        extracts: ['abc', 'def', 'qwe'],
        after: 'lastLine',
      };
      const addition = 'asd';
      const result = addAlphabetically(testFileParts, addition);
      expect(result).toBe(`testLine\n\nabc\nasd\ndef\nqwe\n\nlastLine\n`);
    });
  });
});
