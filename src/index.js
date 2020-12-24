window.onload = () => {
  const radius = 100;
  const circleCenter1 = [3 * radius, 3 * radius];
  const circleCenter2 = [500, 500];
  const speed1 = 2;
  const speed2 = 1.5;
  // const ball = document.getElementById('ball');
  const startTime = Date.now();
  const series = 1 / 10;

  function calcX(center, angel) {
    return center[0] + radius * Math.cos((Math.PI / 180) * angel);
  }

  function calcY(center, angel) {
    return center[1] + radius * Math.sin((Math.PI / 180) * angel);
  }

  function calcPosition() {
    const time = Date.now() - startTime;
    const angel1 = time * speed1 * series;
    const angel2 = time * speed2 * series;
    return [calcX(circleCenter2, angel2), calcY(circleCenter1, angel1)];
  }

  let interval = setInterval(() => {
    const [x, y] = calcPosition();
    const ball = document.createElement('div');
    ball.setAttribute('style', `left: ${x}px; top: ${y}px`);
    ball.setAttribute('class', 'ball');
    document.body.appendChild(ball);
    if (Date.now() - startTime > 10000) {
      clearInterval(interval);
    }
  }, 1000 / 16);
};
