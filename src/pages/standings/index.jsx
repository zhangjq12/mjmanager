import { Table, Layout, Cascader, Empty, Select, Button } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { scheduleGenerator } from "../../data/schedule/schedule";
import { initialStandings } from "../../data/standings/initial";
import { PlayerDetail } from "../playerDetails";

const { Content } = Layout;

export const Standings = observer(({ standings, playersMap }) => {
  const [isShowTable, setIsShowTable] = useState(true);
  const [table, setTable] = useState([]);
  const [league, setLeague] = useState(["立直麻将联赛"]);
  const [isTeam, setIsTeam] = useState(false);
  const [teamOrInd, setTeamOrInd] = useState(0);
  const [cascader, setCascader] = useState([]);

  const [char, setChar] = useState();
  const [chartOption, setChartOption] = useState();
  const [openDetail, setOpenDetail] = useState(false);

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

    const isTeam = initialStandings.find((v) => league[0] === v.name)?.isTeam;
    if (isTeam) setIsTeam(true);
    else {
      setIsTeam(false);
      setTeamOrInd(0);
    }

    if (standing) {
      let table;
      if (teamOrInd === 0) {
        table = Object.keys(standing).map((key) => {
          return {
            key,
            name: playersMap[key].name,
            pt: standing[key].toFixed(1),
          };
        });
        table = table.sort((a, b) => b.pt - a.pt);
      } else {
        const teamMap = {};
        Object.keys(standing).forEach((key) => {
          if (!teamMap[playersMap[key].team])
            teamMap[playersMap[key].team] = standing[key];
          else teamMap[playersMap[key].team] += standing[key];
        });
        table = Object.keys(teamMap).map((key) => {
          return {
            key,
            name: key,
            pt: teamMap[key].toFixed(1),
          };
        });
        table = table.sort((a, b) => b.pt - a.pt);
      }
      setTable(table);
      setIsShowTable(true);
    } else {
      setIsShowTable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standings, league, teamOrInd]);

  const onSetLeagueChange = (v) => {
    setLeague(v);
  };

  const column = [
    {
      title: "名字",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        teamOrInd === 0 ? (
          <Button
            type="link"
            onClick={() => {
              setChar(playersMap[record.key]);
              setChartOption({
                radar: {
                  indicator: [
                    {
                      name: "攻击力",
                      max: 100,
                    },
                    {
                      name: "防御力",
                      max: 100,
                    },
                    {
                      name: "速度值",
                      max: 100,
                    },
                    {
                      name: "幸运值",
                      max: 100,
                    },
                    {
                      name: "意志力",
                      max: 100,
                    },
                  ],
                },
                series: [
                  {
                    type: "radar",
                    center: ["50%", "50%"],
                    data: [
                      {
                        value: [
                          playersMap[record.key].attack,
                          playersMap[record.key].defense,
                          playersMap[record.key].speed,
                          playersMap[record.key].lucky,
                          playersMap[record.key].determination,
                        ],
                        name: playersMap[record.key].name,
                      },
                    ],
                  },
                ],
              });
              setOpenDetail(true);
            }}
          >
            {text}
          </Button>
        ) : (
          text
        ),
    },
    {
      title: "分数",
      dataIndex: "pt",
      key: "pt",
    },
  ];

  return (
    <>
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
          <div style={{ display: "flex" }}>
            <div>
              <Cascader
                options={cascader}
                value={league}
                onChange={onSetLeagueChange}
              />
            </div>
            {isTeam && (
              <div style={{ marginLeft: "auto" }}>
                <Select
                  value={teamOrInd}
                  options={[
                    { label: "个人", value: 0 },
                    { label: "队伍", value: 1 },
                  ]}
                  onChange={(v) => {
                    setTeamOrInd(v);
                  }}
                />
              </div>
            )}
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
      {char && (
        <PlayerDetail
          char={char}
          chartOptions={chartOption}
          open={openDetail}
          onClose={() => {
            setOpenDetail(false);
          }}
        />
      )}
    </>
  );
});
