import { useEffect, useState } from "react";
import "./App.css";
// import { Demo } from "./pages/demo/demo";
import { Home } from "./pages/home";
import { StartPage } from "./pages/start";
import { mockChar } from "./computing/mock/mock";
import { scheduleGenerator } from "./data/schedule/schedule";
import { initSchedule } from "./computing/schedule/schedule";
import { randomTeam } from "./computing/team/team";
import { ConfigProvider } from "antd";
import Color from "color";
// import { Match } from "./pages/match";

function App() {
  // const [chars, setChars] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // const callback = (chars) => {
  //   setChars(chars);
  //   setPage(2);
  // };
  // const endCallback = () => {
  //   setPage(1);
  // }
  const [data, setData] = useState();
  const [color, setColor] = useState("#1677ff");

  useEffect(() => {
    let originData = localStorage.getItem("SAVED_DATA");
    if (!originData) {
      setPage(1);
    } else {
      originData = JSON.parse(originData);
      setColor(originData.color);
      setData(originData);
      scheduleGenerator.load(originData.calendar, originData.schedule);
      setPage(2);
    }
  }, []);

  const callback = async (res, team, color) => {
    setLoading(true);
    const originData = await initGame(res, team, color);
    setLoading(false);
    setData(originData);
    console.log(Color(color).isDark());
    setColor(color);
    setPage(2);
  };

  const initGame = async (res, team, color) => {
    return new Promise((resolve) => {
      const StandingsInit = {};
      const { players, char: chars } = randomTeam(res, mockChar, team);

      initSchedule(players, "2023/8/31");

      const standingIsShow = {};
      scheduleGenerator.getMatchNames().forEach((s) => {
        const standing = {};
        players.forEach((p) => {
          standing[p.id] = 0;
        });

        if (!standingIsShow[s[0]]) {
          standingIsShow[s[0]] = 1;
          StandingsInit[s] = standing;
        }
      });

      const originData = {
        players,
        mails: [
          {
            key: 1,
            label: "欢迎",
            read: true,
            content: "欢迎来到麻将经理人",
          },
        ],
        teamMembers: chars,
        date: "2023/8/31",
        calendar: scheduleGenerator.getCalendar(),
        schedule: scheduleGenerator.getAll(),
        standings: StandingsInit,
        color: color,
      };

      resolve(originData);
    });
  };

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: color,
            colorLink: color,
            colorPrimaryText: Color(color).isDark() ? "#ffffff" : "#000000",
          },
          components: {
            Button: {
              colorTextLightSolid: Color(color).isDark()
                ? "#ffffff"
                : "#000000",
            },
            Menu: {
              colorTextLightSolid: Color(color).isDark()
                ? "#ffffff"
                : "#000000",
            },
          },
        }}
      >
        {/* <Spin tip="加载游戏中..." spinning={loading}> */}
        {page === 1 && <StartPage callback={callback} loading={loading} />}
        {/* </Spin> */}
        {page === 2 && <Home originData={data} color={color} />}
        {/* {page === 1 && <Demo callback={callback} />}
      {page === 2 && <Match chars={chars} endCallback={endCallback}/>} */}
      </ConfigProvider>
    </div>
  );
}

export default App;
