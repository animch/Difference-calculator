import _ from 'lodash';
import { readFileSync } from 'fs';

export default ((filepath1, filepath2) => {
  const dataRead = (path) => readFileSync(path, 'utf-8');
  const file1 = dataRead(filepath1);
  const file2 = dataRead(filepath2);
  const parsedFile1 = JSON.parse(file1);
  const parsedFile2 = JSON.parse(file2);
  const keys = _.sortBy(_.union(_.keys(parsedFile1), _.keys(parsedFile2)));

  const getDiff = (data1, data2) => {
    const result = keys.map((key) => {
      if (!Object.hasOwn(data1, key)) {
        return `+ ${key}: ${data2[key]}`;
      } if (!Object.hasOwn(data2, key)) {
        return `- ${key}: ${data1[key]}`;
      } if (data1[key] !== data2[key]) {
        return `- ${key}: ${data1[key]}\n+ ${key}: ${data2[key]}`;
      }
      return `  ${key}: ${data2[key]}`;
    });
    return `{\n${result.join('\n')}\n}`;
  };
  return getDiff(parsedFile1, parsedFile2);
});
