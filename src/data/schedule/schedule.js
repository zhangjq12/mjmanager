import { makeAutoObservable } from "mobx";

class Schedule {
  schedule = {};
  calendar = {};
  matchNames = [];

  constructor() {
    makeAutoObservable(this);
  }

  init(players, league, startDate, isTeam, isCup, isWeekend) {
    if (!players || !league || !startDate) return;

    const teamMap = {};
    players.forEach((v) => {
      if (!teamMap[v.team]) teamMap[v.team] = [v.id];
      else teamMap[v.team].push(v.id);
    });

    const id = players.map((v) => v.id);

    if (!isCup) {
      if (isTeam) {
        const teams = Object.keys(teamMap);
        const schedule = generateLeagues(
          teams,
          startDate,
          isTeam,
          isWeekend,
          teamMap
        );
        this.schedule[league] = schedule;
        for (const key in schedule) {
          this.calendar[key] = league;
        }
      } else {
        const ids = [...id];
        const schedule = generateLeagues(ids, startDate, isTeam, isWeekend);
        this.schedule[league] = schedule;
        for (const key in schedule) {
          this.calendar[key] = league;
        }
      }
      this.matchNames.push([league]);
    } else {
      if (isTeam) {
      } else {
        const ids = [...id];
        const schedule = {};
        const time = new Date(startDate).getDay() + 1;
        const start = isWeekend
          ? nextCoupleDays(startDate, 6 - time)
          : time > 3
          ? nextCoupleDays(startDate, 10 - time)
          : nextCoupleDays(startDate, 3 - time);
        let realDate = start;
        let len = ids.length;
        while (len >= 4) {
          if (len > 32 && len <= 64) {
            len = 64;
          } else if (len > 16 && len <= 32) {
            len = 32;
          } else if (len > 8 && len <= 16) {
            len = 16;
          }
          len = len / 2;
          schedule[realDate] = {};
          realDate = nextCoupleDays(realDate, 7);
        }
        realDate = start;
        schedule[realDate] = generateCupRound(ids);

        const scheduleLen = Object.keys(schedule).length;
        let index = 1;
        for (const key in schedule) {
          let postfix = "";
          switch (scheduleLen - index) {
            case 0:
              postfix = "决赛";
              break;
            case 1:
              postfix = "半决赛";
              break;
            case 2:
              postfix = "1/4决赛";
              break;
            default:
              postfix = `第${index}轮`;
              break;
          }
          this.calendar[key] = league + " " + postfix;
          this.schedule[league + " " + postfix] = schedule;
          this.matchNames.push([league, postfix]);
          index++;
        }
      }
    }
  }

  setCupRivals(league, date, standings) {
    if (!this.getNextMatchDate(league, date)) return;

    let table = Object.keys(standings).map((key) => {
      return {
        key,
        pt: standings[key],
      };
    });
    table = table.sort((a, b) => b.pt - a.pt);
    const len = table.length;
    if (len > 32 && len < 64) {
      table.splice(-(len - 32));
    } else if (len > 16 && len < 32) {
      table.splice(-(len - 16));
    } else if (len > 8 && len < 16) {
      table.splice(-(len - 8));
    } else {
      table.splice(-len / 2);
    }
    this.schedule[league][this.getNextMatchDate(league, date)] =
      generateCupRound(table.map((v) => v.key));
  }

  getNextMatchDate(league, date) {
    const dates = Object.keys(this.schedule[league]);
    for (const d of dates) {
      if (new Date(d).getDate() > new Date(date).getDate()) {
        return d;
      }
    }
    return;
  }

  get(league) {
    return this.schedule[league];
  }

  getMatchNames() {
    return this.matchNames;
  }

  getCalendar() {
    return this.calendar;
  }

  getAll() {
    return this.schedule;
  }
}

const nextCoupleDays = (date, next) => {
  return new Date(
    new Date(date).setDate(new Date(date).getDate() + next)
  ).toLocaleDateString();
};

const generateLeagues = (ids, startDate, isTeam, isWeekend, teamMap) => {
  const schedule = {};
  const time = new Date(startDate).getDay() + 1;
  const start = isWeekend
    ? nextCoupleDays(startDate, 6 - time)
    : time > 3
    ? nextCoupleDays(startDate, 10 - time)
    : nextCoupleDays(startDate, 3 - time);
  let realDate = start;
  let round = ids.length - 1;
  if (isTeam) round = round * 4;
  for (let i = 0; i < round; i++) {
    let first = 0;
    let last = ids.length - 1;
    const oneday = [];
    while (last > first + 2) {
      if (isTeam) {
        oneday.push([
          teamMap[ids[first]][Math.floor(Math.random() * 4)],
          teamMap[ids[first + 1]][Math.floor(Math.random() * 4)],
          teamMap[ids[last - 1]][Math.floor(Math.random() * 4)],
          teamMap[ids[last]][Math.floor(Math.random() * 4)],
        ]);
      } else {
        oneday.push([ids[first], ids[first + 1], ids[last - 1], ids[last]]);
      }
      first += 2;
      last -= 2;
    }
    const middleIndex =
      Math.random() > 0.5
        ? Math.floor(oneday.length / 2)
        : Math.ceil(oneday.length / 2);
    const nextDay = oneday.splice(-middleIndex);
    schedule[realDate] = oneday;
    schedule[nextCoupleDays(realDate, 1)] = nextDay;
    const changedId = ids.splice(1, 1);
    ids.push(changedId[0]);

    realDate = nextCoupleDays(realDate, 7);
  }
  return schedule;
};

const generateCupRound = (ids) => {
  let len = ids.length;
  const oneday = [];
  let onematch = [];
  while (len > 0) {
    const index = Math.floor(Math.random() * len);
    onematch.push(ids[index]);
    if (onematch.length === 4) {
      oneday.push([...onematch]);
      onematch = [];
    }
    ids.splice(index, 1);
    len--;
  }
  return oneday;
};

export const scheduleGenerator = new Schedule();
