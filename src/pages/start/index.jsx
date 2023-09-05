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
} from "antd";
import "./index.css";
import { mockChar } from "../../computing/mock/mock";

const { Header, Content, Footer } = Layout;

export const StartPage = ({ callback, loading }) => {
  const [chars, setChars] = useState([]);
  const [names, setNames] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

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
    if (names.length === 4) callback(names);
    else message.error("要选够4人开始");
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
          padding: "30px 50px 0 50px",
          flex: 1,
        }}
      >
        <Row>
          <Col span={8}>
            <Checkbox.Group onChange={checkboxChange}>
              <Row>
                {chars.map((v) => {
                  return (
                    <Col span={24}>
                      <Checkbox value={v.name}>{v.name}</Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Col>
          <Col span={16}>
            <Descriptions
              title={descriptions.title}
              items={descriptions.items}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={onClick} type="primary">
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
