import { useState } from 'react';
import { motion } from 'framer-motion';
import { TeamData, calculateRankProgression } from '@/utils/csvParser';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RankProgressionChartProps {
  teams: TeamData[];
}

export const RankProgressionChart = ({ teams }: RankProgressionChartProps) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const progression = calculateRankProgression(teams);
  const currentRound = progression[currentRoundIndex];

  const goToPrevious = () => {
    setCurrentRoundIndex((prev) => (prev - 1 + progression.length) % progression.length);
  };

  const goToNext = () => {
    setCurrentRoundIndex((prev) => (prev + 1) % progression.length);
  };
  const colors = [
    'hsl(var(--space-gold))',
    'hsl(var(--space-cyan))',
    'hsl(var(--space-violet))',
    'hsl(var(--space-magenta))',
    'hsl(var(--accent))',
  ];

  return (
    <section className="relative py-16 px-4 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-primary mb-4">
            Journey to Victory
          </h2>
          <p className="text-muted-foreground">
            Explore how the top teams climbed the ranks through each round
          </p>
        </motion.div>

        {/* Round Indicator with Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            onClick={goToPrevious}
            variant="ghost"
            size="icon"
            className="rounded-full border-2 border-primary/50 hover:bg-primary/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <motion.div
            key={currentRoundIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-block px-8 py-3 bg-primary/20 rounded-full border-2 border-primary/50">
              <h3 className="font-orbitron text-2xl font-bold text-primary">
                {currentRound.round}
              </h3>
            </div>
          </motion.div>

          <Button
            onClick={goToNext}
            variant="ghost"
            size="icon"
            className="rounded-full border-2 border-primary/50 hover:bg-primary/20"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Rankings Chart */}
        <div className="space-y-4">
          {currentRound.rankings.map((team, index) => {
            const maxScore = currentRound.rankings[0].score;
            const percentage = (team.score / maxScore) * 100;

            return (
              <motion.div
                key={team.teamId}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-orbitron font-bold text-lg border-2 flex-shrink-0"
                    style={{
                      backgroundColor: `${colors[index]}20`,
                      borderColor: colors[index],
                      color: colors[index],
                    }}
                  >
                    {team.rank}
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 relative h-16 bg-background/50 rounded-lg border border-border overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 rounded-lg"
                      style={{
                        background: `linear-gradient(90deg, ${colors[index]}80, ${colors[index]}40)`,
                        borderRight: `2px solid ${colors[index]}`,
                      }}
                    />

                    {/* Team Info */}
                    <div className="relative z-10 flex items-center justify-between h-full px-4">
                      <div>
                        <p className="font-orbitron font-bold text-sm md:text-base text-foreground">
                          {team.teamName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-orbitron font-bold text-lg" style={{ color: colors[index] }}>
                          {team.score.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {progression.map((round, index) => (
            <button
              key={index}
              onClick={() => setCurrentRoundIndex(index)}
              className={`px-3 py-1 rounded-full text-xs font-orbitron transition-all duration-300 border ${
                index === currentRoundIndex 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background/50 text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {round.round.replace('Round ', 'R')}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
