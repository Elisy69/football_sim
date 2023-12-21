import { generateTeam, Team } from "./generateTeam.ts";

const createTournament = (numberOfTeams: number): Team[] => {
  const tournament: Team[] = [];
  if (numberOfTeams % 2 !== 0) {
    throw new Error("Number of teams is not even!");
  } else {
    for (let i = 0; i < numberOfTeams; i++) {
      tournament.push(generateTeam());
    }
  }
  return tournament;
};

export var run = (): void => {
  console.log(createTournament(20));
};
