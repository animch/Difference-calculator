import _ from 'lodash';

const makeString = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : String(value);
};

export default (nodes) => {
  const iter = (node, parent = '') => {
    const { type, key } = node;
    const allKeys = parent ? `${parent}.${key}` : `${key}`;
    switch (type) {
      case 'nested': {
        return node.children.flatMap((child) => iter(child, `${allKeys}`)).join('\n');
      }
      case 'added': {
        return `Property '${allKeys}' was added with value: ${makeString(node.value)}`;
      }
      case 'removed': {
        return `Property '${allKeys}' was removed`;
      }
      case 'updated': {
        return `Property '${allKeys}' was updated. From ${makeString(node.value1)} to ${makeString(node.value2)}`;
      }
      case 'unchanged': {
        return [];
      }
      default: {
        throw new Error(`Unknown type - ${type}`);
      }
    }
  };
  const result = nodes.flatMap((node) => iter(node));
  return result.join('\n').trim();
};
