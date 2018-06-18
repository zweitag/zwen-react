import * as expect from 'jest-matchers';

import * as utils from './utils';

describe('utils', () => {
  describe('extractFileParts', () => {
    it('should return an empty object if the extraction term does not match', () => {
      const testFile = 'abc123';
      const extractTerm = /qwe/;

      const extracts = utils.extractFileParts(testFile, extractTerm);

      expect(extracts).toEqual({});
    });

    it('should extract the text before the extraction term', () => {
      const testFile = 'abc abc qwe abc123 abc';
      const extractTerm = /qwe/;

      const extracts = utils.extractFileParts(testFile, extractTerm);

      expect(extracts).toHaveProperty('before', 'abc abc ');

    });
  });
});
