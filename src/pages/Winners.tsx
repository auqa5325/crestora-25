import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Starfield } from '@/components/Starfield';
import { ParticleField3D } from '@/components/ParticleField3D';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WinnersHeroNew } from '@/components/WinnersHeroNew';
import { FinalistsStack } from '@/components/FinalistsStack';
import { RevealButtons } from '@/components/RevealButtons';
import { RankProgressionChart } from '@/components/RankProgressionChart';
import { parseLeaderboardCSV, TeamData } from '@/utils/csvParser';
import leaderboardCSV from '@/data/leaderboardCres.csv?raw';

gsap.registerPlugin(ScrollTrigger);

const Winners = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [finalists, setFinalists] = useState<TeamData[]>([]);
  const [winners, setWinners] = useState<TeamData[]>([]);

  useEffect(() => {
    const parsedTeams = parseLeaderboardCSV(leaderboardCSV);
    setTeams(parsedTeams);
    
    // Get top 6 ACTIVE teams as finalists
    const activeFinalists = parsedTeams.filter(t => t.status === 'ACTIVE').slice(0, 6);
    setFinalists(activeFinalists);
    
    // Get top 3 for winners
    setWinners(parsedTeams.slice(0, 3));
  }, []);

  useEffect(() => {
    // Page entry animation
    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    // Parallax effect for background
    if (parallaxRef.current) {
      gsap.to(parallaxRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: -200,
        ease: 'none',
      });
    }

    // Animate sections on scroll
    const sections = containerRef.current?.querySelectorAll('section');
    sections?.forEach((section, index) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power3.out',
        delay: index * 0.1,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Parallax Background Layer */}
      <div 
        ref={parallaxRef}
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--space-cyan) / 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(var(--space-violet) / 0.1) 0%, transparent 50%)',
        }}
      />
      
      <Starfield />
      <ParticleField3D />
      <Header />
      
      <main className="relative z-10 pt-20">
        <WinnersHeroNew />
        
        {/* Finalists Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-primary mb-4">
              The Finalists
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Six exceptional teams who demonstrated outstanding performance throughout the competition
            </p>
          </div>
          {finalists.length > 0 && <FinalistsStack finalists={finalists} />}
        </section>

        {/* Winners Reveal Section */}
        {winners.length > 0 && <RevealButtons winners={winners} />}

        {/* Rank Progression Chart */}
        {teams.length > 0 && <RankProgressionChart teams={teams} />}
      </main>

      <Footer />
    </div>
  );
};

export default Winners;
