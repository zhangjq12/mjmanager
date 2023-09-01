import { simpleComputing } from "../simple/simple";

export const simulatingGame = async (players, gameName, gameDate) => {
  return new Promise((resolve) => {
    let isStart = true;
    let isGameStart = true;
    let isAllEnd = false;
    const timer = setInterval(() => {
      const data = simpleComputing(players, isStart, isGameStart);
      isStart = false;
      isGameStart = data.isGameStart;
      isAllEnd = data.allEnd;
      if (isAllEnd) {
        clearInterval(timer);
        const finalRes = data.finalRes;
        finalRes.gameName = gameName;
        finalRes.gameDate = gameDate;
        resolve(finalRes);
        return;
      }
    }, 1);
  })
}