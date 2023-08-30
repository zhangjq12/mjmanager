export const DISEASES_NAMES = {
  handsInjury: "手部受伤",
  fever: "感冒",
  virus: "病毒感染",
  headache: "头疼",
  stomachache: "肚子疼",
  heartDisease: "心脏疾病",
  lungDisease: "肺部疾病",
  majorDisease: "重大疾病",
};

export const DISEASES_PERIOD = {
  handsInjury: [14, 21],
  fever: [1, 7],
  virus: [3, 56],
  headache: [1, 5],
  stomachache: [1, 14],
  heartDisease: [28, 70],
  lungDisease: [28, 42],
  majorDisease: [56, 7 * 14],
};

const DISEASES_WEIGHT = {
  handsInjury: 3,
  fever: 6,
  virus: 3,
  headache: 5,
  stomachache: 4,
  heartDisease: 0.5,
  lungDisease: 0.3,
  majorDisease: 0.05,
};

export const ADVANTURES_NAMES = {
  determinationUp: "意志力增加",
  determinationDown: "意志力减少",
  attackUp: "攻击力增加",
  attackDown: "攻击力减少",
  defenseUp: "防御力增加",
  defenseDown: "防御力减少",
  luckyUp: "幸运值增加",
  luckyDown: "幸运值减少",
  speedUp: "速度增加",
  speedDown: "速度减少",
};

export const ADVANTURES_PROPERTY = {
  determinationUp: {
    property: "determination",
    action: "+",
  },
  determinationDown: {
    property: "determination",
    action: "-",
  },
  attackUp: {
    property: "attack",
    action: "+",
  },
  attackDown: {
    property: "attack",
    action: "-",
  },
  defenseUp: {
    property: "defense",
    action: "+",
  },
  defenseDown: {
    property: "defense",
    action: "-",
  },
  luckyUp: {
    property: "lucky",
    action: "+",
  },
  luckyDown: {
    property: "lucky",
    action: "-",
  },
  speedUp: {
    property: "speed",
    action: "+",
  },
  speedDown: {
    property: "speed",
    action: "-",
  },
};

const ADVANTURES_WEIGHT = {
  determinationUp: 0.1,
  determinationDown: 0.05,
  attackUp: 5,
  attackDown: 5,
  defenseUp: 5,
  defenseDown: 5,
  luckyUp: 0.1,
  luckyDown: 0.05,
  speedUp: 5,
  speedDown: 5,
};

export const EVENTS = {
  diseases: DISEASES_WEIGHT,
  advantures: ADVANTURES_WEIGHT,
};
