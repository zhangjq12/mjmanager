export const TEAM = ["魂天队", "复仇者联盟", "RPG"];

export const randomTeam = (char, players, team) => {
  const map = {};
  const resChar = char.map((v) => {
    v.team = team;
    map[v.id] = 1;
    return v;
  });
  const restPlayers = players.filter((v) => map[v.id] === undefined);

  const resPlayers = [];
  let teamIndex = 0;
  let lenDecreased = 0;
  while (restPlayers.length > 0) {
    const rand = Math.floor(Math.random() * restPlayers.length);
    const chosen = restPlayers.splice(rand, 1)[0];
    chosen.team = TEAM[teamIndex];

    resPlayers.push(chosen);

    lenDecreased++;
    if (lenDecreased === 4) {
      lenDecreased = 0;
      teamIndex++;
    }
  }

  resPlayers.push(...resChar);
  resPlayers.sort((a, b) => a.id - b.id);

  return {
    players: resPlayers,
    char: resChar,
  };
};
