import {
  names,
  Config,
  uniqueNamesGenerator,
  animals,
  colors,
  adjectives,
} from "unique-names-generator";
import { myCountries } from "./data/countries.ts";
import { getRandomSkillNum } from "./utils/getRandomSkillNum.ts";

const playerName: Config = {
  dictionaries: [names, names],
  separator: " ",
  length: 2,
};

const playerOrigin: Config = {
  dictionaries: [myCountries],
};

const teamName: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: " ",
  length: 3,
};

const roles = ["GK", "FW", "DF", "MF"] as const;

const skills = [
  "defense",
  "attack",
  "pace",
  "speed",
  "stamina",
  "dribbling",
  "finishing",
  "goalkeeping",
] as const;

type MappingToNums<
  N extends typeof skills,
  Acc extends number[] = []
> = N["length"] extends Acc["length"]
  ? Acc
  : MappingToNums<N, [...Acc, number[][Acc["length"]]]>;

type SkillValues = MappingToNums<typeof skills>;

type SkillsSet = Record<(typeof skills)[number], number>;

type GenerateSkills = (
  defense: number,
  attack: number,
  pace: number,
  speed: number,
  stamina: number,
  dribbling: number,
  finishing: number,
  goalkeeping: number
) => SkillsSet;

interface Player {
  id: number;
  name: string;
  number: number;
  skills: SkillsSet;
  fatigue: number;
  origin: string;
  role: (typeof roles)[number] | "";
}

export interface Team {
  name: string;
  id: number;
  players: Player[];
  coachSkill: number;
  teamWork: number;
}

// IF WE ADD MORE SKILLS, SPECIFIC FOR EACH ROLE THE ROLE ASSIGNMENT WILL BE MORE "FAIR"
const getSkillsObj: GenerateSkills = (
  defense,
  attack,
  pace,
  speed,
  stamina,
  dribbling,
  finishing,
  goalkeeping
) => {
  return {
    defense,
    attack,
    pace,
    speed,
    stamina,
    dribbling,
    finishing,
    goalkeeping,
  };
};

const calcTeamWorkValue = (players: Player[]) => {
  const repeatingCountries: number[] = [];
  const dict: Record<(typeof myCountries)[number], number> = {};
  players.forEach((p) => {
    if (!dict[p.origin]) {
      dict[p.origin] = 1;
    } else {
      dict[p.origin]++;
    }
  });
  for (let c in dict) {
    if (dict[c] > 1) repeatingCountries.push(dict[c]);
  }
  return repeatingCountries.reduce((acc, v) => v * 9 + acc, 0);
};

const assignRoles = (players: Player[]) => {
  roles.forEach((r) => {
    const roleLimit =
      r === "FW" ? 2 : r === "MF" ? 4 : r === "DF" ? 4 : r === "GK" ? 1 : 0;
    let assignedRoleCount = 0;
    const hash: { id: number; skill: number }[] = [];

    players.forEach((p) => {
      hash.push({
        id: p.id,
        skill:
          r === "FW"
            ? p.skills.attack +
              p.skills.dribbling +
              p.skills.finishing +
              p.skills.pace
            : r === "MF"
            ? p.skills.attack +
              p.skills.defense +
              p.skills.dribbling +
              p.skills.speed +
              p.skills.stamina
            : r === "DF"
            ? p.skills.defense + p.skills.speed + p.skills.stamina
            : r === "GK"
            ? p.skills.goalkeeping
            : 0,
      });
    });

    hash.sort((a, b) => b.skill - a.skill);

    hash.forEach((s) => {
      const idx = players.findIndex((p) => p.id === s.id);
      if (assignedRoleCount < roleLimit && !players[idx].role) {
        players[idx].role = r;
        assignedRoleCount++;
      }
    });
  });
};

const generatePlayer = (): Player => {
  const newSkillValues = skills.map(() => getRandomSkillNum()) as SkillValues;
  return {
    id: +(Math.random() * 100000).toFixed(),
    name: uniqueNamesGenerator(playerName),
    number: getRandomSkillNum(),
    skills: getSkillsObj(...newSkillValues),
    origin: uniqueNamesGenerator(playerOrigin),
    fatigue: 0,
    role: "",
  };
};

export const generateTeam = (): Team => {
  const players: Player[] = Array.from({ length: 11 }, () => generatePlayer());
  assignRoles(players);
  return {
    name: uniqueNamesGenerator(teamName),
    id: +(Math.random() * 100000).toFixed(),
    players: players,
    coachSkill: getRandomSkillNum(),
    teamWork: calcTeamWorkValue(players),
  };
};
