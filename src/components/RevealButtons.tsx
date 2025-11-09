import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamData } from '@/utils/csvParser';
import { getTeamLogo } from '@/utils/teamLogoMapper';
import { Trophy, Medal, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface RevealButtonsProps {
  winners: TeamData[];
}

export const RevealButtons = ({ winners }: RevealButtonsProps) => {
  const [revealed, setRevealed] = useState<{ [key: number]: boolean }>({});

  const triggerConfetti = (position: number) => {
    const colors = position === 1 
      ? ['#FDCD00', '#FFD700', '#FFA500'] 
      : position === 2 
      ? ['#C0C0C0', '#D3D3D3', '#E8E8E8']
      : ['#CD7F32', '#B87333', '#8B4513'];

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });
  };

  const revealWinner = (position: number) => {
    setRevealed(prev => ({ ...prev, [position]: true }));
    setTimeout(() => triggerConfetti(position), 300);
  };

  const getPositionDetails = (position: number) => {
    switch(position) {
      case 3:
        return {
          title: '3rd Place',
          icon: Award,
          color: 'from-amber-600/80 to-amber-800/80',
          borderColor: 'border-amber-600/50',
          textColor: 'text-amber-600',
          bgGlow: 'shadow-amber-600/30'
        };
      case 2:
        return {
          title: 'Runners Up',
          icon: Medal,
          color: 'from-gray-300/80 to-gray-500/80',
          borderColor: 'border-gray-300/50',
          textColor: 'text-gray-300',
          bgGlow: 'shadow-gray-300/30'
        };
      case 1:
        return {
          title: 'Winners',
          icon: Trophy,
          color: 'from-[hsl(var(--space-gold))]/80 to-yellow-600/80',
          borderColor: 'border-[hsl(var(--space-gold))]/50',
          textColor: 'text-[hsl(var(--space-gold))]',
          bgGlow: 'shadow-[hsl(var(--space-gold))]/50'
        };
      default:
        return {
          title: '',
          icon: Award,
          color: 'from-primary/80 to-accent/80',
          borderColor: 'border-primary/50',
          textColor: 'text-primary',
          bgGlow: 'shadow-primary/30'
        };
    }
  };

  const renderRevealButton = (position: number) => {
    const team = winners.find(w => w.rank === position);
    if (!team) return null;

    const details = getPositionDetails(position);
    const Icon = details.icon;

    return (
      <motion.div
        key={position}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: (3 - position) * 0.2 }}
        className="w-full"
      >
        <AnimatePresence mode="wait">
          {!revealed[position] ? (
            <motion.div
              key="button"
              exit={{ scale: 0, opacity: 0 }}
              className="w-full"
            >
              <Button
                onClick={() => revealWinner(position)}
                className={`w-full h-24 bg-gradient-to-r ${details.color} hover:opacity-90 border-2 ${details.borderColor} shadow-xl ${details.bgGlow} transition-all duration-300`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-8 h-8 ${details.textColor}`} />
                  <div className="text-left">
                    <p className="text-sm text-white/70">Reveal</p>
                    <p className="font-orbitron text-xl font-bold text-white">
                      {details.title}
                    </p>
                  </div>
                  <Sparkles className="w-6 h-6 text-white/50 ml-auto animate-pulse" />
                </div>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="card"
              initial={{ scale: 0, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className={`w-full bg-gradient-to-br ${details.color} backdrop-blur-lg border-2 ${details.borderColor} rounded-2xl p-6 shadow-2xl ${details.bgGlow}`}
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-xl flex-shrink-0">
                  <img 
                    src={getTeamLogo(team.teamId)} 
                    alt={team.teamName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-6 h-6 text-white" />
                    <p className="font-orbitron text-sm font-bold text-white/90">
                      {details.title}
                    </p>
                  </div>
                  <h3 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-1">
                    {team.teamName}
                  </h3>
                  <p className="text-sm text-white/80">
                    Led by {team.leaderName}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-primary mb-4">
            The Moment of Truth
          </h2>
          <p className="text-muted-foreground">
            Click to reveal the champions who conquered every challenge
          </p>
        </motion.div>

        <div className="space-y-6">
          {[3, 2, 1].map(position => renderRevealButton(position))}
        </div>
      </div>
    </section>
  );
};
