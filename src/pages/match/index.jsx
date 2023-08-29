import React, { useEffect, useState } from "react";
import { Layout, Button, List } from "antd";
import "./index.css";
// import { generateMock, mockData } from "../../computing/mock/mock";
import { simpleComputing } from "../../computing/simple/simple";

const { Header, Content, Footer } = Layout;

export let realData = [];
// let players = ["日麻教父", "赤五教主", "艾斯艾芙", "小*豆"];

export const Match = ({ chars, endCallback }) => {
  const [players, setPlayers] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [data, setData] = useState();
  const [endDisabled, setEndDisabled] = useState(true);

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
    let isStart = true;
    let isGameStart = true;
    let isAllEnd = false;
    const timer = setInterval(() => {
      const data = simpleComputing(players, isStart, isGameStart);
      isStart = false;
      isGameStart = data.isGameStart;
      isAllEnd = data.allEnd;

      // generateMock();
      realData.push(data.data);
      if (isAllEnd) {
        setEndDisabled(false);
        clearInterval(timer);
        setData([...realData]);
        return;
      }
      setData([...realData]);
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [players]);

  useEffect(() => {
    const ele = document.getElementById("scrollableDiv");
    ele.scrollTop = ele.scrollHeight + 60;
  }, [data]);

  const onClick = () => {
    setData([]);
    setPlayers([]);
    endCallback();
  };

  return (
    <Layout className="layout">
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo">麻将经理人</div>
        <div className="right-button">
          <Button type="primary" disabled={endDisabled} onClick={onClick}>
            结束比赛
          </Button>
        </div>
      </Header>
      <Content
        style={{
          padding: "30px 50px 0 50px",
          flex: 1,
        }}
      >
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
