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
import { mockChar } from "../../computing/mock/mock";
import { continueGame } from "../../computing/processing/processing";
import { Calendar, REACHMJ_SCHEDULE } from "../../computing/mock/calendar";
import { Match } from "../match";

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

export const Home = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [menuKeys, setMenuKeys] = useState(1);
  const [mailBadgeCount, setMailBadgeCount] = useState(0);
  const [players, setPlayers] = useState([]);
  const [playersMap, setPlayersMap] = useState({});
  const [chars, setChars] = useState([]);
  const [today, setToday] = useState("");

  const [mailData, setMailData] = useState([]);
  const [mailSelectedKey, setMailSelectedKey] = useState();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("日历");

  const [continueButton, setContinueButton] = useState("继续游戏");

  const [gameStart, setGameStart] = useState(false);
  const [gamePlayers, setGamePlayers] = useState([]);
  const [gameStartModalOpen, setGameStartModalOpen] = useState(false);
  const [charWatched, setCharWatched] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const thisDate = date.toLocaleDateString();
      const thisTime = date.toLocaleTimeString();
      setCurrentTime(thisDate + " " + thisTime);
    }, 1000);

    // const data = setMailReadStatus(mockMails);
    let originData = localStorage.getItem("SAVED_DATA");
    if (!originData) {
      originData = {
        players: mockChar,
        mails: [
          {
            key: 1,
            label: "欢迎",
            read: false,
            content: "欢迎来到麻将经理人",
          },
        ],
        teamMembers: [mockChar[0], mockChar[1]],
        date: "2023/8/31",
      };
    }

    setPlayers(originData.players);
    setChars(originData.teamMembers);
    setToday(originData.date);

    const playersMap = {};
    for (const player of originData.players) {
      playersMap[player.id] = player;
    }
    setPlayersMap(playersMap);

    const data = setMailReadStatus(originData.mails);
    setMailData(data);
    setMailBadgeCount(data.filter((v) => !v.read).length);

    return () => {
      clearInterval(timer);
    };
  }, []);

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

    return res;
  };

  const mailSelectedCallback = (info) => {
    const index = mailData.findIndex((v) => v.key === parseInt(info.key));
    const mailItems = mailData;
    if (!mailItems[index].read) {
      mailItems[index].label = mailItems[index].originLabel;
      mailItems[index].read = true;
    }
    setMailBadgeCount(mailItems.filter((v) => !v.read).length);
    // setMailItems([...mailItems]);
    setMailSelectedKey(info.key);
  };

  const onContinueGame = async () => {
    if (continueButton === "继续游戏") {
      let thisDay = new Date(today);
      setDrawerTitle("进行中……");
      setDrawerOpen(true);
      await processing(thisDay);
    } else if (continueButton === "进行比赛") {
      setGameStartModalOpen(true);
    }
  };

  const processing = async (thisDay) => {
    thisDay = new Date(thisDay);
    thisDay = new Date(
      thisDay.setDate(thisDay.getDate() + 1)
    ).toLocaleDateString();

    const { players: newP, messages } = continueGame(players, chars);
    setPlayers(newP);

    if (messages.length > 0 || Calendar[thisDay] !== undefined) {
      const newMailData = [...mailData];
      messages.forEach((v) => {
        newMailData.unshift({
          key: newMailData.length + 1,
          read: false,
          label: v.title,
          content: v.content,
        });
      });
      const data = setMailReadStatus(newMailData);
      setMailData(data);
      setMailBadgeCount(data.filter((v) => !v.read).length);
      setToday(thisDay);
      setDrawerOpen(false);
      if (Calendar[thisDay] !== undefined) {
        setContinueButton("进行比赛");
      }
    } else {
      setToday(thisDay);
      setTimeout(() => {
        processing(thisDay);
      }, 1000);
    }
  };

  const endCallback = () => {
    setGameStart(false);
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
    {
      key: 3,
      label: "招募",
    },
    {
      key: 4,
      label: "训练",
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
            {Object.keys(Calendar).findIndex((v) => v === today) > -1 && (
              <div>{Calendar[today]}</div>
            )}
          </div>
        </Col>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{nextDay}</p>
            {Object.keys(Calendar).findIndex((v) => v === nextDay) > -1 && (
              <div>{Calendar[nextDay]}</div>
            )}
          </div>
        </Col>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{thirdDay}</p>
            {Object.keys(Calendar).findIndex((v) => v === thirdDay) > -1 && (
              <div>{Calendar[thirdDay]}</div>
            )}
          </div>
        </Col>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{forthDay}</p>
            {Object.keys(Calendar).findIndex((v) => v === forthDay) > -1 && (
              <div>{Calendar[forthDay]}</div>
            )}
          </div>
        </Col>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{fifthDay}</p>
            {Object.keys(Calendar).findIndex((v) => v === fifthDay) > -1 && (
              <div>{Calendar[fifthDay]}</div>
            )}
          </div>
        </Col>
        <Col span={4}>
          <div
            style={{ backgroundColor: "rgb(245, 245, 245)", height: "100%" }}
          >
            <p>{sixthDay}</p>
            {Object.keys(Calendar).findIndex((v) => v === sixthDay) > -1 && (
              <div>{Calendar[sixthDay]}</div>
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
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="demo-logo">麻将经理人</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={menuNode}
            onClick={(info) => {
              setMenuKeys(parseInt(info.key));
            }}
          />
          <div className="right-button">
            <div style={{ padding: "0 10px", color: "white" }}>
              今日日期：{today}
            </div>
            <Button type="primary" onClick={onContinueGame}>
              {continueButton}
            </Button>
          </div>
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
            <LineUp />
          ) : menuKeys === 3 ? (
            <Recruit />
          ) : menuKeys === 4 ? (
            <Training />
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
        maskClosable={false}
        height={200}
      >
        {calendarNodes()}
      </Drawer>
      <Modal
        title="观看比赛"
        onCancel={() => {
          setGameStartModalOpen(false);
        }}
        onOk={() => {
          let resChar = [];
          for (const match of REACHMJ_SCHEDULE[today]) {
            let boo = false;
            for (const player of match) {
              if (player.toString() === charWatched.toString()) {
                boo = true;
                resChar = match.map((v) => {
                  return playersMap[v];
                });
                break;
              }
            }
            if (boo) break;
          }

          setGamePlayers(resChar);
          setGameStart(true);
        }}
        open={gameStartModalOpen}
      >
        <div>选择你要观看的队员：</div>
        <Radio.Group
          options={chars.map((v) => {
            return {
              label: v.name,
              value: v.id,
            };
          })}
          onChange={({ target: { value } }) => {
            setCharWatched(value);
          }}
        />
      </Modal>
    </>
  ) : (
    <Match chars={gamePlayers} endCallback={endCallback} />
  );
};
