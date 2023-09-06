import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Badge,
  Drawer,
  Row,
  Col,
  Modal,
  Radio,
} from "antd";
import "./index.css";
import { MailIndex } from "../mailIndex";
import { LineUp } from "../lineUp";
import { Recruit } from "../recruit";
import { Training } from "../training";
import { Standings } from "../standings";
// import { mockChar } from "../../computing/mock/mock";
import { continueGame } from "../../computing/processing/processing";
// import { Calendar, Schedule } from "../../computing/mock/calendar";
import { Match } from "../match";
// import { StandingsMock } from "../../computing/mock/standings";
import { standingsMap } from "../../data/standings/standings";
import { observer } from "mobx-react-lite";
import { scheduleGenerator } from "../../data/schedule/schedule";

const { Header, Content, Footer } = Layout;

// const mockMails = [
//   {
//     key: 6,
//     label: "邮件1",
//     read: false,
//     content: "sb",
//   },
//   {
//     key: 5,
//     label: "邮件2",
//     read: false,
//     content: "sbsbsb",
//   },
//   {
//     key: 4,
//     label: "邮件3",
//     read: false,
//     content: "sbsbsbsbsbsb",
//   },
//   {
//     key: 3,
//     label: "邮件4",
//     read: true,
//     content: "sbsbsbsbsbsbsbsbsbsbsbsb",
//   },
//   {
//     key: 2,
//     label: "邮件5",
//     read: true,
//     content: "sbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsb",
//   },
//   {
//     key: 1,
//     label: "邮件6",
//     read: true,
//     content:
//       "sbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsb",
//   },
// ];

export const Home = observer(({ originData }) => {
  const [schedules] = useState(() => scheduleGenerator);

  const [currentTime, setCurrentTime] = useState("");
  const [menuKeys, setMenuKeys] = useState(1);
  const [mailBadgeCount, setMailBadgeCount] = useState(0);
  const [players, setPlayers] = useState([]);
  const [playersMap, setPlayersMap] = useState({});
  const [chars, setChars] = useState([]);
  const [today, setToday] = useState("");

  const [originMailData, setOriginMailData] = useState([]);
  const [mailData, setMailData] = useState([]);
  const [mailSelectedKey, setMailSelectedKey] = useState();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("日历");
  const [drawerClosable, setDrawerClosable] = useState(false);

  const [continueButton, setContinueButton] = useState("继续游戏");

  const [gameStart, setGameStart] = useState(false);
  const [gamePlayers, setGamePlayers] = useState([]);
  const [gameStartModalOpen, setGameStartModalOpen] = useState(false);
  const [charWatched, setCharWatched] = useState("");
  const [charInvited, setCharsInvited] = useState([]);
  const [matchPlayers, setMatchPlayers] = useState({});

  const [calendar, setCalendar] = useState({});
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    setCalendar(schedules.getCalendar());
    setSchedule(schedules.getAll());
  }, [schedules]);

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const thisDate = date.toLocaleDateString();
      const thisTime = date.toLocaleTimeString();
      setCurrentTime(thisDate + " " + thisTime);
    }, 1000);

    // const data = setMailReadStatus(mockMails);

    if (originData) {
      setPlayers(originData.players);
      setChars(originData.teamMembers);
      setToday(originData.date);
      standingsMap.init(originData.standings);

      const playersMap = {};
      for (const player of originData.players) {
        playersMap[player.id] = player;
      }
      setPlayersMap(playersMap);

      const { res: data, lastIndex } = setMailReadStatus(originData.mails);
      originData.mails[lastIndex].read = true;
      setOriginMailData(originData.mails);
      setMailData(data);
      setMailBadgeCount(data.filter((v) => !v.read).length);

      if (originData.calendar[originData.date] && originData.match) {
        setCharsInvited(Object.keys(originData.match));
        setMatchPlayers(originData.match);
        setContinueButton("进行比赛");
      }
    }

    return () => {
      clearInterval(timer);
    };
  }, [originData]);

  const setMailReadStatus = (itemsMap) => {
    let lastUnRead = 0;
    let lastIndex = 0;
    const res = itemsMap.map((v, i) => {
      const res = {
        key: v.key,
        label: v.label,
        originLabel: v.label,
        read: v.read,
        content: v.content,
      };
      if (!v.read) {
        res.label = (
          <Badge dot>
            <span style={{ fontWeight: "bold" }}>{v.label}</span>
          </Badge>
        );
        lastUnRead = v.key;
        lastIndex = i;
      }
      setMailSelectedKey(lastUnRead.toString());

      return res;
    });

    if (res.length > 0) {
      res[lastIndex].label = res[lastIndex].originLabel;
      res[lastIndex].read = true;
    }

    return { res, lastIndex };
  };

  const mailSelectedCallback = (info) => {
    const index = mailData.findIndex((v) => v.key === parseInt(info.key));
    const mailItems = mailData;
    const originMailItems = originMailData;
    if (!mailItems[index].read) {
      mailItems[index].label = mailItems[index].originLabel;
      mailItems[index].read = true;
      originMailItems[index].read = true;
    }
    setMailBadgeCount(mailItems.filter((v) => !v.read).length);
    // setMailItems([...mailItems]);
    setOriginMailData([...originMailItems]);
    setMailSelectedKey(info.key);
  };

  const onContinueGame = async () => {
    if (continueButton === "继续游戏") {
      let thisDay = new Date(today);
      setDrawerTitle("进行中……");
      setDrawerClosable(false);
      setDrawerOpen(true);
      await processing(thisDay);
    } else if (continueButton === "进行比赛") {
      setGameStartModalOpen(true);
    }
  };

  const processing = async (thisDay, singleGameRes = undefined) => {
    thisDay = new Date(thisDay);
    thisDay = new Date(
      thisDay.setDate(thisDay.getDate() + 1)
    ).toLocaleDateString();

    const {
      players: newP,
      messages,
      match,
    } = await continueGame(
      players,
      chars,
      calendar,
      schedule,
      thisDay,
      playersMap,
      singleGameRes,
      charWatched,
      charInvited
    );
    setPlayers(newP);

    if (messages.length > 0) {
      const newMailData = [...mailData];
      const newOriginMailData = [...originMailData];
      messages.forEach((v) => {
        newMailData.unshift({
          key: newMailData.length + 1,
          read: false,
          label: v.title,
          content: v.content,
        });
        newOriginMailData.unshift({
          key: newOriginMailData.length + 1,
          read: false,
          label: v.title,
          content: v.content,
        });
      });
      const { res: data, lastIndex } = setMailReadStatus(newMailData);
      newOriginMailData[lastIndex].read = true;
      setMailData(data);
      setOriginMailData(newOriginMailData);
      setMailBadgeCount(data.filter((v) => !v.read).length);
      setToday(thisDay);
      setDrawerOpen(false);
      if (Object.keys(match).length > 0) {
        setCharsInvited(Object.keys(match));
        setMatchPlayers(match);
        setContinueButton("进行比赛");
      } else {
        setContinueButton("继续游戏");
      }

      localStorage.setItem(
        "SAVED_DATA",
        JSON.stringify({
          players: players,
          mails: newOriginMailData,
          teamMembers: chars,
          date: thisDay,
          calendar: calendar,
          schedule: schedule,
          standings: standingsMap.standingMap,
          match: match,
        })
      );
    } else {
      setToday(thisDay);
      setTimeout(() => {
        processing(thisDay);
      }, 1000);
    }
  };

  const endCallback = async (res) => {
    setGameStart(false);
    let thisDay = new Date(today);
    setDrawerTitle("进行中……");
    setDrawerClosable(false);
    setDrawerOpen(true);
    await processing(thisDay, res);
  };

  const onRestart = () => {
    localStorage.clear();
    window.location.reload();
  };

  const menuNode = [
    {
      key: 1,
      label: (
        <Badge count={mailBadgeCount}>
          <span>收件箱</span>
        </Badge>
      ),
    },
    {
      key: 2,
      label: "阵容",
    },
    // {
    //   key: 3,
    //   label: "招募",
    // },
    // {
    //   key: 4,
    //   label: "训练",
    // },
    {
      key: 5,
      label: "排名",
    },
  ];

  const calendarNodes = () => {
    const nextDay = new Date(
      new Date(today).setDate(new Date(today).getDate() + 1)
    ).toLocaleDateString();
    const thirdDay = new Date(
      new Date(today).setDate(new Date(today).getDate() + 2)
    ).toLocaleDateString();
    const forthDay = new Date(
      new Date(today).setDate(new Date(today).getDate() + 3)
    ).toLocaleDateString();
    const fifthDay = new Date(
      new Date(today).setDate(new Date(today).getDate() + 4)
    ).toLocaleDateString();
    const sixthDay = new Date(
      new Date(today).setDate(new Date(today).getDate() + 5)
    ).toLocaleDateString();
    return (
      <Row gutter={[8, 8]} style={{ height: "100%" }}>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{today}</p>
            {Object.keys(calendar).findIndex((v) => v === today) > -1 && (
              <div>{calendar[today]}</div>
            )}
          </div>
        </Col>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{nextDay}</p>
            {Object.keys(calendar).findIndex((v) => v === nextDay) > -1 && (
              <div>{calendar[nextDay]}</div>
            )}
          </div>
        </Col>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{thirdDay}</p>
            {Object.keys(calendar).findIndex((v) => v === thirdDay) > -1 && (
              <div>{calendar[thirdDay]}</div>
            )}
          </div>
        </Col>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{forthDay}</p>
            {Object.keys(calendar).findIndex((v) => v === forthDay) > -1 && (
              <div>{calendar[forthDay]}</div>
            )}
          </div>
        </Col>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{fifthDay}</p>
            {Object.keys(calendar).findIndex((v) => v === fifthDay) > -1 && (
              <div>{calendar[fifthDay]}</div>
            )}
          </div>
        </Col>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{sixthDay}</p>
            {Object.keys(calendar).findIndex((v) => v === sixthDay) > -1 && (
              <div>{calendar[sixthDay]}</div>
            )}
          </div>
        </Col>
      </Row>
    );
  };

  return !gameStart ? (
    <>
      <Layout className="layout">
        <Header
          style={{
            height: window.innerWidth <= 576 ? "128px" : "64px",
          }}
          // style={{
          //   display: "flex",
          //   alignItems: "center",
          // }}
        >
          <Row>
            <Col xs={24} sm={24} md={6}>
              <div className="demo-logo">
                麻将经理人{" "}
                <Button type="primary" onClick={onRestart}>
                  重开档
                </Button>
              </div>
            </Col>
            <Col xs={4} sm={4} md={12}>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                items={menuNode}
                onClick={(info) => {
                  setMenuKeys(parseInt(info.key));
                }}
              />
            </Col>
            <Col xs={20} sm={20} md={6}>
              <div className="right-button">
                <div
                  style={{ padding: "0 5px", color: "white" }}
                  onClick={() => {
                    setDrawerTitle("未来日程");
                    setDrawerClosable(true);
                    setDrawerOpen(true);
                  }}
                >
                  今日日期：{today}
                </div>
                <Button type="primary" onClick={onContinueGame}>
                  {continueButton}
                </Button>
              </div>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            padding: "30px 50px 0 50px",
            flex: 1,
          }}
        >
          {menuKeys === 1 ? (
            <MailIndex
              data={mailData}
              selectedKey={mailSelectedKey}
              onSelect={mailSelectedCallback}
            />
          ) : menuKeys === 2 ? (
            <LineUp players={chars} />
          ) : menuKeys === 3 ? (
            <Recruit />
          ) : menuKeys === 4 ? (
            <Training />
          ) : menuKeys === 5 ? (
            <Standings standings={standingsMap} playersMap={playersMap} />
          ) : null}
        </Content>
        <Footer
          style={{
            textAlign: "center",
            height: "100px",
          }}
        >
          当前时间：{currentTime}
        </Footer>
      </Layout>
      <Drawer
        title={drawerTitle}
        placement={"top"}
        closable={false}
        open={drawerOpen}
        maskClosable={drawerClosable}
        height={200}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        {calendarNodes()}
      </Drawer>
      <Modal
        title="观看比赛"
        onCancel={() => {
          setGameStartModalOpen(false);
        }}
        onOk={() => {
          // let resChar = [];
          // for (const match of schedule[calendar[today]][today]) {
          //   let boo = false;
          //   for (const player of match) {
          //     if (player.toString() === charWatched.toString()) {
          //       boo = true;
          //       resChar = match.map((v) => {
          //         return playersMap[v];
          //       });
          //       break;
          //     }
          //   }
          //   if (boo) break;
          // }

          setGamePlayers(matchPlayers[charWatched]);
          setGameStart(true);
          setGameStartModalOpen(false);
        }}
        open={gameStartModalOpen}
      >
        <div>选择你要观看的队员：</div>
        <Radio.Group
          options={charInvited.map((v) => {
            return {
              label: playersMap[v].name,
              value: v,
            };
          })}
          onChange={({ target: { value } }) => {
            setCharWatched(value);
          }}
        />
      </Modal>
    </>
  ) : (
    <Match
      chars={gamePlayers}
      endCallback={endCallback}
      date={today}
      gameName={calendar[today]}
    />
  );
});
