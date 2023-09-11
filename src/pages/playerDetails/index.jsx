import { Button, Col, Collapse, Descriptions, Modal, Row, Rate } from "antd";
import EChartsReact from "echarts-for-react";

export const PlayerDetail = ({ char, chartOptions, open, onClose }) => {
  const items = [
    {
      key: "1",
      label: "属性",
      children: (
        <Row>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Descriptions
              title="基础"
              column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
            >
              <Descriptions.Item label="攻击力">
                {char.attack}
              </Descriptions.Item>
              <Descriptions.Item label="防御力">
                {char.defense}
              </Descriptions.Item>
              <Descriptions.Item label="速度值">{char.speed}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Descriptions
              title="精神"
              column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
            >
              <Descriptions.Item label="意志力">
                {char.determination}
              </Descriptions.Item>
              <Descriptions.Item label="幸运值">{char.lucky}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Descriptions
              title="隐藏"
              column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
            >
              <Descriptions.Item label="能力">
                <Rate allowHalf disabled value={char.ca / 20} />
              </Descriptions.Item>
              <Descriptions.Item label="潜力">
                <Rate allowHalf disabled value={char.pa / 20} />
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "比赛数据",
      children: (
        <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}>
          <Descriptions.Item label="一位率">
            {(() => {
              let first = 0;
              char.statistics.weici.forEach((v) => {
                v === 1 && first++;
              });
              const changci =
                char.statistics.changci === 0 ? 1 : char.statistics.changci;
              return ((first / changci) * 100).toFixed(2);
            })()}
            %
          </Descriptions.Item>
          <Descriptions.Item label="二位率">
            {(() => {
              let second = 0;
              char.statistics.weici.forEach((v) => {
                v === 2 && second++;
              });
              const changci =
                char.statistics.changci === 0 ? 1 : char.statistics.changci;
              return ((second / changci) * 100).toFixed(2);
            })()}
            %
          </Descriptions.Item>
          <Descriptions.Item label="三位率">
            {(() => {
              let third = 0;
              char.statistics.weici.forEach((v) => {
                v === 3 && third++;
              });
              const changci =
                char.statistics.changci === 0 ? 1 : char.statistics.changci;
              return ((third / changci) * 100).toFixed(2);
            })()}
            %
          </Descriptions.Item>
          <Descriptions.Item label="四位率">
            {(() => {
              let forth = 0;
              char.statistics.weici.forEach((v) => {
                v === 4 && forth++;
              });
              const changci =
                char.statistics.changci === 0 ? 1 : char.statistics.changci;
              return ((forth / changci) * 100).toFixed(2);
            })()}
            %
          </Descriptions.Item>
          <Descriptions.Item label="对局数">
            {char.statistics.changci}
          </Descriptions.Item>
          <Descriptions.Item label="平均打点">
            {(() => {
              let dadian = 0;
              char.statistics.points.forEach((v) => {
                dadian += v;
              });
              const len =
                char.statistics.points.length === 0
                  ? 1
                  : char.statistics.points.length;
              return Math.round(dadian / len);
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="平均顺位">
            {(() => {
              let weici = 0;
              char.statistics.weici.forEach((v) => {
                weici += v;
              });
              const len =
                char.statistics.weici.length === 0
                  ? 1
                  : char.statistics.weici.length;
              return (weici / len).toFixed(2);
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="最大连庄">
            {(() => {
              let lianzhuang = 0;
              char.statistics.weici.forEach((v) => {
                lianzhuang = lianzhuang > v ? lianzhuang : v;
              });
              return lianzhuang;
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="和了巡数">
            {(() => {
              let xunshu = 0;
              char.statistics.xunshu.forEach((v) => {
                xunshu += v;
              });
              const len =
                char.statistics.weici.length === 0
                  ? 1
                  : char.statistics.weici.length;
              return Math.round(xunshu / len);
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="和牌率">
            {(
              ((char.statistics.zimo + char.statistics.ronghu) /
                (char.statistics.jushu === 0 ? 1 : char.statistics.jushu)) *
              100
            ).toFixed(2)}
            %
          </Descriptions.Item>
          <Descriptions.Item label="自摸率">
            {(
              (char.statistics.zimo /
                (char.statistics.jushu === 0 ? 1 : char.statistics.jushu)) *
              100
            ).toFixed(2)}
            %
          </Descriptions.Item>
          <Descriptions.Item label="放铳率">
            {(
              (char.statistics.fangchong /
                (char.statistics.jushu === 0 ? 1 : char.statistics.jushu)) *
              100
            ).toFixed(2)}
            %
          </Descriptions.Item>
          <Descriptions.Item label="副露率">
            {(
              (char.statistics.fulu /
                (char.statistics.jushu === 0 ? 1 : char.statistics.jushu)) *
              100
            ).toFixed(2)}
            %
          </Descriptions.Item>
          <Descriptions.Item label="立直率">
            {(
              (char.statistics.lizhi /
                (char.statistics.jushu === 0 ? 1 : char.statistics.jushu)) *
              100
            ).toFixed(2)}
            %
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: "3",
      label: "比赛成就",
      children: (
        <Descriptions column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}>
          {Object.keys(char.achievment).map((key, i) => {
            return (
              <Descriptions.Item key={i} label={key}>
                {char.achievment[key]}
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      ),
    },
  ];
  return (
    <Modal
      title={char.name}
      width={window.innerWidth - 20}
      open={open}
      footer={
        <Button onClick={onClose} type="primary">
          关闭
        </Button>
      }
      onCancel={onClose}
    >
      <Row>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <EChartsReact option={chartOptions} />
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Collapse items={items} />
        </Col>
      </Row>
    </Modal>
  );
};
