import EChartsReact from "echarts-for-react";
import { Card, Layout, Row, Col, Rate } from "antd";
import { PlayerDetail } from "../playerDetails";
import { useState } from "react";

const { Meta } = Card;
const { Content } = Layout;

export const LineUp = ({ players }) => {
  const [char, setChar] = useState(players[0]);
  const [chartOption, setChartOption] = useState();
  const [openDetail, setOpenDetail] = useState(false);

  const cardClick = (char, option) => {
    setChar(char);
    setChartOption(option);
    setOpenDetail(true);
  };

  const cardNode = players.map((v, i) => {
    const option = {
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
              value: [v.attack, v.defense, v.speed, v.lucky, v.determination],
              name: v.name,
            },
          ],
        },
      ],
    };

    return (
      <Col key={i} xs={24} sm={24} md={12} lg={8}>
        <Card
          hoverable
          style={{ width: 250 }}
          cover={
            <EChartsReact
              option={option}
              style={{ height: "100%", maxHeight: "900px" }}
            />
          }
          onClick={() => {
            cardClick(v, option);
          }}
        >
          <Meta
            title={v.name}
            description={
              <div>
                <div>
                  能力值：
                  <Rate allowHalf disabled value={v.ca / 20} />
                </div>
                <div>
                  潜力值：
                  <Rate allowHalf disabled value={v.pa / 20} />
                </div>
              </div>
            }
          />
        </Card>
      </Col>
    );
  });

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
          <Row>{cardNode}</Row>
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
};
