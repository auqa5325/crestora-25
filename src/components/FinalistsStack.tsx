import { useState } from 'react';
import { motion } from 'framer-motion';
import { TeamData } from '@/utils/csvParser';
import { getTeamLogo } from '@/utils/teamLogoMapper';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Users, Award, ExternalLink, Video } from 'lucide-react';

interface FinalistsStackProps {
  finalists: TeamData[];
}

export const FinalistsStack = ({ finalists }: FinalistsStackProps) => {
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [showIframe, setShowIframe] = useState(false);

  return (
    <>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {finalists.map((team, index) => (
            <CarouselItem key={team.teamId} className="md:basis-1/2 lg:basis-1/3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSelectedTeam(team);
                  setShowIframe(false);
                }}
                className="cursor-pointer h-96 p-2"
              >
                <div className="relative h-full bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-lg border-2 border-border rounded-2xl p-6 overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg shadow-primary/20">
                      <img 
                        src={getTeamLogo(team.teamId)} 
                        alt={team.teamName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="text-center">
                      <h3 className="font-orbitron text-xl font-bold text-foreground mb-1">
                        {team.teamName}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        {team.leaderName}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/30">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="font-orbitron text-sm font-medium text-primary">
                        Finalist #{index + 1}
                      </span>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl" />
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Team Detail Modal */}
      <Dialog open={!!selectedTeam} onOpenChange={() => {
        setSelectedTeam(null);
        setShowIframe(false);
      }}>
        <DialogContent className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-2 border-primary/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-2xl text-center text-primary">
              Team Profile
            </DialogTitle>
          </DialogHeader>
          
          {selectedTeam && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {!showIframe ? (
                <>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/50 shadow-xl shadow-primary/30">
                      <img 
                        src={getTeamLogo(selectedTeam.teamId)} 
                        alt={selectedTeam.teamName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="text-center">
                      <h3 className="font-orbitron text-2xl font-bold text-foreground mb-2">
                        {selectedTeam.teamName}
                      </h3>
                      <p className="text-muted-foreground">
                        Led by <span className="text-foreground font-medium">{selectedTeam.leaderName}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                      <p className="text-xs text-muted-foreground mb-1">Team ID</p>
                      <p className="font-orbitron text-sm font-medium text-foreground">{selectedTeam.teamId}</p>
                    </div>
                    
                    <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <p className="font-orbitron text-sm font-medium text-accent">{selectedTeam.status}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-6 border border-primary/30">
                    <p className="text-center text-sm text-muted-foreground mb-2">Journey Through Rounds</p>
                    <p className="text-center font-orbitron text-3xl font-bold text-foreground">
                      {selectedTeam.roundsCompleted} Rounds
                    </p>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Button 
                      onClick={() => setShowIframe(true)}
                      className="flex-1 bg-primary/20 hover:bg-primary/30 border border-primary/50"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      View Media
                    </Button>
                    {selectedTeam.website && (
                      <Button 
                        onClick={() => window.open(selectedTeam.website, '_blank')}
                        className="flex-1 bg-accent/20 hover:bg-accent/30 border border-accent/50"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Button 
                    onClick={() => setShowIframe(false)}
                    variant="ghost"
                    className="w-full"
                  >
                    ← Back to Profile
                  </Button>
                  <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-primary/30">
                    <iframe
                      src={selectedTeam.mediaUrl || selectedTeam.website}
                      className="w-full h-full"
                      title={`${selectedTeam.teamName} media`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
