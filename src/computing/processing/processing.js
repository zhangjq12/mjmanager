import { weightRand } from "../simple/simple";
import {
  ADVANTURES_NAMES,
  ADVANTURES_PROPERTY,
  DISEASES_NAMES,
  DISEASES_PERIOD,
  EVENTS,
} from "./statics";

export const continueGame = (players, chars) => {
  const p = players.map((v) => {
    if (v.injury && v.period > 0) {
      v.period--;
    }
    if (v.injury && v.period === 0) {
      v.injury = false;
    }
    return v;
  });
  const pM = modifyAbility(p);
  const events = randomEvents(pM);
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

  return {
    players: resP,
    messages: res,
  };
};

const modifyAbility = (players) => {
  return players.map((value) => {
    let v = JSON.parse(JSON.stringify(value));
    if (v.ca < v.pa) {
      if (v.age < 35) {
        if (v.determination > 70) {
          v.attack += 0.02;
          v.defense += 0.02;
          v.speed += 0.02;
        } else if (v.determination > 50) {
          v.attack += 0.01;
          v.defense += 0.01;
          v.speed += 0.01;
        } else {
          v.attack += 0.005;
          v.defense += 0.005;
          v.speed += 0.005;
        }
      }
    } else if (v.age > 50) {
      if (v.determination > 70) {
        v.attack -= 0.005;
        v.defense -= 0.005;
        v.speed -= 0.005;
      } else if (v.determination > 50) {
        v.attack -= 0.01;
        v.defense -= 0.01;
        v.speed -= 0.01;
      } else {
        v.attack -= 0.02;
        v.defense -= 0.02;
        v.speed -= 0.02;
      }
    }
    v.ca = v.attack / 3 + v.defense / 3 + v.speed / 3;
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
      const eventBase = 0.9;
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
