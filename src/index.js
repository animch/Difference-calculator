import _ from 'lodash';
import { readFileSync } from 'fs';

export default ((filepath1, filepath2) => {

  const dataRead = (path) => readFileSync(path, 'utf-8');
  const data1 = dataRead(filepath1);
  const data2 = dataRead(filepath2);

  const parsedData1 = JSON.parse(data1);
  const parsedData2 = JSON.parse(data2);

  const keys = _.sortBy(_.union(_.keys(parsedData1), _.keys(parsedData2)));

const makeDiffTree = (names, data1, data2) => {
  const result = names.reduce((acc, item) => {
    if(!_.has(data1, item)) {
      acc.push({ node: item, value: data2[item], status: 'added' });
    } else if(!_.has(data2, item)) {
      acc.push({ node: item, value: data1[item], status: 'deleted' });
    }
    else if(data1[item] === data2[item]) {
      acc.push({ node: item, value: data2[item], status: 'stable' });
    } else {
      acc.push({ node: item, value: data1[item], status: '1' },
      { node: item, value: data2[item], status: '2' });
    }
    return acc;
  }, []);
  return result;
};

const diffTree = makeDiffTree(keys, parsedData1, parsedData2);

const diffString = diffTree.reduce((acc, { node, value, status }) => {
  if(status === 'stable') {
    acc += `    ${node}: ${value}\n`;
  } else if(status === 'added') {
    acc += `  + ${node}: ${value}\n`;
  } else if(status === 'deleted') {
    acc += `  - ${node}: ${value}\n`;
  } else if(status === '1') {
    acc += `  - ${node}: ${value}\n`;
  } else {
    acc += `  + ${node}: ${value}\n`;
  }
  return acc;
}, '');
const result = `{\n${diffString}}`;

return result;
});