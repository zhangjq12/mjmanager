import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
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
    setContent(data[index].content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedKey]);

  return (
    <Layout style={{ padding: "24px 0", background: "white", height: "100%" }}>
      <Sider style={{ background: "white" }} width={200}>
        <Menu
          mode="inline"
          style={{ height: "100%", overflowY: "auto" }}
          selectedKeys={[selectedKey]}
          items={
            data &&
            data.map((v) => {
              return { key: v.key, label: v.label };
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
