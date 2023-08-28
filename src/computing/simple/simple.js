import { reachMj } from "../rules/rules";

let xunNumber = 0;
let xiangting = {};
let isGameEnd = false;
let isAllEnd = false;
let points = {};
let seats = {
  e: "",
  s: "",
  w: "",
  n: "",
};
let gameFeng = "e";
let gameNumber = 0;
let benchang = 0;
let lizhibang = 0;
let liujuZhuangmeiting = false;

export const simpleComputing = (players, isStart, isGameStart) => {
  let data;
  let allEnd = false;
  let gameStart = isGameStart;

  if (isStart) {
    const pos = setPosition(players);
    seats.e = pos.e;
    seats.s = pos.s;
    seats.n = pos.n;
    seats.w = pos.w;
    data = `东风位：${seats.e} 南风位：${seats.s} 西风位：${seats.w} 北风位：${seats.n}`;
    points = {
      [pos.e]: 25000,
      [pos.s]: 25000,
      [pos.w]: 25000,
      [pos.n]: 25000,
    };
    xiangting = {
      [pos.e]: 14,
      [pos.s]: 14,
      [pos.w]: 14,
      [pos.n]: 14,
    };
  } else {
    if (gameStart) {
      data = `${getFengName(gameFeng)}场第${
        gameNumber + 1
      }局 ${benchang}本场 庄位：${seats.e}`;
      gameStart = false;
      const xiangtingWeight = {
        0: 0.01,
        1: 1,
        2: 3,
        3: 5,
        4: 5,
        5: 4,
        6: 2,
      };
      xiangting[seats.e] = weightRand(xiangtingWeight, 0);
      xiangting[seats.n] = weightRand(xiangtingWeight, 0);
      xiangting[seats.w] = weightRand(xiangtingWeight, 0);
      xiangting[seats.s] = weightRand(xiangtingWeight, 0);
    } else {
      if (isGameEnd) {
        data = `本局结束 积分：${seats.e}：${points[seats.e]} ${seats.n}：${
          points[seats.n]
        } ${seats.s}：${points[seats.s]} ${seats.w}：${points[seats.w]} `;
        gameStart = true;
        let newSeats = {
          e: seats.e,
          n: seats.n,
          w: seats.w,
          s: seats.s,
        };
        if (benchang === 0 || liujuZhuangmeiting === true) {
          newSeats = {
            e: seats.s,
            n: seats.e,
            w: seats.n,
            s: seats.w,
          };
          gameNumber++;
          if (gameNumber >= 4) {
            gameNumber = 0;
            gameFeng = getNextFeng(gameFeng);
          }
          liujuZhuangmeiting = false;
        }
        if (gameFeng === "w") {
          isAllEnd = true;
          gameStart = false;
        }
        seats = newSeats;
        isGameEnd = false;
        xunNumber = 0;
      } else if (isAllEnd) {
        let rank = [];
        for (let key in points) {
          rank.push({ name: key, points: points[key] });
        }
        rank = rank.sort((a, b) => b.points - a.points);
        data = `本场结束 总排名：第一位：${rank[0].name} 第二位：${rank[1].name} 第三位：${rank[2].name} 第四位：${rank[3].name} `;
        allEnd = true;
        points = {};
        xiangting = {};
        gameFeng = "e";
        gameNumber = 0;
        xunNumber = 0;
        benchang = 0;
        lizhibang = 0;
      } else {
        xunNumber++;
        if (xunNumber > 17) {
          data = `流局！`;
          getLiuju();
          isGameEnd = true;
        } else {
          xiangting = getShoupai(xiangting, players);
          if (xiangting[seats.e] === 0) {
            data = `第${xunNumber}巡 ${seats.e}听牌！${getTingpai()}！`;
          }
          if (xiangting[seats.n] === 0) {
            data = `第${xunNumber}巡 ${seats.n}听牌！${getTingpai()}！`;
          }
          if (xiangting[seats.w] === 0) {
            data = `第${xunNumber}巡 ${seats.w}听牌！${getTingpai()}！`;
          }
          if (xiangting[seats.s] === 0) {
            data = `第${xunNumber}巡 ${seats.s}听牌！${getTingpai()}！`;
          }
          if (xiangting[seats.e] < 0) {
            if (xunNumber === 1) {
              points[seats.e] +=
                48000 +
                16000 +
                benchang * reachMj.benchang +
                lizhibang * reachMj.lizhibang;
              for (let key in points) {
                points[key] -= 16000;
              }
              benchang++;
              data = `${seats.e} 天和！48000点`;
            } else {
              data = getHupai("e", players);
            }
            isGameEnd = true;
          } else if (xiangting[seats.n] < 0) {
            if (xunNumber === 1) {
              points[seats.n] +=
                32000 +
                8000 +
                benchang * reachMj.benchang +
                lizhibang * reachMj.lizhibang;
              for (let key in points) {
                points[key] -= 8000;
              }
              points[seats.e] -= 8000;
              benchang = 0;
              data = `${seats.n} 地和！32000点`;
            } else {
              data = getHupai("n", players);
            }
            isGameEnd = true;
          } else if (xiangting[seats.w] < 0) {
            if (xunNumber === 1) {
              points[seats.w] +=
                32000 +
                8000 +
                benchang * reachMj.benchang +
                lizhibang * reachMj.lizhibang;
              for (let key in points) {
                points[key] -= 8000;
              }
              points[seats.e] -= 8000;
              benchang = 0;
              data = `${seats.w} 地和！32000点`;
            } else {
              data = getHupai("w", players);
            }
            isGameEnd = true;
          } else if (xiangting[seats.s] < 0) {
            if (xunNumber === 1) {
              points[seats.s] +=
                32000 +
                8000 +
                benchang * reachMj.benchang +
                lizhibang * reachMj.lizhibang;
              for (let key in points) {
                points[key] -= 8000;
              }
              points[seats.e] -= 8000;
              benchang = 0;
              data = `${seats.s} 地和！32000点`;
            } else {
              data = getHupai("s", players);
            }
            isGameEnd = true;
          }
          if (!isGameEnd) {
            data = `第${xunNumber}巡 ${seats.e} ${
              xiangting[seats.e] === 0 ? "听牌" : `${xiangting[seats.e]}向听`
            } ${seats.n} ${
              xiangting[seats.n] === 0 ? "听牌" : `${xiangting[seats.n]}向听`
            } ${seats.w} ${
              xiangting[seats.w] === 0 ? "听牌" : `${xiangting[seats.w]}向听`
            } ${seats.s} ${
              xiangting[seats.s] === 0 ? "听牌" : `${xiangting[seats.s]}向听`
            }`;
          }
        }
      }
    }
  }

  return {
    data: data,
    isGameStart: gameStart,
    allEnd: allEnd,
  };
};

const FengName = {
  e: "东风",
  s: "南风",
  w: "西风",
  n: "北风",
};

const getPlayerDetail = (name, players) => {
  for (let i = 0; i < players.length; i++) {
    if (players[i].name === name) {
      return players[i];
    }
  }
  return;
};

const getFengName = (name) => {
  return FengName[name];
};

const getNextFeng = (name) => {
  switch (name) {
    case "e":
      return "s";
    case "s":
      return "w";
    case "w":
      return "n";
    case "n":
      return "e";
    default:
      return "e";
  }
};

const getTingpai = () => {
  const ran = Math.random() * 3;
  if (ran >= 0 && ran < 1) {
    return "副露听牌";
  } else if (ran >= 1 && ran < 2) {
    lizhibang++;
    return "立直听牌";
  } else if (ran >= 2 && ran < 3) {
    return "默听";
  }
};

const getShoupai = (xiangting, players) => {
  const newXiangting = {};
  for (let key in xiangting) {
    const ran = Math.random();
    const char = getPlayerDetail(key, players);
    const base =
      0.9 -
      ((char.lucky / 100) * 0.4 +
        (char.speed / 100) * 0.3 +
        (char.attack / 100) * 0.2 +
        (char.determination / 100) * 0.1);
    if (ran >= base) {
      newXiangting[key] = xiangting[key] - 1;
    } else {
      newXiangting[key] = xiangting[key];
    }
  }
  return newXiangting;
};

const getHupai = (pos, players, base = 0.5) => {
  const ran = Math.random();
  let way = "荣和";
  if (ran >= base) {
    way = "自摸和牌";
  }

  const pointran = weightRand(reachMj.pointWeight, 1);
  if (way === "荣和") {
    // const charran = Math.random() * 3;
    // let dianpao = "";
    // if (charran >= 0 && charran < 1) {
    //   dianpao = getNextFeng(pos);
    // } else if (charran >= 1 && charran < 2) {
    //   dianpao = getNextFeng(getNextFeng(pos));
    // } else if (charran >= 2 && charran < 3) {
    //   dianpao = getNextFeng(getNextFeng(getNextFeng(pos)));
    // }
    const weightChar = {
      1: 100 - getPlayerDetail(seats[getNextFeng(pos)], players).defense,
      2:
        100 -
        getPlayerDetail(seats[getNextFeng(getNextFeng(pos))], players).defense,
      3:
        100 -
        getPlayerDetail(
          seats[getNextFeng(getNextFeng(getNextFeng(pos)))],
          players
        ).defense,
    };
    const charran = weightRand(weightChar, 1);
    let dianpao = "";
    if (charran === 1) {
      dianpao = getNextFeng(pos);
    } else if (charran === 2) {
      dianpao = getNextFeng(getNextFeng(pos));
    } else if (charran === 3) {
      dianpao = getNextFeng(getNextFeng(getNextFeng(pos)));
    }
    let point = reachMj.pointRong[pointran];
    if (pos === "e") {
      point = point * 1.5;
      benchang++;
    }
    points[seats[pos]] +=
      point + benchang * reachMj.benchang + lizhibang * reachMj.lizhibang;
    points[seats[dianpao]] -= point;
    lizhibang = 0;
    return `${seats[dianpao]}放铳！${seats[pos]} ${way}${point}点`;
  } else {
    let point = reachMj.pointZimo[pointran];
    if (pos === "e") {
      point = point * 1.5;
      points[seats[pos]] +=
        point +
        Math.round(point / 3) +
        benchang * reachMj.benchang +
        lizhibang * reachMj.lizhibang;
      for (let key in points) {
        points[key] -= Math.round(point / 3);
      }
      benchang++;
    } else {
      points[seats[pos]] +=
        point +
        Math.round(point / 4) +
        benchang * reachMj.benchang +
        lizhibang * reachMj.lizhibang;
      for (let key in points) {
        points[key] -= Math.round(point / 4);
      }
      benchang = 0;
      points[seats["e"]] -= Math.round(point / 4);
    }
    lizhibang = 0;

    return `${seats[pos]} ${way}${point}点`;
  }
};

const getLiuju = () => {
  if (xiangting[seats.e] > 0) {
    liujuZhuangmeiting = true;
  }
  let tingpais = 0;
  for (let key in xiangting) {
    xiangting[key] === 0 && tingpais++;
  }
  if (tingpais === 1) {
    for (let key in points) {
      if (xiangting[key] === 0) {
        points[key] += 3000;
      } else {
        points[key] -= 1000;
      }
    }
  } else if (tingpais === 2) {
    for (let key in points) {
      if (xiangting[key] === 0) {
        points[key] += 1500;
      } else {
        points[key] -= 1500;
      }
    }
  } else if (tingpais === 3) {
    for (let key in points) {
      if (xiangting[key] === 0) {
        points[key] += 1000;
      } else {
        points[key] -= 3000;
      }
    }
  }
  benchang += 1;
};

const setPosition = (players) => {
  let position = { e: "", s: "", w: "", n: "" };
  players.forEach((v) => {
    position = recursionRandom(position, v.name);
  });
  return position;
};

const recursionRandom = (position, player) => {
  const ran = Math.random() * 4;
  if (ran >= 0 && ran < 1) {
    if (position.e !== "") {
      recursionRandom(position, player);
    } else {
      position.e = player;
    }
  } else if (ran >= 1 && ran < 2) {
    if (position.s !== "") {
      recursionRandom(position, player);
    } else {
      position.s = player;
    }
  } else if (ran >= 2 && ran < 3) {
    if (position.w !== "") {
      recursionRandom(position, player);
    } else {
      position.w = player;
    }
  } else if (ran >= 3 && ran < 4) {
    if (position.n !== "") {
      recursionRandom(position, player);
    } else {
      position.n = player;
    }
  }

  return position;
};

const weightRand = (weights, start) => {
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

  const pran = Math.random();
  let pointran = -1;
  for (let i = 0; i < weightArr.length; i++) {
    if (i === 0 && pran < weightArr[i]) {
      pointran = start;
    } else if (pran < weightArr[i] && pran > weightArr[i - 1]) {
      pointran = i + start;
    } else {
      continue;
    }
  }

  return pointran;
};
