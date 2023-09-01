import EChartsReact from "echarts-for-react";
import { Card, Layout, Row, Col } from "antd";

const { Meta } = Card;
const { Content } = Layout;

export const LineUp = ({ players }) => {
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
      <Col key={i} span={8}>
        <Card
          hoverable
          style={{ width: 300 }}
          cover={
            <EChartsReact
              option={option}
              style={{ height: "100%", maxHeight: "700px" }}
            />
          }
        >
          <Meta title={v.name} />
        </Card>
      </Col>
    );
  });
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
        <Row>{cardNode}</Row>
      </Content>
    </Layout>
  );
};
