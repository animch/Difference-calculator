import _ from 'lodash';

const replace = ' ';
const intendSize = (depth, spaceCount = 4) => replace.repeat(depth * spaceCount - 2);

const stringify = (data, depth) => {
  if (!_.isObject(data) || data === null) {
    return String(data);
  }
  const lines = Object.entries(data).map(([key, value]) => `${intendSize(depth + 1)}  ${key}: ${stringify(value, depth + 1)}`);
  const result = ['{', ...lines, `${intendSize(depth)}  }`].join('\n');
  return result;
};

const stylish = (tree) => {
  const iter = (node, depth) => {
    const types = node.type;
    const keys = node.key;
    switch (types) {
      case 'nested': {
        const nested = node.children;
        const childrens = nested.map((child) => iter(child, depth + 1));
        return `${intendSize(depth)}  ${keys}: {\n${childrens.join('\n')}\n${intendSize(depth)}  }`;
      }
      case 'added': {
        return `${intendSize(depth)}+ ${keys}: ${stringify(node.value, depth)}`;
      }
      case 'removed': {
        return `${intendSize(depth)}- ${keys}: ${stringify(node.value, depth)}`;
      }
      case 'updated': {
        const string1 = `${intendSize(depth)}- ${keys}: ${stringify(node.value1, depth)}`;
        const string2 = `${intendSize(depth)}+ ${keys}: ${stringify(node.value2, depth)}`;
        return [string1, string2].join('\n');
      }
      case 'unchanged': {
        return `${(intendSize(depth))}  ${keys}: ${stringify(node.value, depth)}`;
      }
      default: {
        return Error(`Unknown type - ${types}`);
      }
    }
  };
  const result = tree.map((node) => iter(node, 1));

  return ['{', ...result, '}'].join('\n');
};

export default stylish;
