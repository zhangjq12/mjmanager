import { makeAutoObservable } from "mobx";
// import { initialStandings } from "./initial";
import { scheduleGenerator } from "../schedule/schedule";

// export const standingMap = {
//   立直麻将联赛: ReachMjStandings,
//   天神杯: TianshenStandings,
// };

class Standings {
  standingMap = {};

  constructor() {
    makeAutoObservable(this);
  }

  init(standings) {
    if (!standings) return;
    scheduleGenerator.getMatchNames().forEach((s) => {
      this.standingMap[s] = standings[s];
    });
  }

  change(res, league) {
    this.standingMap[league] = res;
  }

  get(league) {
    return this.standingMap[league];
  }

  getMap() {
    return this.standingMap;
  }
}

export const standingsMap = new Standings();
