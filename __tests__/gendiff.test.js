import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

const filejson1 = getFixturePath('file1.json');
const filejson2 = getFixturePath('file2.json');
const fileyaml1 = getFixturePath('file1.yml');
const fileyaml2 = getFixturePath('file2.yml');
const expectedResultJson = readFile('resultJson.txt');
const expectedResultStylish = readFile('resultStylish.txt');
const expectedResultPlain = readFile('resultPlain.txt');
test.each([
  {
    a: filejson1, b: filejson2, format: 'json', expectresult: expectedResultJson,
  },
  {
    a: fileyaml1, b: fileyaml2, format: 'json', expectresult: expectedResultJson,
  },
  {
    a: fileyaml1, b: fileyaml2, format: 'stylish', expectresult: expectedResultStylish,
  },
  {
    a: filejson1, b: filejson2, format: 'stylish', expectresult: expectedResultStylish,
  },
  {
    a: filejson1, b: filejson2, format: 'plain', expectresult: expectedResultPlain,
  },
  {
    a: fileyaml1, b: fileyaml2, format: 'plain', expectresult: expectedResultPlain,
  },
  {
    a: filejson1, b: filejson2, expectresult: expectedResultStylish,
  },

])('format', ({
  a, b, format, expectresult,
}) => {
  expect(genDiff(a, b, format)).toBe(expectresult);
});
