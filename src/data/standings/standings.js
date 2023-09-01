import { makeAutoObservable } from "mobx";
import { initialStandings } from "./initial";

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
    initialStandings.forEach((s) => {
      this.standingMap[s] = standings[s];
    });
  }

  change(res, league) {
    this.standingMap[league] = res;
  }

  get(league) {
    return this.standingMap[league];
  }
}

export const standingsMap = new Standings();
