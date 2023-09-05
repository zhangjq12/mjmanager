import { initialStandings } from "../../data/standings/initial";
import { scheduleGenerator } from "../../data/schedule/schedule";

export const initSchedule = (players, startDate) => {
  initialStandings.forEach((s) => {
    scheduleGenerator.init(
      players,
      s.name,
      startDate,
      s.isTeam,
      s.type === "杯赛",
      s.isWeekend
    );
  });
};
