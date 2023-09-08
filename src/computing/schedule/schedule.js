import { initialStandings } from "../../data/standings/initial";
import { scheduleGenerator } from "../../data/schedule/schedule";

export const initSchedule = (players, startDate) => {
  const year = new Date(startDate).getFullYear();
  initialStandings.forEach((s) => {
    scheduleGenerator.init(
      players,
      s.name,
      `${year}/${s.startDate}`,
      s.isTeam,
      s.type === "杯赛",
      s.isWeekend
    );
  });
};
