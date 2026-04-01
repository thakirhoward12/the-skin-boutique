import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const COLORS = [
  '#FDF2F2', // ivory-50
  '#FCE7E7', // pastel-pink-50
  '#F9D1D1', // pastel-pink-200
  '#F19C9C', // pastel-pink-400
  '#E1E7F0', // pastel-blue-100
  '#C5D1E4', // pastel-blue-200
  '#D1F2EB', // pastel-green-100
];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
}

export default function Celebration() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: -10 - Math.random() * 20, // start above screen
      size: 5 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);

    // Auto-clean up after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[110] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              top: `${p.y}%`, 
              left: `${p.x}%`, 
              opacity: 1, 
              rotate: p.rotation,
              scale: 0 
            }}
            animate={{ 
              top: '120%', 
              left: `${p.x + (Math.random() * 20 - 10)}%`,
              opacity: [1, 1, 0],
              rotate: p.rotation + 720,
              scale: [0, 1, 0.5]
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              delay: p.delay,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
