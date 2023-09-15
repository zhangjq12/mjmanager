import React, { useEffect, useState } from "react";
import {
  Layout,
  Button,
  Checkbox,
  Row,
  Col,
  Descriptions,
  message,
  Spin,
  Input,
  ColorPicker,
} from "antd";
import "./index.css";
import { mockChar } from "../../computing/mock/mock";

const { Header, Content, Footer } = Layout;

export const StartPage = ({ callback, loading }) => {
  const [chars, setChars] = useState([]);
  const [names, setNames] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [team, setTeam] = useState("");
  const [color, setColor] = useState("#1677ff");

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const thisDate = date.toLocaleDateString();
      const thisTime = date.toLocaleTimeString();
      setCurrentTime(thisDate + " " + thisTime);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setChars(mockChar);
  }, []);

  const onClick = () => {
    if (names.length === 4 && team.length > 0) callback(names, team, color);
    else {
      if (names.length === 0) message.error("要选够4人开始");
      else if (team.length === 0) message.error("请填写队伍名称");
    }
  };

  const checkboxChange = (arr) => {
    const thisChars = [];
    for (const j of arr) {
      for (const i of chars) {
        if (j === i.name) {
          thisChars.push(i);
          const items = {
            title: i.name,
            items: [
              { key: 1, label: "攻击力", children: i.attack },
              { key: 2, label: "防御力", children: i.defense },
              { key: 3, label: "运气值", children: i.lucky },
              { key: 4, label: "速度值", children: i.speed },
              { key: 5, label: "意志力", children: i.determination },
            ],
          };
          setDescriptions(items);
          break;
        }
      }
    }
    setNames(thisChars);
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
      </Header>
      <Content
        style={{
          padding: "30px 50px 30px 50px",
          flex: 1,
          height: "100%",
        }}
      >
        <Row gutter={16} style={{ height: "100%" }}>
          <Col
            span={8}
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div style={{ fontSize: 16, padding: "5px 0", height: "30px" }}>
              填写你的队伍名称：
            </div>
            <Input
              value={team}
              onChange={(e) => {
                setTeam(e.target.value);
              }}
              style={{ width: "100%", height: "30px" }}
            />
            <div style={{ fontSize: 16, padding: "5px 0", height: "30px" }}>
              选择队伍主色调：
            </div>
            <ColorPicker
              disabledAlpha
              value={color}
              onChangeComplete={(color) => {
                setColor(color.toHexString());
              }}
              presets={[
                {
                  label: "推荐颜色",
                  colors: [
                    "#000000",
                    "#F5222D",
                    "#FA8C16",
                    "#FADB14",
                    "#8BBB11",
                    "#52C41A",
                    "#13A8A8",
                    "#1677FF",
                    "#2F54EB",
                    "#722ED1",
                    "#EB2F96",
                  ],
                },
              ]}
            />
            <div style={{ fontSize: 16, padding: "5px 0", height: "40px" }}>
              选择四个人物进入队伍：
            </div>
            <div
              style={{
                overflow: "auto",
                flex: 1,
                height: "100%",
                border: "1px solid rgba(140, 140, 140, 0.35)",
              }}
            >
              <Checkbox.Group onChange={checkboxChange}>
                <Row>
                  {chars.map((v, i) => {
                    return (
                      <Col span={24} key={i}>
                        <Checkbox value={v.name}>{v.name}</Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
            </div>
          </Col>
          <Col span={16} style={{ height: "100%" }}>
            <Descriptions
              title={descriptions.title}
              items={descriptions.items}
            />
          </Col>
        </Row>
        <Row style={{ padding: "5px", height: "80px", width: "100%" }}>
          <Col style={{ width: "100%" }}>
            <Button
              onClick={onClick}
              type="primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? <Spin /> : <>进入游戏</>}
            </Button>
          </Col>
        </Row>
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
