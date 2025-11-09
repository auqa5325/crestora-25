import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const WinnersHeroNew = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(titleRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 1,
        ease: 'power4.out',
      })
      .from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5');

      gsap.to(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top center',
          end: 'bottom top',
          scrub: 1,
        },
        y: -100,
        opacity: 0.5,
        ease: 'none',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-[60vh] flex items-center justify-center px-4 py-20"
    >
      <div className="text-center max-w-4xl mx-auto">
        <h1
          ref={titleRef}
          className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--space-gold))] via-[hsl(var(--space-cyan))] to-[hsl(var(--space-violet))] bg-clip-text text-transparent"
        >
          Champions of CRESTORA
        </h1>
        <p
          ref={subtitleRef}
          className="font-rajdhani text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
        >
          Celebrating the brilliant minds who conquered every challenge and reached for the stars
        </p>
      </div>
    </motion.div>
  );
};
