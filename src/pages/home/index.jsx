import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Badge } from "antd";
import "./index.css";
import { MailIndex } from "../mailIndex";
import { LineUp } from "../lineUp";
import { Recruit } from "../recruit";
import { Training } from "../training";

const { Header, Content, Footer } = Layout;

const mockMails = [
  {
    key: 6,
    label: "邮件1",
    read: false,
    content: "sb",
  },
  {
    key: 5,
    label: "邮件2",
    read: false,
    content: "sbsbsb",
  },
  {
    key: 4,
    label: "邮件3",
    read: false,
    content: "sbsbsbsbsbsb",
  },
  {
    key: 3,
    label: "邮件4",
    read: true,
    content: "sbsbsbsbsbsbsbsbsbsbsbsb",
  },
  {
    key: 2,
    label: "邮件5",
    read: true,
    content: "sbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsb",
  },
  {
    key: 1,
    label: "邮件6",
    read: true,
    content:
      "sbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsbsb",
  },
];

export const Home = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [menuKeys, setMenuKeys] = useState(1);
  const [mailBadgeCount, setMailBadgeCount] = useState(0);

  const [mailData, setMailData] = useState([]);
  const [mailSelectedKey, setMailSelectedKey] = useState();

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const thisDate = date.toLocaleDateString();
      const thisTime = date.toLocaleTimeString();
      setCurrentTime(thisDate + " " + thisTime);
    }, 1000);

    const data = setMailReadStatus(mockMails);
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

  return (
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
          <Button type="primary">继续游戏</Button>
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
  );
};
