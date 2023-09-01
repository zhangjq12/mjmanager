import { Table, Layout, Cascader } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const { Content } = Layout;

const column = [
  {
    title: "名字",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "分数",
    dataIndex: "pt",
    key: "pt",
  },
];

const cascader = [
  {
    value: "立直麻将联赛",
    label: "立直麻将联赛",
  },
  {
    value: "天神杯",
    label: "天神杯",
  },
];

export const Standings = observer(({ standings, playersMap }) => {
  const [table, setTable] = useState([]);
  const [league, setLeague] = useState("立直麻将联赛");

  useEffect(() => {
    const standing = standings.get(league);

    let table = Object.keys(standing).map((key) => {
      return {
        key,
        name: playersMap[key].name,
        pt: standing[key],
      };
    });
    table = table.sort((a, b) => b.pt - a.pt);
    setTable(table);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standings, league]);

  const onSetLeagueChange = (v) => {
    setLeague(v);
  };

  return (
    <Layout
      style={{
        padding: "24px 0",
        background: "white",
        height: "100%",
        minHeight: 280,
      }}
    >
      <Content
        id="standing-table-content"
        style={{ padding: "0 24px", minHeight: 280 }}
      >
        <Table
          title={() => {
            return (
              <div style={{ display: "flex" }}>
                <div>{league}</div>
                <div style={{ marginLeft: "auto" }}>
                  <Cascader
                    options={cascader}
                    value={league}
                    onChange={onSetLeagueChange}
                  />
                </div>
              </div>
            );
          }}
          columns={column}
          dataSource={table}
          pagination={false}
          scroll={{ y: 280 }}
        />
      </Content>
    </Layout>
  );
});
