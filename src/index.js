import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'node:path';
import parser from './parsers.js';
import formater from './formatters/index.js';

const getDiff = (data1, data2) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const sortKeys = _.sortBy(_.union(keys1, keys2));
  const result = sortKeys.map((key) => {
    if (_.isObject(data1[key]) && _.isObject(data2[key])) {
      return { type: 'nested', key, children: getDiff(data1[key], data2[key]) };
    }
    if (!_.has(data1, key)) {
      return { type: 'added', key, value: data2[key] };
    }
    if (!_.has(data2, key)) {
      return { type: 'removed', key, value: data1[key] };
    }
    if (data2[key] !== data1[key]) {
      return {
        type: 'updated', key, value1: data1[key], value2: data2[key],
      };
    }
    return { type: 'unchanged', key, value: data1[key] };
  });
  return result;
};

const getPath = (filepath) => path.resolve(filepath);
const readFile = (filepath) => readFileSync((getPath(filepath)), 'utf-8');
const getFormat = (filepath) => path.extname(filepath).slice(1);

export default ((filepath1, filepath2, format = 'stylish') => {
  const file1 = readFile(filepath1);
  const file2 = readFile(filepath2);
  const format1 = getFormat(filepath1);
  const format2 = getFormat(filepath2);
  const parsedFile1 = parser(file1, format1);
  const parsedFile2 = parser(file2, format2);
  const tree = getDiff(parsedFile1, parsedFile2);

  return formater(tree, format);
});
