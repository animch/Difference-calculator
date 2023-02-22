import { readFileSync } from 'fs';
import path from 'node:path';
import parseFile from './parsers.js';
import formater from './formatters/index.js';
import buildDiffTree from './diffTree.js';

const getPath = (filepath) => path.resolve(filepath);
const readFile = (filepath) => readFileSync((getPath(filepath)), 'utf-8');
const getFormat = (filepath) => path.extname(filepath).slice(1);
const parsedData = (filepath) => parseFile(readFile(filepath), getFormat(filepath));

export default ((filepath1, filepath2, format = 'stylish') => {
  const tree = buildDiffTree(parsedData(filepath1), parsedData(filepath2));
  return formater(tree, format);
});
