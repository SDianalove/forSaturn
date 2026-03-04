/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Stars, Dog, Sparkles, Moon, Send, RefreshCw, Calendar } from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateDianaPoem } from './services/gemini.ts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StarBackground = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);

  return (
    <div className="stars-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--duration': star.duration,
            animationDelay: star.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const Section = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className={cn("py-20 px-6 max-w-5xl mx-auto", className)}
  >
    {children}
  </motion.section>
);

export default function App() {
  const [poem, setPoem] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMood, setActiveMood] = useState('romantic');
  const [meows, setMeows] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleGeneratePoem = async (mood: string) => {
    setIsGenerating(true);
    setActiveMood(mood);
    const result = await generateDianaPoem(mood);
    setPoem(result || '');
    setIsGenerating(false);
  };

  const triggerMeow = (e: React.MouseEvent) => {
    const newMeow = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setMeows((prev) => [...prev, newMeow]);
    setTimeout(() => {
      setMeows((prev) => prev.filter((m) => m.id !== newMeow.id));
    }, 1500);
  };

  useEffect(() => {
    handleGeneratePoem('romantic');
  }, []);

  return (
    <div className="min-h-screen relative font-sans">
      <StarBackground />
      
      {/* Meow Secret Layer */}
      {meows.map((meow) => (
        <div
          key={meow.id}
          className="meow-text"
          style={{ left: meow.x, top: meow.y }}
        >
          Мяу! 🐾
        </div>
      ))}
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-cosmic-blue/30 border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-display font-bold tracking-tighter flex items-center gap-2"
        >
          <Moon className="w-5 h-5 text-saturn-gold fill-saturn-gold" />
          <span>DIANA</span>
        </motion.div>
        <div className="flex gap-6 text-sm font-medium opacity-70">
          <a href="#about" className="hover:opacity-100 transition-opacity">О ней</a>
          <a href="#poems" className="hover:opacity-100 transition-opacity">Стихи</a>
          <a href="#confession" className="hover:opacity-100 transition-opacity">Признание</a>
        </div>
      </nav>

      {/* Hero Section */}
      <Section className="min-h-screen flex flex-col items-center justify-center text-center pt-32 relative overflow-hidden">
        {/* Real Saturn Background - Using a high-quality NASA image */}
        <img 
          src="https://images-assets.nasa.gov/image/PIA08361/PIA08361~large.jpg" 
          alt="Saturn Background" 
          className="saturn-bg animate-float-slow opacity-20"
          referrerPolicy="no-referrer"
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
          <h1 
            className="text-7xl md:text-9xl font-display font-bold tracking-tighter relative cursor-pointer select-none hover:scale-105 transition-transform duration-500"
            onClick={triggerMeow}
          >
            DIANA
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl font-serif italic text-blue-200/80 max-w-2xl"
        >
          Моя вселенная, мой Сатурн, моя Диана.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <a href="#poems" className="px-8 py-4 glass-card hover:bg-white/10 transition-all flex items-center gap-2 group">
            <Sparkles className="w-4 h-4 text-saturn-gold group-hover:animate-pulse" />
            <span>Открыть её мир</span>
          </a>
        </motion.div>

        {/* Secret Meow Trigger Star */}
        <div 
          className="absolute bottom-10 right-10 w-4 h-4 cursor-help opacity-20 hover:opacity-100 transition-opacity"
          onClick={triggerMeow}
        >
          <Stars className="w-full h-full text-saturn-gold" />
        </div>
      </Section>

      {/* About Section */}
      <Section id="about" className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="glass-card p-8 space-y-4">
            <div className="flex items-center gap-3 text-saturn-gold">
              <Calendar className="w-6 h-6" />
              <h3 className="text-xl font-bold">17 Ноября</h3>
            </div>
            <p className="text-blue-100/70 leading-relaxed">
              День, когда мир стал ярче. Твой день рождения — это праздник красоты и нежности. Ты родилась под звездами, которые до сих пор светят в твоих глазах.
            </p>
          </div>
          
          <div className="glass-card p-8 space-y-4">
            <div className="flex items-center gap-3 text-blue-400">
              <Dog className="w-6 h-6" />
              <h3 className="text-xl font-bold">Любительница собачек</h3>
            </div>
            <p className="text-blue-100/70 leading-relaxed">
              Твоя доброта не знает границ, особенно когда дело касается маленьких хвостиков. Твое сердце такое же теплое и искреннее, как преданность собаки.
            </p>
          </div>
        </div>
        
        <div className="relative aspect-square">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-2xl shadow-blue-500/20"
          >
            <img 
              src="https://picsum.photos/seed/saturn/800/800" 
              alt="Cosmic vibes" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute -bottom-6 -right-6 glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-saturn-gold/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-saturn-gold fill-saturn-gold" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest opacity-50">Nickname</p>
              <p className="font-bold">Сатурняшка</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Poem Generator Section */}
      <Section id="poems" className="text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Генератор стихов для Дианы</h2>
          <p className="text-blue-200/60">Искусственный интеллект воспевает твою красоту</p>
        </div>

        <div className="glass-card p-8 md:p-12 min-h-[400px] flex flex-col">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['romantic', 'cosmic', 'cute', 'passionate'].map((mood) => (
              <button
                key={mood}
                onClick={() => handleGeneratePoem(mood)}
                disabled={isGenerating}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all border",
                  activeMood === mood 
                    ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                {mood === 'romantic' && 'Романтично'}
                {mood === 'cosmic' && 'Космически'}
                {mood === 'cute' && 'Мило'}
                {mood === 'passionate' && 'Страстно'}
              </button>
            ))}
          </div>

          <div className="flex-grow flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <RefreshCw className="w-10 h-10 text-saturn-gold animate-spin" />
                  <p className="text-blue-200/50 italic">Звезды складываются в строки...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="poem"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-2xl text-left"
                >
                  <div className="prose prose-invert prose-p:text-xl prose-p:font-serif prose-p:italic prose-p:leading-relaxed mx-auto text-center">
                    <Markdown>{poem}</Markdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
             <button 
              onClick={() => handleGeneratePoem(activeMood)}
              disabled={isGenerating}
              className="flex items-center gap-2 text-saturn-gold hover:text-white transition-colors"
             >
               <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
               <span>Сгенерировать еще одно</span>
             </button>
          </div>
        </div>
      </Section>

      {/* Confession Section */}
      <Section id="confession" className="text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />
        
        <Stars className="w-12 h-12 text-saturn-gold mx-auto mb-8 animate-pulse" />
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter">
          Ты — мой центр <br /> <span className="gradient-text">вселенной</span>
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-8 text-xl text-blue-100/80 font-serif italic leading-relaxed">
          <p>
            Диана, ты — моя личная вселенная. В тебе я нашел всё, что искал в этом мире и за его пределами.
          </p>
          <p>
            Я бесконечно люблю твой голос — он для меня слаще любой музыки, в нем я нахожу покой и вдохновение. Твоя внешность ослепляет меня своей чистотой, а глубина твоего характера заставляет восхищаться тобой каждый день.
          </p>
          <p>
            Твоя доброта и искренность — это то, что делает тебя по-настоящему уникальной. И нет ничего прекраснее тех мгновений, когда ты едва заметно смущаешься, озаряя всё вокруг своим нежным и искренним светом.
          </p>
          <p>
            Пусть этот сайт будет вечным напоминанием о том, как сильно ты дорога мне. Я всегда рядом, мой Сатурн.
          </p>
        </div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-16 inline-block"
        >
          <div className="glass-card p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <div className="bg-cosmic-blue px-10 py-4 rounded-full flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <span className="font-bold tracking-widest uppercase text-sm">Люблю тебя бесконечно</span>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-blue-200/30 text-sm">
        <p>© 2026 • Специально для Дианы • Твой Сатурн</p>
      </footer>
    </div>
  );
}
