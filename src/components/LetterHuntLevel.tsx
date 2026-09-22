import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Trophy, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LetterData, UserProgress } from '../types';
import { speakKannada, playTapSound, playSuccessSound, playGentleWrongSound, playCoinSound } from '../utils/audio';
import { ExplorerCharacter } from './ExplorerCharacter';

interface LetterHuntLevelProps {
  unlockedLetters: LetterData[];
  progress: UserProgress;
  onHuntComplete: (letterId: string) => void;
  onLetterFound: (letterId: string) => void;
}

interface SceneItem {
  id: string;
  letter: LetterData;
  xPercent: number;
  yPercent: number;
  rotation: number;
}

export const LetterHuntLevel: React.FC<LetterHuntLevelProps> = ({
  unlockedLetters,
  progress,
  onHuntComplete,
  onLetterFound,
}) => {
  const [targetLetter, setTargetLetter] = useState<LetterData>(unlockedLetters[0]);
  const [sceneItems, setSceneItems] = useState<SceneItem[]>([]);
  const [foundId, setFoundId] = useState<string | null>(null);
  const [wobbleId, setWobbleId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const setupRound = (preferredTarget?: LetterData) => {
    const target = preferredTarget || unlockedLetters[Math.floor(Math.random() * unlockedLetters.length)];
    setTargetLetter(target);
    setFoundId(null);
    setWobbleId(null);

    const otherLetters = unlockedLetters.filter(l => l.id !== target.id);
    const shuffledOthers = [...otherLetters].sort(() => 0.5 - Math.random()).slice(0, 4);
    const roundLetters = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());

    const positions = [
      { xPercent: 18, yPercent: 25, rot: -3 },
      { xPercent: 80, yPercent: 24, rot: 2 },
      { xPercent: 28, yPercent: 62, rot: -2 },
      { xPercent: 50, yPercent: 42, rot: 1 },
      { xPercent: 74, yPercent: 66, rot: -4 },
      { xPercent: 44, yPercent: 78, rot: 3 },
    ].sort(() => 0.5 - Math.random());

    const items: SceneItem[] = roundLetters.map((l, i) => ({
      id: `hunt-${l.id}-${i}`,
      letter: l,
      xPercent: positions[i].xPercent,
      yPercent: positions[i].yPercent,
      rotation: positions[i].rot,
    }));

    setSceneItems(items);

    setTimeout(() => {
      speakKannada(target.char, progress.soundEnabled);
    }, 300);
  };

  useEffect(() => {
    setupRound();
  }, [unlockedLetters]);

  const handleItemClick = (item: SceneItem) => {
    if (foundId) return;

    if (item.letter.id === targetLetter.id) {
      setFoundId(item.id);
      playSuccessSound(progress.soundEnabled);
      playCoinSound(progress.soundEnabled);
      setScore(s => s + 1);
      onLetterFound(item.letter.id);
      onHuntComplete(item.letter.id);

      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#00D084', '#FF5400', '#FFC700', '#2563EB'],
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setupRound();
      }, 1400);
    } else {
      setWobbleId(item.id);
      playGentleWrongSound(progress.soundEnabled);
      setTimeout(() => {
        setWobbleId(null);
      }, 600);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 flex flex-col items-center">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-pop text-xs text-white bg-[#00D084] border-2.5 border-black px-3 py-1 rounded-full shadow-[2.5px_2.5px_0px_#000] rotate-[-1deg]">
            STAGE 4: RUNE HUNT
          </span>
          <span className="font-display font-extrabold text-slate-800 text-xs sm:text-sm">
            Found: <strong className="text-emerald-600">{score}</strong> Runes
          </span>
        </div>

        <button
          onClick={() => speakKannada(targetLetter.char, progress.soundEnabled)}
          className="pop-btn bg-[#FFC700] hover:bg-[#FFE500] text-slate-900 px-3 py-1 text-xs font-pop flex items-center gap-1.5 cursor-pointer"
          title="Replay Audio Clue"
        >
          <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>REPLAY AUDIO</span>
        </button>
      </div>

      {/* Target Mission Pop Sticker Banner */}
      <div className="w-full bg-[#FFF9E6] border-3 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_#111827] flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#FF5400] text-white border-2 border-black rounded-xl flex items-center justify-center text-lg font-pop shadow-[1.5px_1.5px_0px_#000] rotate-[-2deg]">
            🔍
          </div>
          <div>
            <div className="font-pop text-xs text-slate-900">
              MISSION OBJECTIVE
            </div>
            <div className="text-xs font-display font-bold text-slate-600">
              Find rune &ldquo;<strong className="text-[#FF5400] font-kannada font-bold text-sm">{targetLetter.char}</strong>&rdquo; [{targetLetter.name}] hidden in the landscape!
            </div>
          </div>
        </div>

        <button
          onClick={() => speakKannada(targetLetter.char, progress.soundEnabled)}
          className="w-12 h-12 rounded-full bg-white border-2.5 border-black flex items-center justify-center text-xl font-kannada font-bold text-[#FF5400] shadow-[2px_2px_0px_#000] hover:scale-105 active:scale-95 transition-transform"
        >
          {targetLetter.char}
        </button>
      </div>

      {/* Pop Illustration Landscape Hunt Stage */}
      <div className="w-full h-80 sm:h-96 relative border-3.5 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_#111827] bg-gradient-to-b from-[#60A5FA] via-[#93C5FD] to-[#34D399] select-none my-1">
        {/* Comic Pop Clouds */}
        <div className="absolute top-4 left-6 w-20 h-8 bg-white border-2.5 border-black rounded-full shadow-[2px_2px_0px_#000]" />
        <div className="absolute top-10 right-10 w-28 h-9 bg-white border-2.5 border-black rounded-full shadow-[2px_2px_0px_#000]" />

        {/* Comic Rolling Green Hills */}
        <div className="absolute -bottom-10 -left-10 w-96 h-48 bg-[#10B981] border-3.5 border-black rounded-full rotate-6" />
        <div className="absolute -bottom-16 right-0 w-80 h-52 bg-[#059669] border-3.5 border-black rounded-full -rotate-6" />

        {/* Scattered Collectible Pop Rune Stickers */}
        {sceneItems.map(item => {
          const isTarget = item.letter.id === targetLetter.id;
          const isFound = foundId === item.id;
          const isWobbling = wobbleId === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item)}
              whileHover={{ scale: 1.15, rotate: item.rotation }}
              whileTap={{ scale: 0.9 }}
              animate={
                isFound
                  ? { scale: [1, 1.4, 1.1], rotate: [0, 15, 0] }
                  : isWobbling
                  ? { x: [-8, 8, -6, 6, 0] }
                  : { rotate: item.rotation }
              }
              style={{
                left: `${item.xPercent}%`,
                top: `${item.yPercent}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-3.5 border-black flex flex-col items-center justify-center font-kannada font-bold text-3xl sm:text-4xl cursor-pointer select-none transition-shadow ${
                isFound
                  ? 'bg-[#00D084] text-slate-950 shadow-[4px_4px_0px_#000] z-20'
                  : isWobbling
                  ? 'bg-[#FF453A] text-white shadow-[4px_4px_0px_#000] z-20'
                  : 'bg-white text-slate-900 shadow-[4px_4px_0px_#111827] hover:shadow-[5px_5px_0px_#000]'
              }`}
            >
              <span>{item.letter.char}</span>
              <span className="font-pop text-[8px] text-slate-500 uppercase mt-0.5">
                [{item.letter.name}]
              </span>

              {isFound && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFDE59] border-2 border-black rounded-full flex items-center justify-center text-xs shadow-[1px_1px_0px_#000]">
                  ✓
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Companion Character Guidance */}
      <div className="my-2">
        <ExplorerCharacter
          mood={foundId ? 'celebrating' : wobbleId ? 'encouraging' : 'idle'}
          speechText={
            foundId
              ? `Boom! You found rune "${targetLetter.char}"! +20 XP! ⚡`
              : wobbleId
              ? 'Oops! Not that rune! Keep looking for the target!'
              : `Look across the scenery to spot rune "${targetLetter.char}" [${targetLetter.name}]!`
          }
          subText={foundId ? 'Next rune spawning...' : `Hunt Score: ${score}`}
          size="sm"
        />
      </div>
    </div>
  );
};
