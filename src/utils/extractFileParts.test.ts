import '../prototypes';

import extractFileParts from './extractFileParts';

describe('utils', () => {
  describe('extractFileParts', () => {
    it('should return the test file as "before" if the extraction term does not match', () => {
      const testFile = 'abc123';
      const extractTerm = /qwe/;

      const parts = extractFileParts(testFile, extractTerm);

      expect(parts).toHaveProperty('before', 'abc123');
    });

    it('should extract the text before the extraction term', () => {
      const testFile = 'abc abc qwe';
      const extractTerm = /qwe/;

      const parts = extractFileParts(testFile, extractTerm);

      expect(parts).toHaveProperty('before', 'abc abc ');

    });

    it('should return the extracts', () => {
      const testFile = 'qwe abc erty abc sdd abc ywe';
      const extractTerm = /abc/;

      const parts = extractFileParts(testFile, extractTerm);

      expect(parts).toHaveProperty('extracts');
      expect(parts.extracts).toEqual(['abc erty ', 'abc sdd ', 'abc ywe']);
    });

    it('should extract the text after and including the end term', () => {
      const testFile = 'abc abc qwe abc ert yui';
      const extractTerm = /qwe/;
      const endTerm = /ert/;

      const parts = extractFileParts(testFile, extractTerm, endTerm);

      expect(parts).toHaveProperty('after', 'ert yui');
    });

    it('should extract the parts of an export file correctly', () => {
      let testFile =  `import * as t from '@/actions/types';\n\n`;
      testFile +=     `export * from './test';\n`;
      testFile +=     `export * from './ui';\n`;
      testFile +=     `\nexport const MY_TYPE = 'types/MY_TYPE';`;
      const extractTerm = /export \* from \'\.\//;
      const endTerm = /\n\n/;

      const parts = extractFileParts(testFile, extractTerm, endTerm);
      const firstExtract = parts.extracts ? parts.extracts[0] : '';
      const secondExtract = parts.extracts ? parts.extracts[1] : '';

      expect(parts).toHaveProperty('before', `import * as t from '@/actions/types';`);
      expect(parts).toHaveProperty('extracts');
      expect(parts.extracts).toHaveLength(2);

      expect(firstExtract).toBe(`export * from './test';`);
      expect(secondExtract).toBe(`export * from './ui';`);
      expect(parts).toHaveProperty('after', `export const MY_TYPE = 'types/MY_TYPE';`);
    });
  });
});
