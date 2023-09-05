import { Table, Layout, Cascader, Empty } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { scheduleGenerator } from "../../data/schedule/schedule";

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

export const Standings = observer(({ standings, playersMap }) => {
  const [isShowTable, setIsShowTable] = useState(true);
  const [table, setTable] = useState([]);
  const [league, setLeague] = useState(["立直麻将联赛"]);
  const [cascader, setCascader] = useState([]);

  useEffect(() => {
    const cascader = [];
    scheduleGenerator.getMatchNames().forEach((names) => {
      let boo = false;
      for (const item of cascader) {
        if (item.value === names[0]) {
          boo = true;
          if (!item.children) item.children = [];
          item.children.push({
            value: names[1],
            label: names[1],
          });
        }
      }
      if (!boo) {
        const item = {
          value: names[0],
          label: names[0],
        };

        if (names.length === 2) {
          item.children = [{ value: names[1], label: names[1] }];
        }
        cascader.push(item);
      }
    });
    setCascader(cascader);
  }, []);

  useEffect(() => {
    const standing = standings.get(league);

    if (standing) {
      let table = Object.keys(standing).map((key) => {
        return {
          key,
          name: playersMap[key].name,
          pt: standing[key],
        };
      });
      table = table.sort((a, b) => b.pt - a.pt);
      setTable(table);
      setIsShowTable(true);
    } else {
      setIsShowTable(false);
    }
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
        <div style={{ marginLeft: "auto" }}>
          <Cascader
            options={cascader}
            value={league}
            onChange={onSetLeagueChange}
          />
        </div>
        {isShowTable ? (
          <Table
            title={() => {
              return league[0];
            }}
            columns={column}
            dataSource={table}
            pagination={false}
            scroll={{ y: 280 }}
          />
        ) : (
          <Empty description="此比赛还未开始" image={undefined} />
        )}
      </Content>
    </Layout>
  );
});
