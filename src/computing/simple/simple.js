import { reachMj } from "../rules/rules";
import { weightRand } from "./utils";

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
let isTingpai = {
  e: false,
  s: false,
  w: false,
  n: false,
};
let statistics = {};
let gameFeng = "e";
let gameNumber = 0;
let benchang = 0;
let lizhibang = 0;
let liujuZhuangmeiting = false;

export const simpleComputing = (players, isStart, isGameStart) => {
  let data = [];
  let allEnd = false;
  let gameStart = isGameStart;
  let finalRes;

  if (isStart) {
    const pos = setPosition(players);
    seats.e = pos.e;
    seats.s = pos.s;
    seats.n = pos.n;
    seats.w = pos.w;
    data.push(
      `东风位：${seats.e} 南风位：${seats.s} 西风位：${seats.w} 北风位：${seats.n}`
    );
    points = {
      [pos.e]: reachMj.yuandian,
      [pos.s]: reachMj.yuandian,
      [pos.w]: reachMj.yuandian,
      [pos.n]: reachMj.yuandian,
    };
    xiangting = {
      [pos.e]: 14,
      [pos.s]: 14,
      [pos.w]: 14,
      [pos.n]: 14,
    };
    statistics = {
      [pos.e]: {
        fulu: 0,
        lizhi: 0,
        points: [],
        fangchong: 0,
        zimo: 0,
        ronghu: 0,
        xunshu: [],
        lianzhuang: 0,
        weici: 0,
        changci: 0,
        jushu: 0,
      },
      [pos.s]: {
        fulu: 0,
        lizhi: 0,
        points: [],
        fangchong: 0,
        zimo: 0,
        ronghu: 0,
        xunshu: [],
        lianzhuang: 0,
        weici: 0,
        changci: 0,
        jushu: 0,
      },
      [pos.w]: {
        fulu: 0,
        lizhi: 0,
        points: [],
        fangchong: 0,
        zimo: 0,
        ronghu: 0,
        xunshu: [],
        lianzhuang: 0,
        weici: 0,
        changci: 0,
        jushu: 0,
      },
      [pos.n]: {
        fulu: 0,
        lizhi: 0,
        points: [],
        fangchong: 0,
        zimo: 0,
        ronghu: 0,
        xunshu: [],
        lianzhuang: 0,
        weici: 0,
        changci: 0,
        jushu: 0,
      },
    };
  } else {
    if (gameStart) {
      data.push(
        `${getFengName(gameFeng)}场第${
          gameNumber + 1
        }局 ${benchang}本场 庄位：${seats.e}`
      );
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
      xiangting[seats.e] = parseInt(weightRand(xiangtingWeight, 0));
      xiangting[seats.n] = parseInt(weightRand(xiangtingWeight, 0));
      xiangting[seats.w] = parseInt(weightRand(xiangtingWeight, 0));
      xiangting[seats.s] = parseInt(weightRand(xiangtingWeight, 0));
    } else {
      if (isGameEnd) {
        data.push(
          `本局结束 积分：${seats.e}：${points[seats.e]} ${seats.n}：${
            points[seats.n]
          } ${seats.s}：${points[seats.s]} ${seats.w}：${points[seats.w]} `
        );
        for (const name in statistics) {
          statistics[name].jushu++;
        }
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
        isTingpai = {
          e: false,
          n: false,
          w: false,
          s: false,
        };
      } else if (isAllEnd) {
        let rank = [];
        for (let key in points) {
          rank.push({ name: key, points: points[key] });
        }
        rank = rank.sort((a, b) => b.points - a.points);
        data.push(
          `本场结束 总排名：第一位：${rank[0].name} 第二位：${rank[1].name} 第三位：${rank[2].name} 第四位：${rank[3].name} `
        );
        let pts = [0, 0, 0, 0];
        for (let index = 1; index < pts.length; index++) {
          pts[index] =
            Math.round(
              ((rank[index].points - reachMj.fandian) / 1000 +
                reachMj.madian[index + 1]) *
                10
            ) / 10;
        }
        pts[0] = Math.round(-(pts[1] + pts[2] + pts[3]) * 10) / 10;
        allEnd = true;
        points = {};
        xiangting = {};
        gameFeng = "e";
        gameNumber = 0;
        xunNumber = 0;
        benchang = 0;
        lizhibang = 0;
        isGameEnd = false;
        isAllEnd = false;
        isTingpai = {
          e: false,
          n: false,
          w: false,
          s: false,
        };
        finalRes = {
          gameName: "",
          gameDate: "",
          results: [],
        };
        let i = 1;
        for (const key in rank) {
          statistics[rank[key].name].weici = [i];
          statistics[rank[key].name].changci = 1;
          statistics[rank[key].name].lianzhuang = [
            statistics[rank[key].name].lianzhuang,
          ];
          finalRes.results.push({
            id: getPlayerDetail(rank[key].name, players).id,
            name: rank[key].name,
            score: rank[key].points,
            pt: pts[key],
            statistics: statistics[rank[key].name],
          });
          i++;
        }
      } else {
        xunNumber++;
        if (xunNumber > 17) {
          data.push(`流局！`);
          getLiuju();
          isGameEnd = true;
        } else {
          xiangting = getShoupai(xiangting, players);
          if (xiangting[seats.e] === 0 && !isTingpai.e) {
            const { data: tingpai, statistic } = getTingpai("e", players);
            if (tingpai === "立直听牌") points[seats.e] -= 1000;
            data.push(`第${xunNumber}巡 ${seats.e}听牌！${tingpai}！`);
            isTingpai.e = true;
            statistics[seats.e].fulu += statistic.fulu;
            statistics[seats.e].lizhi += statistic.lizhi;
          }
          if (xiangting[seats.n] === 0 && !isTingpai.n) {
            const { data: tingpai, statistic } = getTingpai("n", players);
            if (tingpai === "立直听牌") points[seats.n] -= 1000;
            data.push(`第${xunNumber}巡 ${seats.n}听牌！${tingpai}！`);
            isTingpai.n = true;
            statistics[seats.n].fulu += statistic.fulu;
            statistics[seats.n].lizhi += statistic.lizhi;
          }
          if (xiangting[seats.w] === 0 && !isTingpai.w) {
            const { data: tingpai, statistic } = getTingpai("w", players);
            if (tingpai === "立直听牌") points[seats.w] -= 1000;
            data.push(`第${xunNumber}巡 ${seats.w}听牌！${tingpai}！`);
            isTingpai.w = true;
            statistics[seats.w].fulu += statistic.fulu;
            statistics[seats.w].lizhi += statistic.lizhi;
          }
          if (xiangting[seats.s] === 0 && !isTingpai.s) {
            const { data: tingpai, statistic } = getTingpai("s", players);
            if (tingpai === "立直听牌") points[seats.s] -= 1000;
            data.push(`第${xunNumber}巡 ${seats.s}听牌！${tingpai}！`);
            isTingpai.s = true;
            statistics[seats.s].fulu += statistic.fulu;
            statistics[seats.s].lizhi += statistic.lizhi;
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
              data.push(`${seats.e} 天和！48000点`);
              statistics[seats.e].zimo += 1;
              statistics[seats.e].points.push(48000);
              statistics[seats.e].xunshu.push(xunNumber);
              if (benchang >= 1 && statistics[seats.e].lianzhuang < benchang)
                statistics[seats.e].lianzhuang = benchang;
            } else {
              const { data: res, statistic } = getHupai("e", players);
              data.push(res);
              if (statistic.huWay === "荣和") {
                statistics[seats.e].ronghu += 1;
                statistics[seats[statistic.fangchong]].fangchong += 1;
              } else {
                statistics[seats.e].zimo += 1;
              }
              statistics[seats.e].points.push(statistic.point);
              statistics[seats.e].xunshu.push(xunNumber);
              if (benchang >= 1 && statistics[seats.e].lianzhuang < benchang)
                statistics[seats.e].lianzhuang = benchang;
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
              data.push(`${seats.n} 地和！32000点`);
              statistics[seats.n].zimo += 1;
              statistics[seats.n].points.push(32000);
              statistics[seats.n].xunshu.push(xunNumber);
              if (benchang >= 1 && statistics[seats.n].lianzhuang < benchang)
                statistics[seats.n].lianzhuang = benchang;
            } else {
              const { data: res, statistic } = getHupai("n", players);
              data.push(res);
              if (statistic.huWay === "荣和") {
                statistics[seats.n].ronghu += 1;
                statistics[seats[statistic.fangchong]].fangchong += 1;
              } else {
                statistics[seats.n].zimo += 1;
              }
              statistics[seats.n].points.push(statistic.point);
              statistics[seats.n].xunshu.push(xunNumber);
              if (benchang >= 1 && statistics[seats.n].lianzhuang < benchang)
                statistics[seats.n].lianzhuang = benchang;
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
              data.push(`${seats.w} 地和！32000点`);
              statistics[seats.w].zimo += 1;
              statistics[seats.w].points.push(32000);
              statistics[seats.w].xunshu.push(xunNumber);
              if (benchang >= 1 && statistics[seats.w].lianzhuang < benchang)
                statistics[seats.w].lianzhuang = benchang;
            } else {
              const { data: res, statistic } = getHupai("w", players);
              data.push(res);
              if (statistic.huWay === "荣和") {
                statistics[seats.w].ronghu += 1;
                statistics[seats[statistic.fangchong]].fangchong += 1;
              } else {
                statistics[seats.w].zimo += 1;
              }
              statistics[seats.w].points.push(statistic.point);
              statistics[seats.w].xunshu.push(xunNumber);
              if (benchang >= 1 && statistics[seats.w].lianzhuang < benchang)
                statistics[seats.w].lianzhuang = benchang;
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
              data.push(`${seats.s} 地和！32000点`);
              statistics[seats.s].zimo += 1;
              statistics[seats.s].points.push(32000);
              statistics[seats.s].xunshu.push(xunNumber);
              if (benchang >= 1 && statistics[seats.s].lianzhuang < benchang)
                statistics[seats.s].lianzhuang = benchang;
            } else {
              const { data: res, statistic } = getHupai("s", players);
              data.push(res);
              if (statistic.huWay === "荣和") {
                statistics[seats.s].ronghu += 1;
                statistics[seats[statistic.fangchong]].fangchong += 1;
              } else {
                statistics[seats.s].zimo += 1;
              }
              statistics[seats.s].points.push(statistic.point);
              statistics[seats.s].xunshu.push(xunNumber);
              if (benchang >= 1 && statistics[seats.s].lianzhuang < benchang)
                statistics[seats.s].lianzhuang = benchang;
            }
            isGameEnd = true;
          }
          if (!isGameEnd) {
            data.push(
              `第${xunNumber}巡 ${seats.e} ${
                xiangting[seats.e] === 0 ? "听牌" : `${xiangting[seats.e]}向听`
              } ${seats.n} ${
                xiangting[seats.n] === 0 ? "听牌" : `${xiangting[seats.n]}向听`
              } ${seats.w} ${
                xiangting[seats.w] === 0 ? "听牌" : `${xiangting[seats.w]}向听`
              } ${seats.s} ${
                xiangting[seats.s] === 0 ? "听牌" : `${xiangting[seats.s]}向听`
              }`
            );
          }
        }
      }
    }
  }

  return {
    data,
    isGameStart: gameStart,
    allEnd,
    finalRes,
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

const getTingpai = (pos, players) => {
  const detail = getPlayerDetail(seats[pos], players);
  const base = (detail.speed / 100) * 0.7 + (detail.determination / 100) * 0.3;
  const lizhibase = detail.determination / 100;

  const ran = Math.random();
  const lizhiran = Math.random();

  let res;
  if (ran >= base) {
    res = "副露听牌";
  } else if (ran < base && lizhiran >= lizhibase) {
    lizhibang++;
    res = "立直听牌";
  } else {
    res = "默听";
  }

  return {
    data: res,
    statistic: {
      fulu: res === "副露听牌" ? 1 : 0,
      lizhi: res === "立直听牌" ? 1 : 0,
    },
  };
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

const getHupai = (pos, players) => {
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

  let totalWeight = 0;
  for (const key in weightChar) {
    totalWeight += weightChar[key];
  }
  const weightHu = {
    0: 50,
    1: totalWeight,
  };
  // const ran = Math.random();
  const ran = parseInt(weightRand(weightHu, 0));
  let way = "荣和";
  if (ran === 0) {
    way = "自摸和牌";
  }

  const pointran = parseInt(weightRand(reachMj.pointWeight, 1));
  if (way === "荣和") {
    delete weightChar[0];
    // const charran = Math.random() * 3;
    // let dianpao = "";
    // if (charran >= 0 && charran < 1) {
    //   dianpao = getNextFeng(pos);
    // } else if (charran >= 1 && charran < 2) {
    //   dianpao = getNextFeng(getNextFeng(pos));
    // } else if (charran >= 2 && charran < 3) {
    //   dianpao = getNextFeng(getNextFeng(getNextFeng(pos)));
    // }
    const charran = parseInt(weightRand(weightChar, 1));
    let dianpao = "";
    if (charran === 1) {
      dianpao = getNextFeng(pos);
    } else if (charran === 2) {
      dianpao = getNextFeng(getNextFeng(pos));
    } else if (charran === 3) {
      dianpao = getNextFeng(getNextFeng(getNextFeng(pos)));
    }

    let point = reachMj.pointRong[pointran];
    if (pointran <= 4) {
      point = computingFushu(pointran);
      if (point >= 2000) point = 2000;
      if (point <= 250) point = 250;
    }

    if (pos === "e") {
      point = Math.ceil((point * 6) / 100) * 100;
      benchang++;
    } else {
      point = Math.ceil((point * 4) / 100) * 100;
      benchang = 0;
    }
    points[seats[pos]] +=
      point + benchang * reachMj.benchang + lizhibang * reachMj.lizhibang;
    points[seats[dianpao]] -= point + benchang * reachMj.benchang;
    lizhibang = 0;
    return {
      statistic: {
        fangchong: dianpao,
        point,
        huWay: way,
      },
      data: `${seats[dianpao]}放铳！${seats[pos]} ${way}${point}点`,
    };
  } else {
    let point = reachMj.pointZimo[pointran];
    if (pointran <= 4) {
      point = computingFushu(pointran);
      if (point >= 2000) point = 2000;
      if (point <= 250) point = 250;
      // point = Math.ceil(point * 4 / 100) * 100;
    }

    let finalPoint = 0;
    if (pos === "e") {
      const personalPoint = Math.ceil((point * 2) / 100) * 100;
      points[seats[pos]] +=
        personalPoint * 4 +
        benchang * reachMj.benchang +
        lizhibang * reachMj.lizhibang;
      for (let key in points) {
        points[key] -=
          personalPoint + Math.round((benchang * reachMj.benchang) / 3);
      }
      finalPoint = personalPoint * 3;
      benchang++;
    } else {
      const personalPoint = point;
      points[seats[pos]] +=
        Math.ceil((personalPoint * 2) / 100) * 100 +
        Math.ceil(personalPoint / 100) * 100 * 3 +
        benchang * reachMj.benchang +
        lizhibang * reachMj.lizhibang;
      for (let key in points) {
        points[key] -=
          Math.ceil(personalPoint / 100) * 100 +
          Math.round((benchang * reachMj.benchang) / 3);
      }
      benchang = 0;
      points[seats.e] +=
        Math.ceil(personalPoint / 100) * 100 -
        Math.ceil((personalPoint * 2) / 100) * 100;
      finalPoint =
        Math.ceil(personalPoint / 100) * 100 * 2 +
        Math.ceil((personalPoint * 2) / 100) * 100;
    }
    lizhibang = 0;

    return {
      statistic: {
        huWay: way,
        point: finalPoint,
      },
      data: `${seats[pos]} ${way}${finalPoint}点`,
    };
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

const computingFushu = (fanshu) => {
  const fushuWeight = reachMj.fushuWeight;
  const ran = parseInt(weightRand(fushuWeight, 20));
  return ran * Math.pow(2, parseInt(fanshu) + 2);
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
