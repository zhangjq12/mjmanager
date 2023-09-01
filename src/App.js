import { useEffect, useState } from "react";
import "./App.css";
// import { Demo } from "./pages/demo/demo";
import { Home } from "./pages/home";
import { StartPage } from "./pages/start";
import { mockChar } from "./computing/mock/mock";
import { Calendar, Schedule } from "./computing/mock/calendar";
import { StandingsMock } from "./computing/mock/standings";
// import { Match } from "./pages/match";

function App() {
  // const [chars, setChars] = useState([]);
  const [page, setPage] = useState(1);
  // const callback = (chars) => {
  //   setChars(chars);
  //   setPage(2);
  // };
  // const endCallback = () => {
  //   setPage(1);
  // }
  const [data, setData] = useState();

  useEffect(() => {
    let originData = localStorage.getItem("SAVED_DATA");
    if (!originData) {
      setPage(1);
    } else {
      originData = JSON.parse(originData);
      setData(originData);
      setPage(2);
    }
  }, []);

  const callback = (res) => {
    const originData = {
      players: mockChar,
      mails: [
        {
          key: 1,
          label: "欢迎",
          read: true,
          content: "欢迎来到麻将经理人",
        },
      ],
      teamMembers: res,
      date: "2023/8/31",
      calendar: Calendar,
      schedule: Schedule,
      standings: StandingsMock,
    };
    setData(originData);
    setPage(2);
  };

  return (
    <div className="App">
      {page === 1 && <StartPage callback={callback} />}
      {page === 2 && <Home originData={data} />}
      {/* {page === 1 && <Demo callback={callback} />}
      {page === 2 && <Match chars={chars} endCallback={endCallback}/>} */}
    </div>
  );
}

export default App;
