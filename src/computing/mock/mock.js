export let mockData = [];

export const generateMock = () => {
  if (mockData.length === 30) {
    return;
  }
  mockData.push(Math.random() * 100);
}

export const mockChar = [
  {
    name: '日麻教父',
    attack: 30,
    defense: 60,
    lucky: 20,
    speed: 30,
    determination: 70,
  },
  {
    name: '吃五教主',
    attack: 50,
    defense: 60,
    lucky: 10,
    speed: 50,
    determination: 50,
  },
  {
    name: '艾斯艾福',
    attack: 60,
    defense: 20,
    lucky: 30,
    speed: 40,
    determination: 60,
  },
  {
    name: '爱小千',
    attack: 80,
    defense: 10,
    lucky: 20,
    speed: 30,
    determination: 30,
  },
  {
    name: '啸天犬',
    attack: 60,
    defense: 20,
    lucky: 40,
    speed: 10,
    determination: 70,
  },
  {
    name: '小核桃',
    attack: 40,
    defense: 40,
    lucky: 90,
    speed: 20,
    determination: 80,
  },
  {
    name: '小*豆',
    attack: 50,
    defense: 50,
    lucky: 40,
    speed: 50,
    determination: 90,
  },
  {
    name: '胖头酱',
    attack: 20,
    defense: 10,
    lucky: 90,
    speed: 10,
    determination: 20,
  },
  {
    name: '黑不黑',
    attack: 20,
    defense: 80,
    lucky: 30,
    speed: 60,
    determination: 80,
  },
  {
    name: '谁的橘子',
    attack: 70,
    defense: 60,
    lucky: 40,
    speed: 70,
    determination: 60,
  },
  {
    name: '黄四郎',
    attack: 40,
    defense: 50,
    lucky: 40,
    speed: 30,
    determination: 50,
  },
  {
    name: '菜师傅',
    attack: 10,
    defense: 10,
    lucky: 20,
    speed: 10,
    determination: 10,
  },
]