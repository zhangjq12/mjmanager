import React, { useEffect, useState } from "react";
import { Layout, Button, List, Segmented } from "antd";
import "./index.css";
// import { generateMock, mockData } from "../../computing/mock/mock";
import { simpleComputing } from "../../computing/simple/simple";
import Color from "color";

const { Header, Content, Footer } = Layout;

export let realData = [];
// let players = ["日麻教父", "赤五教主", "艾斯艾芙", "小*豆"];

export const Match = ({ chars, endCallback, today, gameName, color }) => {
  const [players, setPlayers] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [data, setData] = useState();
  const [endDisabled, setEndDisabled] = useState(true);
  const [res, setRes] = useState();

  const [speed, setSpeed] = useState("1x");

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const thisDate = date.toLocaleDateString();
      const thisTime = date.toLocaleTimeString();
      setCurrentTime(thisDate + " " + thisTime);
    }, 1000);

    setPlayers(chars);
    realData = [];

    return () => {
      clearInterval(timer);
    };
  }, [chars]);

  useEffect(() => {
    if (players.length === 0) {
      return;
    }

    let time = 1000;
    switch (speed) {
      case "2x":
        time = time / 2;
        break;
      case "4x":
        time = time / 4;
        break;
      case "8x":
        time = time / 8;
        break;
      default:
        break;
    }
    // let isStart = true;
    // let isGameStart = true;
    // let isAllEnd = false;
    const timer = setInterval(() => {
      const data = simpleComputing(players);
      // const isGameStart = data.isGameStart;
      const isAllEnd = data.allEnd;

      // generateMock();
      realData.push(...data.data);
      if (isAllEnd) {
        setEndDisabled(false);
        clearInterval(timer);
        setData([...realData]);

        const finalRes = data.finalRes;
        finalRes.gameName = gameName;
        finalRes.gameDate = today;
        setRes(finalRes);

        return;
      }
      setData([...realData]);
    }, time);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, speed]);

  useEffect(() => {
    const ele = document.getElementById("scrollableDiv");
    ele.scrollTop = ele.scrollHeight + 60;
  }, [data]);

  const onClick = () => {
    setData([]);
    setPlayers([]);
    endCallback(res);
  };

  return (
    <Layout className="layout">
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: Color(color).alpha(0.5),
        }}
      >
        <div
          className="demo-logo"
          style={{ color: Color(color).alpha(0.5).isDark() ? "#fff" : "#000" }}
        >
          麻将经理人
        </div>
        <div className="right-button">
          <Button type="primary" disabled={endDisabled} onClick={onClick}>
            结束比赛
          </Button>
        </div>
      </Header>
      <Content
        style={{
          padding: "0px 50px 30px 50px",
          flex: 1,
        }}
      >
        <div style={{ padding: "5px 16px" }}>
          <Segmented
            block
            options={["1x", "2x", "4x", "8x"]}
            value={speed}
            onChange={setSpeed}
          />
        </div>
        <div
          id="scrollableDiv"
          style={{
            height: "100%",
            overflow: "auto",
            padding: "0 16px",
            border: "1px solid rgba(140, 140, 140, 0.35)",
          }}
        >
          <List
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </div>
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
  );
};
