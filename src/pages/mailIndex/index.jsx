import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { MailOutlined } from "@ant-design/icons";
import "./index.css";

const { Content, Sider } = Layout;

export const MailIndex = ({ data, selectedKey, onSelect }) => {
  const [contentLabel, setContentLabel] = useState();
  const [content, setContent] = useState();

  useEffect(() => {
    if (!data) return;
    const index = data.findIndex((v) => v.key === parseInt(selectedKey));
    if (index === -1) {
      return;
    }
    setContentLabel(data[index].originLabel);
    let content = data[index].content;
    let contentRes = [];
    let contentChild = "";
    for (let i = 0; i < content.length; i++) {
      if (content[i] === "\n") {
        contentRes.push(<span key={i - 1}>{contentChild}</span>);
        contentRes.push(<br key={i} />);
        contentChild = "";
        continue;
      }
      contentChild += content[i];
    }
    contentRes.push(contentChild);
    setContent(contentRes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedKey]);

  return (
    <Layout style={{ padding: "24px 0", background: "white", height: "100%" }}>
      <Sider
        style={{ background: "white" }}
        width={window.innerWidth <= 576 ? 50 : 200}
      >
        <Menu
          mode="inline"
          style={{ height: "100%", overflowY: "auto" }}
          selectedKeys={[selectedKey]}
          items={
            data &&
            data.map((v) => {
              return { key: v.key, label: v.label, icon: <MailOutlined /> };
            })
          }
          onSelect={onSelect}
        />
      </Sider>
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h1>{contentLabel}</h1>
        <p>{content}</p>
      </Content>
    </Layout>
  );
};
