import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturesPath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe.each([
  ['json'], ['yml'],
])('$s extension', (extension) => {
  test.each([
    ['stylish'], ['plain'], ['json'],
  ])('%s formatter', (formatter) => {
    const file1Path = `__fixtures__/file1.${extension}`;
    const file2Path = `__fixtures__/file2.${extension}`;
    const expected = readFileSync(getFixturesPath(`${formatter}Result.txt`), 'utf-8');

    expect(genDiff(file1Path, file2Path, formatter)).toBe(expected);
  });
});
