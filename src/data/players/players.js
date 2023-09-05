import { makeAutoObservable } from "mobx";

class Players {
  players = [];
  teams = [];

  constructor() {
    makeAutoObservable(this);
  }

  init(players) {
    if (!players) return;
    this.players = players.map((v) => {
      return {
        id: v.id,
        name: v.name,
        attack: v.attack,
        defense: v.defense,
        lucky: v.lucky,
        speed: v.speed,
        determination: v.determination,
        injury: v.injury,
        period: v.period,
        ca: v.ca,
        pa: v.pa,
        team: v.team,
      };
    });
  }

  randomTeamsGenerator() {

  }
}

export const playersInGame = new Players();
