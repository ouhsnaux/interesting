const constructAST = (str) => {
  str = `(${str})`;
  let index = 0;

  const isLetter = (char) => /[a-zA-Z]/.test(char);

  const parseSpace = () => {
    while (str[index] === ' ') {
      index += 1;
    }
  };

  const parseOperator = () => {
    if (str[index] === '&' && str[index + 1] === '&') {
      index += 2;
      return '&&';
    }
    if (str[index] === '|' && str[index + 1] === '|') {
      index += 2;
      return '||';
    }
    throw new Error('格式错误');
  };

  const parseVar = () => {
    let startIndex = index;
    index += 1;
    while (isLetter(str[index])) {
      index += 1;
    }
    return str.slice(startIndex, index);
  };

  const parseItem = () => {
    parseSpace();
    if (index < str.length) {
      if (str[index] === '(') {
        return parseFormula();
      }
      if (isLetter(str[index])) {
        return parseVar();
      }
    }
    throw new Error('格式错误');
  };

  const addItem = (ast, op, item) => {
    const newAst = {
      type: op,
      value: ast.type === op ? ast.value : [ast],
      width: ast.width,
      depth: ast.depth,
    };
    if (op === '&&') {
      newAst.width += item.width || 1;
    } else {
      newAst.depth += item.depth || 1;
    }
    newAst.value.push(item);
    return newAst;
  };

  const parseFormula = () => {
    index += 1;
    let ast = { type: '&&', value: [], width: 1, depth: 1 };
    ast.value.push(parseItem());

    // eslint-disable-next-line
    while (true) {
      parseSpace();
      if (index >= str.length) {
        throw new Error('格式错误');
      }

      if (str[index] === ')') {
        index += 1;
        return ast;
      }

      const op = parseOperator();
      const item = parseItem();
      ast = addItem(ast, op, item);
    }
  };

  return parseFormula();
};

const paint = (ast, ctx) => {
  const allHeight = 500;
  const allWidth = 1000;
  const varHeight = 24;
  const varWidth = 100;

  const drawLine = (start, end) => {
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };

  const paintVar = (text, middle, center) => {
    const left = center - varWidth / 2;
    const top = middle - varHeight / 2;
    ctx.clearRect(left, top, varWidth, varHeight);
    ctx.strokeRect(left, top, varWidth, varHeight);
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.strokeText(text, center, middle + 6);
  };

  const paintAnd = (ast, left, top, width, height) => {
    let widthTotal = 0;
    const itemWidth = width / ast.width;
    ast.value.forEach((item) => {
      const { width: widthLevel = 1 } = item;
      paintItem(item, left + widthTotal * itemWidth, top, widthLevel * itemWidth, height);
      widthTotal += widthLevel;
    });
  };

  const paintOr = (ast, left, top, width, height) => {
    const middle = top + height / 2;
    const right = left + width;
    const itemWidth = 200;
    const leftVert = left + itemWidth / 4;
    const rightVert = right - itemWidth / 4;
    const itemHeight = height / ast.depth;
    drawLine([left, middle], [leftVert, middle]);
    let heightTotal = 0;
    let vertStart, vertEnd;
    ast.value.forEach((item) => {
      const { depth: depthLevel = 1 } = item;
      vertEnd = top + (heightTotal + depthLevel / 2) * itemHeight;
      if (vertStart) {
        drawLine([leftVert, vertStart], [leftVert, vertEnd]);
        drawLine([rightVert, vertStart], [rightVert, vertEnd]);
      }
      vertStart = vertEnd;
      paintItem(
        item,
        leftVert,
        top + heightTotal * itemHeight,
        width - itemWidth / 2,
        depthLevel * itemHeight
      );
      heightTotal += depthLevel;
    });
    drawLine([rightVert, middle], [right, middle]);
  };

  const paintItem = (ast, left, top, width, height) => {
    if (ast.type === '&&') {
      paintAnd(ast, left, top, width, height);
    } else if (ast.type === '||') {
      paintOr(ast, left, top, width, height);
    } else {
      const middle = top + height / 2;
      drawLine([left, middle], [left + width, middle]);
      paintVar(ast, middle, left + width / 2);
    }
  };
  ctx.clearRect(0, 0, allWidth, allHeight);
  paintItem(ast, 0, 0, allWidth, allHeight);
};

const draw = (value, ctx) => {
  try {
    const ast = constructAST(value);
    paint(ast, ctx);
    document.querySelector('#error').innerText = '转换成功';
  } catch (e) {
    console.error(e.message);
    document.querySelector('#error').innerText = e.message;
  }
};
