const constructMatrix = (before, after) => {
  const matrix = [];
  for (let i = 0; i < before.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < after.length; j++) {
      matrix[i][j] = {};
      if (before[i] === after[j]) {
        matrix[i][j] = {
          value: (i === 0 || j===0) ? 1 : matrix[i - 1][j - 1].value + 1,
          before: [i === 0 ? 0 : i - 1, j === 0 ? 0 : j - 1],
        };
        if (i === 0 && j === 0) {
          matrix[i][j].before = null;
        }
      } else {
        if (i === 0 && j === 0) {
          matrix[i][j] = {
            value: 0,
          };
        } else if (i === 0) {
          matrix[i][j] = {
            value: matrix[i][j-1].value,
            before: [i, j-1],
          };
        } else if (j === 0) {
          matrix[i][j] = {
            value: matrix[i - 1][j].value,
            before: [i - 1, j],
          };
        } else if (matrix[i-1][j].value > matrix[i][j-1].value) {
          matrix[i][j] = {
            value: matrix[i-1][j].value,
            before: [i - 1, j],
          };
        } else {
          matrix[i][j] = {
            value: matrix[i][j-1].value,
            before: [i, j-1],
          };
        }

      }
    }
  }
  return matrix;
}

const getDiffArr = (before, after, matrix) => {
  let x = before.length - 1;
  let y = after.length - 1;
  const beforeArr = [];
  const afterArr = [];
  while((x || y) && matrix[x][y].value) {
    while (1) {
      if (!matrix[x][y].before) {
        break;
      }
      let [lastX, lastY] = matrix[x][y].before;
      if (matrix[x][y].value !== matrix[lastX][lastY].value) {
        break;
      }
      x = lastX;
      y = lastY;
    }
    const beforeEndIndex = x;
    const afterEndIndex = y;
    let storeX = x;
    let storeY = y;
    while (1) {
      if (!matrix[x][y].before) {
        storeX = x;
        storeY = y;
        break;
      }
      let [lastX, lastY] = matrix[x][y].before;
      if (matrix[x][y].value === matrix[lastX][lastY].value) {
        break;
      }
      storeX = x;
      storeY = y;
      x = lastX;
      y = lastY;
    }
    beforeArr.unshift([storeX, beforeEndIndex]);
    afterArr.unshift([storeY, afterEndIndex]);
  }
  return [beforeArr, afterArr];
}

const diff = (before, after) => {
  const matrix = constructMatrix(before, after);
  const [beforeArr, afterArr] = getDiffArr(before, after, matrix);
  console.log(beforeArr, afterArr);
  let beforeDiffText = '';
  let afterDiffText = '';
  for (let i = 0 ; i< beforeArr.length;i++) {
    const [start, end] = beforeArr[i];
    const lastIndex = i === 0 ? 0 : beforeArr[i - 1][1] + 1;
    beforeDiffText += `<span class="before-change">${before.slice(lastIndex, start)}</span>`;
    beforeDiffText += `${before.slice(start, end + 1)}`
  }
  if (beforeArr.length > 0) {
    const lastEndIndex = beforeArr[beforeArr.length - 1][1];
    beforeDiffText += `<span class="before-change">${before.slice(lastEndIndex + 1, before.length)}</span>`;
  }
  for (let i = 0 ; i< afterArr.length;i++) {
    const [start, end] = afterArr[i];
    const lastIndex = i === 0 ? 0 : afterArr[i - 1][1] + 1;
    afterDiffText += `<span class="after-change">${after.slice(lastIndex, start)}</span>`;
    afterDiffText += `${after.slice(start, end + 1)}`
  }
  if (afterArr.length > 0) {
    const lastEndIndex = afterArr[afterArr.length - 1][1];
    afterDiffText += `<span class="after-change">${after.slice(lastEndIndex + 1, after.length)}</span>`;
  }
  return [beforeDiffText, afterDiffText];
}

const before = 'file:///E:/project/interesting/src/diff/index.html'
const after = 'file:///E:/project/interesting/srca/diff/index.html'
console.log(diff(before, after))
