import { readFileSync } from 'fs';
import path from 'node:path';
import parseFile from './parsers.js';
import formater from './formatters/index.js';
import buildDiffTree from './diffTree.js';

const getPath = (filepath) => path.resolve(filepath);
const readFile = (filepath) => readFileSync((getPath(filepath)), 'utf-8');
const getFormat = (filepath) => path.extname(filepath).slice(1);

export default ((filepath1, filepath2, format = 'stylish') => {
  const file1 = readFile(filepath1);
  const file2 = readFile(filepath2);
  const format1 = getFormat(filepath1);
  const format2 = getFormat(filepath2);
  const parsedFile1 = parseFile(file1, format1);
  const parsedFile2 = parseFile(file2, format2);
  const tree = buildDiffTree(parsedFile1, parsedFile2);

  return formater(tree, format);
});
