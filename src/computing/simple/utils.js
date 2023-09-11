export const weightRand = (weights, start) => {
  let totalWeight = 0;
  for (let key in weights) {
    totalWeight += weights[key];
  }
  const weightArr = [];
  let rangeHead = 0;
  for (let key in weights) {
    const weight = weights[key] / totalWeight;
    weightArr.push(weight + rangeHead);
    rangeHead += weight;
  }

  const weightKeys = Object.keys(weights);

  if (start === undefined) {
    start = weightKeys[0];
  }

  const pran = Math.random();
  let pointran;
  for (let i = 0; i < weightArr.length; i++) {
    if (i === 0 && pran < weightArr[i]) {
      pointran = start;
    } else if (pran < weightArr[i] && pran > weightArr[i - 1]) {
      pointran = weightKeys[i];
    } else {
      continue;
    }
  }

  return pointran;
};
