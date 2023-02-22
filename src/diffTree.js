import _ from 'lodash';

const buildDiffTree = (data1, data2) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const sortKeys = _.sortBy(_.union(keys1, keys2));

  const result = sortKeys.map((key) => {
    if (_.isPlainObject(data1[key]) && _.isPlainObject(data2[key])) {
      return { type: 'nested', key, children: buildDiffTree(data1[key], data2[key]) };
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

export default buildDiffTree;
