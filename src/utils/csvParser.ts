export interface TeamData {
  rank: number;
  teamId: string;
  teamName: string;
  leaderName: string;
  finalScore: number;
  percentile: number;
  roundsCompleted: number;
  status: string;
  roundScores: { [key: string]: number };
}

export const parseLeaderboardCSV = (csvText: string): TeamData[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  const teams: TeamData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    
    const roundScores: { [key: string]: number } = {};
    const roundHeaders = ['Round 1 Score', 'Round 2 Score', 'Round 3 Score', 'Round 4 Score', 
                         'Round 5 Score', 'Round 7 Score', 'Round 8 Score', 'Round 9 Score', 'Round 10 Score'];
    
    roundHeaders.forEach((header, idx) => {
      const headerIndex = headers.indexOf(header);
      if (headerIndex !== -1 && values[headerIndex]) {
        const roundNum = header.match(/Round (\d+)/)?.[1];
        if (roundNum) {
          roundScores[`round${roundNum}`] = parseFloat(values[headerIndex]) || 0;
        }
      }
    });
    
    teams.push({
      rank: parseInt(values[0]),
      teamId: values[1],
      teamName: values[2],
      leaderName: values[3],
      finalScore: parseFloat(values[4]),
      percentile: parseFloat(values[5]),
      roundsCompleted: parseInt(values[6]),
      status: values[7],
      roundScores
    });
  }
  
  return teams;
};

export const calculateRankProgression = (teams: TeamData[]) => {
  const rounds = ['round1', 'round2', 'round3', 'round4', 'round5', 'round7', 'round8', 'round9', 'round10'];
  
  return rounds.map((round, roundIndex) => {
    // Calculate cumulative scores up to this round
    const cumulativeScores = teams.map(team => {
      let cumulative = 0;
      for (let i = 0; i <= roundIndex; i++) {
        cumulative += team.roundScores[rounds[i]] || 0;
      }
      return { teamId: team.teamId, teamName: team.teamName, score: cumulative };
    });
    
    // Sort by score and assign ranks
    cumulativeScores.sort((a, b) => b.score - a.score);
    
    return {
      round: round.replace('round', 'Round '),
      rankings: cumulativeScores.slice(0, 5).map((team, idx) => ({
        ...team,
        rank: idx + 1
      }))
    };
  });
};
