// 运算符支持四则运算和括号
// 运算值类型支持整数

const opPriority = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};

const operators = ['+', '-', '*', '/'];
const constructAST = (str) => {
  if (!str) {
    return { value: 0 };
  }

  str = `(${str})`;

  let index = 0;

  // 解析数字
  const parseNumber = () => {
    let num = 0;
    while (str[index] >= '0' && str[index] <= '9') {
      num = num * 10 + +str[index];
      index += 1;
    }
    return num;
  };

  // 解析空
  const parseSpace = () => {
    while ([' ', '\n'].includes(str[index])) {
      index += 1;
    }
  };

  const parseOperator = () => {
    const operator = str[index];
    index += 1;
    return operator;
  };

  const addLeaf = (node, op, right) => {
    // 新操作符优先级高，更改右节点
    let newPriority = opPriority[op];
    if (newPriority > node.priority) {
      node.right = addLeaf(node.right, op, right);
      node.priority = newPriority;
      return node;
    }
    let left = node;
    return {
      value: op,
      left,
      right,
      priority: newPriority,
    };
  };

  const parseItem = () => {
    parseSpace();
    if (index < str.length) {
      let char = str[index];
      if (char >= '0' && char <= '9') {
        // 遇到数字
        return { value: parseNumber(), priority: 10 };
      }
      if (char === '(') {
        // 遇到括号
        return parseFormula();
      }
    }
    throw new Error('格式错误');
  };

  const parseFormula = () => {
    index += 1;
    let ast = parseItem();

    // eslint-disable-next-line
    while (true) {
      parseSpace();

      if (index >= str.length) {
        throw new Error('格式错误');
      }
      if (str[index] === ')') {
        index += 1;
        ast.priority = 10;
        return ast;
      }

      const operator = parseOperator();
      const right = parseItem();
      ast = addLeaf(ast, operator, right);
    }
  };

  return parseFormula();
};

const parseAst = (ast) => {
  if (operators.includes(ast.value)) {
    const left = parseAst(ast.left);
    const right = parseAst(ast.right);
    switch (ast.value) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      default:
        throw new Error('ast 错误');
    }
  }
  return ast.value;
};

const calc = (str) => {
  try {
    let ast = constructAST(str);
    return parseAst(ast);
  } catch (e) {
    document.getElementById('result').innerText = e.message;
  }
};
