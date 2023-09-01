import { weightRand } from "../simple/simple";
import {
  ADVANTURES_NAMES,
  ADVANTURES_PROPERTY,
  DISEASES_NAMES,
  DISEASES_PERIOD,
  EVENTS,
} from "./statics";
import { simulatingGame } from "../simulating/simulating";
import { standingsMap } from "../../data/standings/standings";

export const continueGame = async (
  players,
  chars,
  calendar,
  schedule,
  today,
  playersMap,
  singleGameRes,
  charWatched,
  charInvited
) => {
  const p = players.map((v) => {
    if (v.injury && v.period > 0) {
      v.period--;
    }
    if (v.injury && v.period === 0) {
      v.injury = false;
    }
    return v;
  });
  const pM = modifyAbility(p, calendar, today);
  const events = randomEvents(pM);

  const prevDay = new Date(
    new Date(today).setDate(new Date(today).getDate() - 1)
  ).toLocaleDateString();
  let gameResults;
  if (calendar[prevDay]) {
    gameResults = await processGame(
      singleGameRes,
      calendar,
      schedule,
      prevDay,
      charWatched,
      charInvited,
      playersMap
    );

    const standings = standingsMap.get(calendar[prevDay]);
    Object.keys(gameResults.results).forEach((v) => {
      if (v !== "otherGames") {
        gameResults.results[v].forEach((r) => {
          if (standings[r.id] === undefined) standings[r.id] = 0;
          standings[r.id] += r.pt;
        });
      } else {
        gameResults.results[v].forEach((arr) => {
          arr.forEach((a) => {
            if (standings[a.id] === undefined) standings[a.id] = 0;
            standings[a.id] += a.pt;
          });
        });
      }
    });
    standingsMap.change(standings, calendar[prevDay]);
  }

  const res = [];
  const resP = pM.map((v) => {
    if (events[v.id]) {
      if (events[v.id].type === "disease") {
        v.injury = events[v.id].name;
        v.period = events[v.id].period;
        const i = chars.findIndex((c) => c.id === v.id);
        if (i > -1) {
          res.push({
            title: `${v.name} 受到了 ${v.injury} 的侵袭`,
            content: `${v.name} 受到了 ${v.injury} 的侵袭，将要休息 ${v.period} 天。`,
          });
        }
      } else if (events[v.id].type === "advanture") {
        v[events[v.id].property] += events[v.id].range;
        v.ca = Math.round((v.attack + v.defense + v.speed) / 3);
        const i = chars.findIndex((c) => c.id === v.id);
        if (i > -1) {
          if (events[v.id].action === "+") {
            res.push({
              title: `${v.name} 得到奇遇！`,
              content: `${
                v.name
              } 在路边摊闲逛的时候遇到武林高手，此高手道：“看你骨骼精奇，必是练武奇才！”并将自己的功法传授于 ${
                v.name
              }，使其${events[v.id].name}!`,
            });
          } else {
            res.push({
              title: `${v.name} 收到挫折！`,
              content: `${v.name} 在小雀庄打牌时碰到赤木茂，被其吊打一整天。 ${
                v.name
              } 从此一蹶不振，其${events[v.id].name}很多!`,
            });
          }
        }
      }
    }
    return v;
  });

  const { match, message: matchMessage } = preMatch(
    chars,
    calendar,
    schedule,
    today,
    playersMap
  );

  if (matchMessage) {
    res.push(matchMessage);
  }

  if (gameResults) {
    const postMatchMessage = postMatch(gameResults, playersMap);

    if (postMatchMessage) {
      res.push(postMatchMessage);
    }
  }

  return {
    players: resP,
    messages: res,
    match,
  };
};

const modifyAbility = (players, calendar, today) => {
  const prevDay = new Date(
    new Date(today).setDate(new Date(today).getDate() - 1)
  ).toLocaleDateString();
  return players.map((value) => {
    let v = JSON.parse(JSON.stringify(value));
    if (v.ca < v.pa) {
      if (v.age < 35) {
        if (v.determination > 70) {
          v.attack += 0.02 * (calendar[prevDay] ? 2 : 1);
          v.defense += 0.02 * (calendar[prevDay] ? 2 : 1);
          v.speed += 0.02 * (calendar[prevDay] ? 2 : 1);
        } else if (v.determination > 50) {
          v.attack += 0.01 * (calendar[prevDay] ? 2.5 : 1);
          v.defense += 0.01 * (calendar[prevDay] ? 2.5 : 1);
          v.speed += 0.01 * (calendar[prevDay] ? 2.5 : 1);
        } else {
          v.attack += 0.005 * (calendar[prevDay] ? 3 : 1);
          v.defense += 0.005 * (calendar[prevDay] ? 3 : 1);
          v.speed += 0.005 * (calendar[prevDay] ? 3 : 1);
        }
      }
    } else if (v.age > 50) {
      if (v.determination > 70) {
        v.attack -= 0.005;
        v.defense -= 0.005;
        v.speed -= 0.005;
        if (calendar[prevDay]) {
          v.attack += 0.01;
          v.defense += 0.01;
          v.speed += 0.01;
        }
      } else if (v.determination > 50) {
        v.attack -= 0.01;
        v.defense -= 0.01;
        v.speed -= 0.01;
        if (calendar[prevDay]) {
          v.attack += 0.01;
          v.defense += 0.01;
          v.speed += 0.01;
        }
      } else {
        v.attack -= 0.02;
        v.defense -= 0.02;
        v.speed -= 0.02;
        if (calendar[prevDay]) {
          v.attack += 0.01;
          v.defense += 0.01;
          v.speed += 0.01;
        }
      }
    }
    v.ca = Math.round(v.attack / 3 + v.defense / 3 + v.speed / 3);
    return v;
  });
};

const randomEvents = (players) => {
  const events = {};
  const base = 0.9;
  for (const player of players) {
    const rand = Math.random();
    if (rand >= base) {
      const eventRand = Math.random();
      const eventBase = 1.1; // 开启伤病把base调成0.9
      if (eventRand >= eventBase) {
        const disease = weightRand(EVENTS.diseases);
        const periodStart = DISEASES_PERIOD[disease][0];
        const periodEnd = DISEASES_PERIOD[disease][1];
        const periodRand =
          Math.round(Math.random() * (periodEnd - periodStart)) + periodStart;
        events[player.id] = {
          type: "disease",
          id: disease,
          name: DISEASES_NAMES[disease],
          period: periodRand,
        };
      } else {
        const advanture = weightRand(EVENTS.advantures);
        const property = ADVANTURES_PROPERTY[advanture];
        let range = parseFloat((Math.random() * 2).toFixed(2));
        if (property.action === "-") {
          range = -range;
        }
        events[player.id] = {
          type: "advanture",
          id: property.property,
          name: ADVANTURES_NAMES[advanture],
          action: property.action,
          range,
        };
      }
    }
  }
  return events;
};

const preMatch = (chars, calendar, schedule, today, playersMap) => {
  const res = {};
  let message;
  if (calendar[today]) {
    message = {};
    for (const match of schedule[calendar[today]][today]) {
      let hasChar = [];
      const players = [];
      for (const id of match) {
        for (const char of chars) {
          if (id === char.id) {
            hasChar.push(char.id);
          }
        }
        players.push(playersMap[id]);
      }
      if (hasChar.length > 0) {
        hasChar.forEach((v) => {
          res[v] = [...players];
        });
      }
    }

    if (Object.keys(res).length > 0) {
      let content = `本次 ${calendar[today]} 出战选手有：`;
      for (const key in res) {
        content += `${playersMap[key].name} `;
      }
      content += "\n其中：\n";
      for (const key in res) {
        content += `${playersMap[key].name} 参加的对阵为：${res[key]
          .map((v) => v.name)
          .join("，")} 四位选手。\n`;
      }

      message.title = `${calendar[today]} 即将开战！`;
      message.content = content;
    } else {
      message.title = `${calendar[today]} 即将开战！`;
      message.content = `本次 ${calendar[today]} 无本队选手参赛。`;
    }
  }

  return {
    match: res,
    message,
  };
};

const postMatch = (matchResult, playersMap) => {
  if (matchResult) {
    return {
      title: `${matchResult.gameName} 比赛日结果`,
      content: `${matchResult.gameName} 激战正酣，${
        matchResult.gameDate
      } 进行的比赛结果如下：
    ${Object.keys(matchResult.results)
      .map((v) => {
        if (v === "otherGames") return "";
        const content = matchResult.results[v]
          .map((p, i) => {
            return `第${i + 1}名：${p.name} ${p.score} ${p.pt}`;
          })
          .join("\n");
        return `${playersMap[v].name} 参加的场次：\n${content}`;
      })
      .join("\n")}`,
    };
  } else {
    return;
  }
};

const processGame = async (
  singleGameRes,
  calendar,
  schedule,
  today,
  charWatched,
  charInvited,
  playersMap
) => {
  if (singleGameRes) {
    let gameRes = {
      gameName: calendar[today],
      gameDate: today,
      results: { otherGames: [] },
    };
    for (const match of schedule[calendar[today]][today]) {
      let boo = false;
      for (const player of match) {
        if (player.toString() === charWatched.toString()) {
          boo = true;
          break;
        }
      }
      if (!boo) {
        let charboo;
        for (const player of match) {
          for (const char of charInvited) {
            if (player.toString() === char.toString()) {
              charboo = char;
            }
          }
        }
        const matchRes = await simulatingGame(
          match.map((v) => playersMap[v]),
          calendar[today],
          today
        );
        if (charboo) {
          gameRes.results[charboo] = matchRes.results;
        } else {
          gameRes.results["otherGames"].push(matchRes.results);
        }
      } else {
        gameRes.results[charWatched] = singleGameRes.results;
        for (const player of match) {
          for (const char of charInvited) {
            if (
              char.toString() !== charWatched.toString() &&
              char.toString() === player.toString()
            ) {
              gameRes.results[char.toString()] = singleGameRes.results;
            }
          }
        }
      }
    }
    return gameRes;
  } else {
    let gameRes = {
      gameName: calendar[today],
      gameDate: today,
      results: { otherGames: [] },
    };
    for (const match of schedule[calendar[today]][today]) {
      let charboo = [];
      for (const player of match) {
        for (const char of charInvited) {
          if (player.toString() === char.toString()) {
            charboo.push(char);
          }
        }
      }
      const matchRes = await simulatingGame(
        match.map((v) => playersMap[v]),
        calendar[today],
        today
      );
      if (charboo.length > 0) {
        charboo.forEach((v) => {
          gameRes.results[v] = matchRes.results;
        })
      } else {
        gameRes.results["otherGames"].push(matchRes.results);
      }
    }
    return gameRes;
  }
};
