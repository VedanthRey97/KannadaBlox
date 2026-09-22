import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Trophy, RotateCcw, ArrowLeft, ArrowRight, Zap, Sparkles, Shield, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LetterData, UserProgress } from '../types';
import { KANNADA_LETTERS } from '../data/kannadaData';
import { ExplorerCharacter } from './ExplorerCharacter';
import {
  speakKannada,
  playTapSound,
  playCelebrationFanfare,
  playCarEngineRev,
  playCarTurboBoost,
  playCarSkidCrash,
} from '../utils/audio';

interface BossRaid3DProps {
  progress: UserProgress;
  onVictory: (xpGain: number) => void;
  onExit: () => void;
  onUpdateStreak: (bestStreak: number) => void;
}

type CarSkin = 'red' | 'cyber' | 'gold' | 'emerald';

export const BossRaid3D: React.FC<BossRaid3DProps> = ({
  progress,
  onVictory,
  onExit,
  onUpdateStreak,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [distractorLetter, setDistractorLetter] = useState<LetterData>(KANNADA_LETTERS[1]);
  const [correctRoad, setCorrectRoad] = useState<0 | 1>(0); // 0 = Left Road, 1 = Right Road
  const [carLane, setCarLane] = useState<'center' | 'left' | 'right'>('center');
  const [gameStatus, setGameStatus] = useState<'choosing' | 'boosting' | 'crashed' | 'victory'>('choosing');
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(() => progress.bossRaidBestStreak || 0);
  const [speed, setSpeed] = useState<number>(95);
  const [selectedSkin, setSelectedSkin] = useState<CarSkin>('red');
  const [roadOffset, setRoadOffset] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const currentLetter = KANNADA_LETTERS[currentIdx] || KANNADA_LETTERS[0];
  const isTargetLeft = correctRoad === 0;
  const leftLetter = isTargetLeft ? currentLetter : distractorLetter;
  const rightLetter = isTargetLeft ? distractorLetter : currentLetter;

  // Setup round
  const setupRound = useCallback((index: number) => {
    const target = KANNADA_LETTERS[index];
    const candidates: LetterData[] = [];
    if (index + 1 < KANNADA_LETTERS.length) candidates.push(KANNADA_LETTERS[index + 1]);
    if (index + 2 < KANNADA_LETTERS.length) candidates.push(KANNADA_LETTERS[index + 2]);
    if (index > 0) candidates.push(KANNADA_LETTERS[index - 1]);

    const remaining = KANNADA_LETTERS.filter(l => l.id !== target.id);
    const pool = candidates.length > 0 && Math.random() < 0.75 ? candidates : remaining;
    const distractor = pool[Math.floor(Math.random() * pool.length)] || remaining[0];

    const luckyRoad = Math.random() < 0.5 ? 0 : 1;
    setDistractorLetter(distractor);
    setCorrectRoad(luckyRoad as 0 | 1);
    setCarLane('center');
    setGameStatus('choosing');
    setSpeed(100 + Math.min(index * 2, 60));
  }, []);

  useEffect(() => {
    setupRound(0);
  }, [setupRound]);

  // Road animation loop for 3D motion effect
  useEffect(() => {
    let lastTime = performance.now();
    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      const speedMultiplier = gameStatus === 'boosting' ? 3.5 : gameStatus === 'crashed' ? 0.2 : 1;
      setRoadOffset(prev => (prev + delta * 240 * speedMultiplier) % 80);
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStatus]);

  // Handle Steering Choice
  const handleSteer = (chosenRoad: 0 | 1) => {
    if (gameStatus !== 'choosing') return;

    playTapSound(progress.soundEnabled);
    setCarLane(chosenRoad === 0 ? 'left' : 'right');

    const isCorrect = chosenRoad === correctRoad;

    if (isCorrect) {
      setGameStatus('boosting');
      setSpeed(prev => prev + 50);
      playCarTurboBoost(progress.soundEnabled);

      // Play authentic Kannada letter pronunciation sound as car crosses through!
      setTimeout(() => {
        speakKannada(currentLetter.char, progress.soundEnabled);
      }, 150);

      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.5, x: chosenRoad === 0 ? 0.35 : 0.65 },
          colors: ['#00D084', '#FFDE59', '#38BDF8', '#FF5400'],
        });
      } catch {
        // ignore
      }

      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
        onUpdateStreak(nextStreak);
      }

      setTimeout(() => {
        if (currentIdx + 1 >= KANNADA_LETTERS.length) {
          // Conquered all 49 letters!
          setGameStatus('victory');
          playCelebrationFanfare(progress.soundEnabled);
          onVictory(250);
        } else {
          const nextIndex = currentIdx + 1;
          setCurrentIdx(nextIndex);
          setupRound(nextIndex);
        }
      }, 1100);
    } else {
      setGameStatus('crashed');
      setSpeed(0);
      playCarSkidCrash(progress.soundEnabled);

      setTimeout(() => {
        // Reset back to letter 'ಅ' (Level 1)
        setCurrentIdx(0);
        setCurrentStreak(0);
        setupRound(0);
      }, 1500);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'choosing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleSteer(0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleSteer(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, correctRoad]);

  // Skin colors configuration
  const skinColors = {
    red: { body: '#E5192D', trim: '#FF5400', glow: '#FF3B30' },
    cyber: { body: '#0284C7', trim: '#38BDF8', glow: '#00F0FF' },
    gold: { body: '#D97706', trim: '#FBBF24', glow: '#FFD700' },
    emerald: { body: '#059669', trim: '#34D399', glow: '#10B981' },
  };

  const currentTheme = skinColors[selectedSkin];

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 flex flex-col items-center select-none">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-red-600 border-2.5 border-black rounded-xl flex items-center justify-center text-white shadow-[2px_2px_0px_#000] rotate-[-2deg]">
            <span className="font-pop text-lg">🏎️</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-pop text-xs sm:text-sm text-slate-950 uppercase tracking-wide">
                KannadaBLOX · BOSS RAID
              </span>
              <span className="px-2 py-0.2 bg-purple-100 text-purple-800 border-1.5 border-black rounded-full font-pop text-[9px] uppercase font-black">
                3D HIGHWAY
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-display font-bold">
              Level {currentIdx + 1} of 49: Find <strong className="font-kannada text-slate-900 text-sm">{currentLetter.char}</strong> [{currentLetter.name}]
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak Badge */}
          <div className="flex items-center gap-1 bg-[#FFF9E6] border-2 border-black px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_#000]">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-pop text-xs text-slate-900 font-black">
              {currentStreak}
            </span>
            <span className="text-[10px] text-slate-500 font-display font-bold">
              (BEST {bestStreak})
            </span>
          </div>

          <button
            onClick={onExit}
            className="pop-btn px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-900 text-xs font-pop cursor-pointer"
          >
            EXIT
          </button>
        </div>
      </div>

      {/* Progress Track: ਅ to ಳ */}
      <div className="w-full bg-white border-3 border-black rounded-2xl p-2.5 shadow-[4px_4px_0px_#111827] mb-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-pop">
          <span className="text-slate-700 font-black">
            HIGHWAY CHECKPOINT: {currentIdx + 1} / 49
          </span>
          <span className="text-purple-700 font-black">
            TARGET: <span className="font-kannada text-base font-bold ml-1">{currentLetter.char}</span> [{currentLetter.name}]
          </span>
        </div>

        <div className="w-full h-3.5 bg-slate-100 border-2 border-black rounded-full overflow-hidden p-0.5 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / 49) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Previous -> Current -> Next Mini Strip */}
        <div className="flex items-center justify-between text-[11px] font-display font-bold text-slate-500 px-1">
          <span>
            {currentIdx > 0 ? (
              <>Passed: <strong className="font-kannada text-slate-900">{KANNADA_LETTERS[currentIdx - 1].char}</strong></>
            ) : (
              'Start: Level 1 (ಅ)'
            )}
          </span>
          <span className="text-[#FF5400] font-pop uppercase">
            {currentIdx + 1 === 49 ? '🏁 FINAL BOSS GATE ಳ!' : `Next: ${KANNADA_LETTERS[currentIdx + 1]?.char || ''}`}
          </span>
        </div>
      </div>

      {/* 3D CAR GAME STAGE */}
      <div className="w-full relative rounded-3xl border-4 border-black shadow-[6px_6px_0px_#111827] overflow-hidden bg-slate-950 flex flex-col items-center">
        {/* Sky / Horizon View */}
        <div className="w-full h-24 bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 relative overflow-hidden border-b-2 border-purple-950 flex items-center justify-between px-4">
          {/* Blox Stars & Sun Horizon */}
          <div className="absolute top-2 left-6 w-3 h-3 bg-amber-200 rotate-45 opacity-80" />
          <div className="absolute top-6 left-1/3 w-2 h-2 bg-pink-200 rotate-12 opacity-60" />
          <div className="absolute top-3 right-1/4 w-3.5 h-3.5 bg-cyan-200 rotate-45 opacity-70" />

          {/* Distant Cyber / Blox Towers */}
          <div className="absolute bottom-0 inset-x-0 flex items-end justify-center gap-2 opacity-30">
            <div className="w-8 h-12 bg-purple-700" />
            <div className="w-12 h-16 bg-indigo-700" />
            <div className="w-6 h-10 bg-pink-600" />
            <div className="w-10 h-14 bg-purple-800" />
            <div className="w-14 h-18 bg-indigo-800" />
            <div className="w-8 h-12 bg-pink-700" />
          </div>

          {/* Speedometer Widget */}
          <div className="z-10 bg-black/70 backdrop-blur-xs border-2 border-white/30 rounded-xl px-2.5 py-1 text-white flex items-center gap-1.5 shadow-md">
            <Zap className={`w-4 h-4 ${gameStatus === 'boosting' ? 'text-amber-400 animate-bounce' : 'text-cyan-400'}`} />
            <div>
              <div className="text-[9px] font-pop text-slate-400 uppercase leading-none">SPEED</div>
              <div className="font-pop text-xs text-white font-black">{speed} <span className="text-[8px] font-normal">BLOX-MPH</span></div>
            </div>
          </div>

          {/* Prompt Banner */}
          <div className="z-10 bg-amber-400 border-2 border-black rounded-xl px-3 py-1 text-slate-950 font-pop text-xs font-black shadow-[2px_2px_0px_#000] rotate-[-1deg]">
            STEER INTO: <span className="font-kannada text-base font-bold ml-1">{currentLetter.char}</span> [{currentLetter.name}]
          </div>

          {/* Skin Selector Quick Toggle */}
          <div className="z-10 flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/20">
            {(['red', 'cyber', 'gold', 'emerald'] as CarSkin[]).map(skin => (
              <button
                key={skin}
                onClick={() => setSelectedSkin(skin)}
                className={`w-5 h-5 rounded-md border-1.5 border-black cursor-pointer transition-transform ${
                  selectedSkin === skin ? 'scale-115 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: skinColors[skin].body }}
                title={`${skin} car`}
              />
            ))}
          </div>
        </div>

        {/* 3D Track Highway Section with Perspective */}
        <div
          className="w-full h-80 sm:h-96 relative flex items-center justify-center overflow-hidden"
          style={{ perspective: 600 }}
        >
          {/* 3D Slanted Ground Plane */}
          <div
            className="absolute inset-0 origin-bottom"
            style={{
              transform: 'rotateX(42deg) translateZ(0)',
              background: 'linear-gradient(to bottom, #1E1B4B 0%, #0F172A 100%)',
            }}
          >
            {/* Animated Road Grid & Striping */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: `40px 40px`,
                backgroundPosition: `0px ${roadOffset}px`,
              }}
            />

            {/* Road Split Markings (V-shape dividing line) */}
            <div className="absolute inset-x-0 bottom-0 top-16 flex justify-center">
              {/* Center Divider Barrier / Stripe */}
              <div
                className="w-4 h-full bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-500 opacity-80"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, #FFC700, #FFC700 20px, #111827 20px, #111827 40px)`,
                  backgroundPosition: `0px ${roadOffset}px`,
                }}
              />
            </div>
          </div>

          {/* TWO 3D HIGHWAY ROADS & GATE PORTALS */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 grid grid-cols-2 gap-4 sm:gap-8 z-10">
            {/* LEFT ROAD GATE */}
            <div className="flex flex-col items-center">
              <span className="font-pop text-[11px] text-cyan-400 uppercase font-black tracking-wider mb-1 flex items-center gap-1">
                <span>◀</span> LEFT ROAD
              </span>

              <div
                onClick={() => handleSteer(0)}
                className={`w-full max-w-[200px] h-36 sm:h-42 rounded-2xl border-3.5 border-black cursor-pointer transition-all duration-300 relative flex flex-col items-center justify-between p-2.5 shadow-[4px_4px_0px_#000] ${
                  carLane === 'left' && gameStatus === 'boosting'
                    ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 scale-105 shadow-[0_0_20px_#00D084]'
                    : carLane === 'left' && gameStatus === 'crashed'
                    ? 'bg-gradient-to-b from-red-500 to-red-700 animate-shake'
                    : 'bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 hover:border-cyan-400 hover:scale-102'
                }`}
              >
                {/* Gate Header Bar */}
                <div className="w-full flex items-center justify-between px-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF]" />
                  <span className="font-pop text-[9px] text-white/90 uppercase font-extrabold bg-black/50 px-2 py-0.5 rounded-full">
                    LANE 1
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakKannada(leftLetter.char, progress.soundEnabled);
                    }}
                    className="w-6 h-6 rounded-full bg-white hover:bg-amber-300 border border-black flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                    title={`Hear ${leftLetter.char} audio`}
                  >
                    <Volume2 className="w-3 h-3 text-slate-950" />
                  </button>
                </div>

                {/* Central Letter Display Plate */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-3 border-black flex flex-col items-center justify-center shadow-[3px_3px_0px_#000]">
                  <span className="font-kannada font-bold text-4xl sm:text-5xl text-slate-950 leading-none">
                    {leftLetter.char}
                  </span>
                  <span className="font-pop text-[10px] text-purple-700 uppercase font-black mt-0.5">
                    [{leftLetter.name}]
                  </span>
                </div>

                {/* Gate Tap Action Tag */}
                <div className="w-full text-center">
                  <span className="font-pop text-[9px] text-white bg-black/60 px-2 py-0.5 rounded-md border border-white/20 uppercase font-bold">
                    TAP TO STEER ◀
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT ROAD GATE */}
            <div className="flex flex-col items-center">
              <span className="font-pop text-[11px] text-amber-400 uppercase font-black tracking-wider mb-1 flex items-center gap-1">
                RIGHT ROAD <span>▶</span>
              </span>

              <div
                onClick={() => handleSteer(1)}
                className={`w-full max-w-[200px] h-36 sm:h-42 rounded-2xl border-3.5 border-black cursor-pointer transition-all duration-300 relative flex flex-col items-center justify-between p-2.5 shadow-[4px_4px_0px_#000] ${
                  carLane === 'right' && gameStatus === 'boosting'
                    ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 scale-105 shadow-[0_0_20px_#00D084]'
                    : carLane === 'right' && gameStatus === 'crashed'
                    ? 'bg-gradient-to-b from-red-500 to-red-700 animate-shake'
                    : 'bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 hover:border-amber-400 hover:scale-102'
                }`}
              >
                {/* Gate Header Bar */}
                <div className="w-full flex items-center justify-between px-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#FFC700]" />
                  <span className="font-pop text-[9px] text-white/90 uppercase font-extrabold bg-black/50 px-2 py-0.5 rounded-full">
                    LANE 2
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakKannada(rightLetter.char, progress.soundEnabled);
                    }}
                    className="w-6 h-6 rounded-full bg-white hover:bg-amber-300 border border-black flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                    title={`Hear ${rightLetter.char} audio`}
                  >
                    <Volume2 className="w-3 h-3 text-slate-950" />
                  </button>
                </div>

                {/* Central Letter Display Plate */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-3 border-black flex flex-col items-center justify-center shadow-[3px_3px_0px_#000]">
                  <span className="font-kannada font-bold text-4xl sm:text-5xl text-slate-950 leading-none">
                    {rightLetter.char}
                  </span>
                  <span className="font-pop text-[10px] text-purple-700 uppercase font-black mt-0.5">
                    [{rightLetter.name}]
                  </span>
                </div>

                {/* Gate Tap Action Tag */}
                <div className="w-full text-center">
                  <span className="font-pop text-[9px] text-white bg-black/60 px-2 py-0.5 rounded-md border border-white/20 uppercase font-bold">
                    TAP TO STEER ▶
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* THE 3D BLOX CAR */}
          <motion.div
            className="absolute bottom-4 z-20 flex flex-col items-center pointer-events-none"
            animate={{
              x: carLane === 'center' ? 0 : carLane === 'left' ? -90 : 90,
              y: gameStatus === 'boosting' ? -80 : gameStatus === 'crashed' ? 10 : [0, -3, 0],
              scale: gameStatus === 'boosting' ? 1.15 : gameStatus === 'crashed' ? 0.95 : 1,
              rotate: carLane === 'left' ? -12 : carLane === 'right' ? 12 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              y: { duration: 0.3, repeat: gameStatus === 'choosing' ? Infinity : 0 },
            }}
          >
            {/* Turbo Exhaust Particle Flames */}
            <div className="flex gap-7 mb-[-6px] z-0">
              <motion.div
                animate={
                  gameStatus === 'boosting'
                    ? { scale: [1, 1.8, 1], height: [24, 42, 24] }
                    : { scale: [0.8, 1.2, 0.8], height: [12, 18, 12] }
                }
                transition={{ repeat: Infinity, duration: 0.15 }}
                className="w-4 rounded-b-full bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 shadow-[0_0_12px_#FF5400]"
              />
              <motion.div
                animate={
                  gameStatus === 'boosting'
                    ? { scale: [1, 1.8, 1], height: [24, 42, 24] }
                    : { scale: [0.8, 1.2, 0.8], height: [12, 18, 12] }
                }
                transition={{ repeat: Infinity, duration: 0.15 }}
                className="w-4 rounded-b-full bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 shadow-[0_0_12px_#FF5400]"
              />
            </div>

            {/* 3D Blox Car Body Canvas SVG */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 relative drop-shadow-[0_12px_8px_rgba(0,0,0,0.8)]">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* 4 Blocky Wheels */}
                <rect x="8" y="24" width="18" height="26" rx="4" fill="#18181B" stroke="#000" strokeWidth="2.5" />
                <rect x="94" y="24" width="18" height="26" rx="4" fill="#18181B" stroke="#000" strokeWidth="2.5" />
                <rect x="6" y="68" width="20" height="28" rx="4" fill="#18181B" stroke="#000" strokeWidth="2.5" />
                <rect x="94" y="68" width="20" height="28" rx="4" fill="#18181B" stroke="#000" strokeWidth="2.5" />

                {/* Main Blox Car Chassis */}
                <rect x="22" y="18" width="76" height="84" rx="14" fill={currentTheme.body} stroke="#000" strokeWidth="4" />

                {/* Hood / Racing Stripe */}
                <rect x="52" y="18" width="16" height="84" fill={currentTheme.trim} />
                <rect x="30" y="32" width="60" height="26" rx="8" fill="#0F172A" stroke="#000" strokeWidth="3" />

                {/* Windshield Reflection */}
                <polygon points="34,36 86,36 80,54 40,54" fill="#38BDF8" opacity="0.85" />

                {/* Blox Driver Avatar Inside */}
                <circle cx="60" cy="46" r="8" fill="#FFDE59" stroke="#000" strokeWidth="2" />
                <rect x="54" y="42" width="12" height="4" rx="1" fill="#1E293B" />

                {/* Rear Spoiler Wings */}
                <rect x="14" y="86" width="92" height="12" rx="4" fill="#111827" stroke="#000" strokeWidth="3" />
                <rect x="28" y="80" width="8" height="8" fill="#374151" stroke="#000" strokeWidth="2" />
                <rect x="84" y="80" width="8" height="8" fill="#374151" stroke="#000" strokeWidth="2" />

                {/* Headlights Beams */}
                <circle cx="34" cy="22" r="5" fill="#FEF08A" stroke="#000" strokeWidth="1.5" />
                <circle cx="86" cy="22" r="5" fill="#FEF08A" stroke="#000" strokeWidth="1.5" />

                {/* Glowing Blox Badge on Hood */}
                <rect x="54" y="66" width="12" height="12" rx="2" fill="#FFC700" stroke="#000" strokeWidth="2" />
                <text x="60" y="75" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#000">⚡</text>
              </svg>
            </div>

            {/* Dynamic Status Pill */}
            {gameStatus === 'boosting' && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                className="mt-[-8px] px-3 py-1 bg-emerald-400 text-slate-950 font-pop text-xs font-black border-2 border-black rounded-full shadow-[2px_2px_0px_#000]"
              >
                NITRO BOOST! +25 XP ⚡
              </motion.div>
            )}

            {gameStatus === 'crashed' && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                className="mt-[-8px] px-3 py-1 bg-red-600 text-white font-pop text-xs font-black border-2 border-black rounded-full shadow-[2px_2px_0px_#000]"
              >
                CRASH! RESETTING TO ಅ 💥
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Chunky On-Screen Blox Steering Controls */}
      <div className="w-full my-3">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
          {/* Left Steering Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSteer(0)}
            disabled={gameStatus !== 'choosing'}
            className="p-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-3.5 border-black rounded-2xl shadow-[4px_4px_0px_#111827] flex items-center justify-between cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black">◀</span>
              <div className="text-left">
                <div className="font-pop text-xs uppercase font-black leading-tight">
                  STEER LEFT
                </div>
                <div className="text-[10px] text-cyan-100 font-display font-bold">
                  Road 1: <strong className="font-kannada text-sm font-bold text-white">{leftLetter.char}</strong> [{leftLetter.name}]
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white text-slate-950 border-2 border-black flex items-center justify-center font-kannada font-bold text-lg shadow-[1px_1px_0px_#000]">
              {leftLetter.char}
            </div>
          </motion.button>

          {/* Right Steering Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSteer(1)}
            disabled={gameStatus !== 'choosing'}
            className="p-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white border-3.5 border-black rounded-2xl shadow-[4px_4px_0px_#111827] flex items-center justify-between cursor-pointer disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-slate-950 border-2 border-black flex items-center justify-center font-kannada font-bold text-lg shadow-[1px_1px_0px_#000]">
              {rightLetter.char}
            </div>
            <div className="flex items-center gap-2 text-right">
              <div className="text-right">
                <div className="font-pop text-xs uppercase font-black leading-tight">
                  STEER RIGHT
                </div>
                <div className="text-[10px] text-amber-100 font-display font-bold">
                  Road 2: <strong className="font-kannada text-sm font-bold text-white">{rightLetter.char}</strong> [{rightLetter.name}]
                </div>
              </div>
              <span className="text-2xl font-black">▶</span>
            </div>
          </motion.button>
        </div>

        {/* Keyboard Helper Hint */}
        <div className="text-center mt-2">
          <span className="text-[11px] text-slate-500 font-display font-bold">
            PRO-TIP: Use <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-xs">◀</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-xs">▶</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-xs">A</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-xs">D</kbd> keys to steer your kart!
          </span>
        </div>
      </div>

      {/* Ultimate Boss Victory Modal (All 49 letters completed!) */}
      {gameStatus === 'victory' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4"
        >
          <div className="w-full max-w-md bg-[#FFF9E6] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_#000] text-center flex flex-col items-center">
            <div className="text-5xl mb-1 animate-bounce">🏆</div>
            <ExplorerCharacter mood="celebrating" size="sm" className="mb-1" />
            <span className="px-3 py-1 bg-amber-400 border-2 border-black rounded-full font-pop text-xs font-black uppercase shadow-[2px_2px_0px_#000] mb-2">
              HIGHWAY CONQUERED!
            </span>
            <h2 className="font-pop text-2xl sm:text-3xl text-slate-950 uppercase leading-tight">
              KannadaBLOX CHAMPION!
            </h2>
            <p className="font-display font-bold text-slate-700 text-sm mt-2">
              Incredible driving! You steered through every road in perfect order across all 49 letters from <strong className="font-kannada font-bold text-lg">ಅ</strong> to <strong className="font-kannada font-bold text-lg">ಳ</strong>!
            </p>

            <div className="my-3 p-3 bg-white border-2 border-black rounded-2xl w-full flex items-center justify-around shadow-sm">
              <div>
                <div className="text-[10px] font-pop text-slate-400 uppercase">REWARD</div>
                <div className="font-pop text-lg text-emerald-600 font-black">+250 XP</div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <div className="text-[10px] font-pop text-slate-400 uppercase">STREAK</div>
                <div className="font-pop text-lg text-orange-500 font-black">49 / 49 👑</div>
              </div>
            </div>

            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => {
                  setCurrentIdx(0);
                  setCurrentStreak(0);
                  setupRound(0);
                }}
                className="flex-1 pop-btn py-3 bg-white text-slate-900 font-pop text-xs cursor-pointer"
              >
                RACE AGAIN
              </button>
              <button
                onClick={onExit}
                className="flex-1 pop-btn py-3 bg-[#FF5400] text-white font-pop text-xs cursor-pointer"
              >
                RETURN HOME
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
