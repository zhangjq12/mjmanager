import { Col, Layout, Row, Segmented, Select } from "antd";
import EChartsReact from "echarts-for-react";
import { useEffect, useState } from "react";

const { Content } = Layout;

export const Training = ({
  players,
  today,
  changeTrainingCb,
  changeEnhanceCb,
}) => {
  const [id, setId] = useState(players[0].id);
  const [playersMap, setPlayersMap] = useState({});
  const [year] = useState(
    (() => {
      const prevYear =
        new Date(today).getMonth() + 1 >= 9
          ? new Date(today).getFullYear()
          : new Date(today).getFullYear() - 1;
      const year = [prevYear, prevYear + 1];
      return year;
    })()
  );

  useEffect(() => {
    const map = {};
    players.forEach((v) => {
      map[v.id] = v;
    });
    setPlayersMap(map);
  }, [players]);

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
        {Object.keys(playersMap).length > 0 && (
          <>
            <Segmented
              block
              size="large"
              options={players.map((v) => {
                return {
                  label: v.name,
                  value: v.id,
                };
              })}
              value={id}
              onChange={setId}
            />
            <Row>
              <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                <div
                  style={{
                    display: "flex",
                    padding: "5px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "120px" }}>训练计划：</div>
                  <Select
                    options={[
                      { label: "无", value: "无" },
                      { label: "攻击为主", value: "攻击为主" },
                      { label: "防御为主", value: "防御为主" },
                      { label: "攻速为主", value: "攻速为主" },
                    ]}
                    style={{ width: "100%" }}
                    value={playersMap[id].trainingName}
                    onChange={(v) => {
                      changeTrainingCb(id, v);
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    padding: "5px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "120px" }}>专项提升：</div>
                  <Select
                    options={[
                      { label: "无", value: "" },
                      { label: "攻击力", value: "attack" },
                      { label: "防御力", value: "defense" },
                      { label: "速度值", value: "speed" },
                    ]}
                    style={{ width: "100%" }}
                    value={playersMap[id].enhancement}
                    onChange={(v) => {
                      changeEnhanceCb(id, v);
                    }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
                <EChartsReact
                  option={{
                    xAxis: {
                      type: "category",
                      data: (() => {
                        const start = new Date(`${year[0]}/8/31`).getTime();
                        // const end = new Date(`${year[1]}/8/30`).getTime();
                        const end = new Date(today).getTime();

                        const oneday = 24 * 60 * 60 * 1000;
                        const res = [];
                        for (let s = start; s <= end; s += oneday) {
                          res.push(new Date(s).toLocaleDateString());
                        }
                        return res;
                      })(),
                    },
                    yAxis: {
                      min: 0,
                      max: 100,
                    },
                    legend: {
                      data: ["攻击力", "防御力", "速度值", "意志力", "幸运值"],
                      orient: "vertical",
                      right: 10,
                      top: "center",
                    },
                    series: [
                      {
                        name: "攻击力",
                        data: playersMap[id].propertiesChanges.attack,
                        type: "line",
                      },
                      {
                        name: "防御力",
                        data: playersMap[id].propertiesChanges.defense,
                        type: "line",
                      },
                      {
                        name: "速度值",
                        data: playersMap[id].propertiesChanges.speed,
                        type: "line",
                      },
                      {
                        name: "意志力",
                        data: playersMap[id].propertiesChanges.determination,
                        type: "line",
                      },
                      {
                        name: "幸运值",
                        data: playersMap[id].propertiesChanges.lucky,
                        type: "line",
                      },
                    ],
                  }}
                />
              </Col>
            </Row>
          </>
        )}
      </Content>
    </Layout>
  );
};
