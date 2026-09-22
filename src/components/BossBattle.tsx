import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Volume2, Trophy, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LetterData, UserProgress } from '../types';
import { speakKannada, playTapSound, playGentleWrongSound, playCelebrationFanfare, playDragonHitSound } from '../utils/audio';
import { ExplorerCharacter } from './ExplorerCharacter';

interface BossBattleProps {
  unlockedLetters: LetterData[];
  progress: UserProgress;
  onVictory: () => void;
  onExit: () => void;
}

interface QuestionStage {
  stageNumber: number;
  type: 'identify' | 'sound' | 'word';
  promptEnglish: string;
  targetChar: string;
  targetSound?: string;
  options: { char: string; name: string; isCorrect: boolean }[];
}

export const BossBattle: React.FC<BossBattleProps> = ({
  unlockedLetters,
  progress,
  onVictory,
  onExit,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [dragonShields, setDragonShields] = useState<number>(4);
  const [isVictorious, setIsVictorious] = useState<boolean>(false);
  const [shakeDragon, setShakeDragon] = useState<boolean>(false);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [wrongChar, setWrongChar] = useState<string | null>(null);

  const [stages, setStages] = useState<QuestionStage[]>([]);

  useEffect(() => {
    const sample = [...unlockedLetters].sort(() => 0.5 - Math.random());
    const l1 = sample[0] || { char: 'ಅ', name: 'A' };
    const l2 = sample[1] || { char: 'ಆ', name: 'Aa' };
    const l3 = sample[2] || { char: 'ಇ', name: 'I' };
    const l4 = sample[3] || { char: 'ಕ', name: 'Ka' };

    const stageList: QuestionStage[] = [
      {
        stageNumber: 1,
        type: 'identify',
        promptEnglish: `Break Shield 1: Strike with rune "${l1.char}" [${l1.name}]!`,
        targetChar: l1.char,
        options: [
          { char: l1.char, name: l1.name, isCorrect: true },
          { char: l2.char, name: l2.name, isCorrect: false },
          { char: l3.char, name: l3.name, isCorrect: false },
        ].sort(() => 0.5 - Math.random()),
      },
      {
        stageNumber: 2,
        type: 'identify',
        promptEnglish: `Break Shield 2: Strike with rune "${l2.char}" [${l2.name}]!`,
        targetChar: l2.char,
        options: [
          { char: l1.char, name: l1.name, isCorrect: false },
          { char: l2.char, name: l2.name, isCorrect: true },
          { char: l4.char, name: l4.name, isCorrect: false },
        ].sort(() => 0.5 - Math.random()),
      },
      {
        stageNumber: 3,
        type: 'sound',
        promptEnglish: `Break Shield 3: Listen and identify the rune's audio!`,
        targetChar: l3.char,
        targetSound: l3.char,
        options: [
          { char: l3.char, name: l3.name, isCorrect: true },
          { char: l2.char, name: l2.name, isCorrect: false },
          { char: l1.char, name: l1.name, isCorrect: false },
        ].sort(() => 0.5 - Math.random()),
      },
      {
        stageNumber: 4,
        type: 'word',
        promptEnglish: `FINAL BOSS SHIELD: Select rune "${l4.char}" [${l4.name}]!`,
        targetChar: l4.char,
        options: [
          { char: l4.char, name: l4.name, isCorrect: true },
          { char: l3.char, name: l3.name, isCorrect: false },
          { char: l2.char, name: l2.name, isCorrect: false },
        ].sort(() => 0.5 - Math.random()),
      },
    ];

    setStages(stageList);
    setDragonShields(4);
    setCurrentStageIdx(0);
    setIsVictorious(false);
  }, [unlockedLetters]);

  const currentStage = stages[currentStageIdx];

  const handleSelectOption = (opt: { char: string; name: string; isCorrect: boolean }) => {
    if (selectedChar || isVictorious) return;

    playTapSound(progress.soundEnabled);
    setSelectedChar(opt.char);

    if (opt.isCorrect) {
      playDragonHitSound(progress.soundEnabled);
      setShakeDragon(true);
      const nextShields = dragonShields - 1;
      setDragonShields(nextShields);

      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.4 },
          colors: ['#FF5400', '#FFC700', '#E5192D'],
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setShakeDragon(false);
        setSelectedChar(null);

        if (nextShields <= 0) {
          setIsVictorious(true);
          playCelebrationFanfare(progress.soundEnabled);
          onVictory();
        } else {
          setCurrentStageIdx(prev => prev + 1);
        }
      }, 1000);
    } else {
      setWrongChar(opt.char);
      playGentleWrongSound(progress.soundEnabled);
      setTimeout(() => {
        setWrongChar(null);
        setSelectedChar(null);
      }, 700);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 flex flex-col items-center">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-pop text-xs text-white bg-red-600 border-2.5 border-black px-3 py-1 rounded-full shadow-[2.5px_2.5px_0px_#000] rotate-[-1deg]">
            ⚔️ BOSS RAID
          </span>
          <span className="font-display font-extrabold text-slate-800 text-xs sm:text-sm">
            The Runic Dragon
          </span>
        </div>

        <button
          onClick={onExit}
          className="pop-btn bg-white hover:bg-slate-50 text-slate-900 px-3 py-1 text-xs font-pop flex items-center gap-1.5 cursor-pointer"
        >
          <span>EXIT RAID</span>
        </button>
      </div>

      {/* Dragon Arena Card */}
      <div className="w-full bg-[#FFF9E6] border-3.5 border-black rounded-3xl p-5 shadow-[6px_6px_0px_#111827] flex flex-col items-center relative overflow-hidden my-2">
        {/* Dragon Health / Shields Bar */}
        <div className="w-full flex items-center justify-between gap-2 mb-3">
          <span className="font-pop text-xs text-slate-900 uppercase">
            DRAGON SHIELDS:
          </span>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center font-pop text-xs shadow-[1.5px_1.5px_0px_#000] ${
                  s <= dragonShields
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-200 text-slate-400 opacity-40'
                }`}
              >
                🛡️
              </div>
            ))}
          </div>
        </div>

        {/* Dragon Vector Illustration with Pop Styling */}
        <motion.div
          animate={
            shakeDragon
              ? { x: [-12, 12, -8, 8, -4, 4, 0], scale: [1, 0.95, 1.05, 1] }
              : isVictorious
              ? { rotate: 180, opacity: 0.3 }
              : { y: [0, -6, 0] }
          }
          transition={{ duration: shakeDragon ? 0.4 : 2, repeat: shakeDragon || isVictorious ? 0 : Infinity }}
          className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center my-2"
        >
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[4px_4px_0px_#111827]">
            {/* Dragon Wings */}
            <path
              d="M30 70 C10 40 40 20 60 50 Z"
              fill="#E5192D"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M130 70 C150 40 120 20 100 50 Z"
              fill="#E5192D"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Dragon Body */}
            <circle cx="80" cy="95" r="42" fill="#FF5400" stroke="#111827" strokeWidth="4.5" />
            <circle cx="80" cy="100" r="28" fill="#FFDE59" stroke="#111827" strokeWidth="3" />

            {/* Dragon Horns */}
            <polygon points="58,55 50,30 68,48" fill="#FFC700" stroke="#111827" strokeWidth="3" />
            <polygon points="102,55 110,30 92,48" fill="#FFC700" stroke="#111827" strokeWidth="3" />

            {/* Dragon Head */}
            <circle cx="80" cy="65" r="28" fill="#FF5400" stroke="#111827" strokeWidth="4" />

            {/* Dragon Eyes */}
            <circle cx="70" cy="62" r="7" fill="#FFFFFF" stroke="#111827" strokeWidth="3" />
            <circle cx="71" cy="62" r="3.5" fill="#111827" />
            <circle cx="90" cy="62" r="7" fill="#FFFFFF" stroke="#111827" strokeWidth="3" />
            <circle cx="89" cy="62" r="3.5" fill="#111827" />

            {/* Dragon Snout & Fire Smoke */}
            <ellipse cx="80" cy="74" rx="14" ry="8" fill="#E5192D" stroke="#111827" strokeWidth="3" />
            <circle cx="76" cy="74" r="2" fill="#111827" />
            <circle cx="84" cy="74" r="2" fill="#111827" />

            {/* Teeth */}
            <polygon points="74,78 77,84 80,78" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
            <polygon points="80,78 83,84 86,78" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
          </svg>

          {shakeDragon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 1] }}
              className="absolute -top-4 -right-4 px-3 py-1 bg-[#FFDE59] border-2.5 border-black rounded-full font-pop text-xs text-slate-950 shadow-[2px_2px_0px_#000] rotate-12"
            >
              💥 HIT!
            </motion.div>
          )}
        </motion.div>

        {/* Quest Stage Directive */}
        {currentStage && !isVictorious && (
          <div className="w-full mt-2 p-3 bg-white border-2.5 border-black rounded-xl text-center shadow-[3px_3px_0px_#000]">
            <div className="font-pop text-xs text-red-600 uppercase">
              SHIELD #{currentStage.stageNumber} OF 4
            </div>
            <div className="font-display font-extrabold text-slate-900 text-xs sm:text-sm mt-0.5">
              {currentStage.promptEnglish}
            </div>

            {currentStage.type === 'sound' && (
              <button
                onClick={() => speakKannada(currentStage.targetChar, progress.soundEnabled)}
                className="mt-2 pop-btn px-4 py-1.5 bg-[#FFDE59] hover:bg-[#FFE500] text-slate-950 font-pop text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>HEAR AUDIO</span>
              </button>
            )}
          </div>
        )}

        {/* Victory Card */}
        {isVictorious && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full mt-4 p-5 bg-[#00D084] border-3.5 border-black rounded-2xl shadow-[4px_4px_0px_#000] text-center text-slate-950"
          >
            <div className="text-4xl mb-1">👑</div>
            <div className="font-pop text-lg sm:text-xl">
              RUNIC DRAGON DEFEATED! +100 XP
            </div>
            <div className="text-xs font-display font-bold mt-1 text-slate-900">
              You shattered all 4 elemental shields with true Kannada mastery!
            </div>

            <button
              onClick={onExit}
              className="mt-4 pop-btn px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-950 font-pop text-xs inline-flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000]"
            >
              <span>CLAIM BOUNTY &amp; RETURN</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Attack Choice Buttons */}
      {!isVictorious && currentStage && (
        <div className="w-full grid grid-cols-3 gap-3 my-2">
          {currentStage.options.map((opt, i) => {
            const isSelected = selectedChar === opt.char;
            const isWrong = wrongChar === opt.char;

            return (
              <motion.button
                key={`${opt.char}-${i}`}
                onClick={() => handleSelectOption(opt)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isWrong ? { x: [-8, 8, -4, 4, 0] } : {}}
                className={`h-22 rounded-2xl border-3.5 border-black flex flex-col items-center justify-center select-none cursor-pointer shadow-[4px_4px_0px_#111827] transition-all ${
                  isSelected && opt.isCorrect
                    ? 'bg-[#00D084] text-slate-950'
                    : isWrong
                    ? 'bg-[#FF453A] text-white'
                    : 'bg-white hover:bg-amber-50 text-slate-900'
                }`}
              >
                <span className="font-kannada font-bold text-4xl leading-none">{opt.char}</span>
                <span className="font-pop text-[9px] text-slate-500 uppercase mt-0.5">
                  [{opt.name}]
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Companion Guidance */}
      <div className="my-2">
        <ExplorerCharacter
          mood={isVictorious ? 'celebrating' : 'encouraging'}
          speechText={
            isVictorious
              ? 'We did it! The Dragon gave up the Golden Rune! Incredible raid! ⚡'
              : `Strike the dragon with rune "${currentStage?.targetChar}" to break shield #${currentStage?.stageNumber}!`
          }
          subText={isVictorious ? '+100 XP Bounty Claimed!' : `Shields Remaining: ${dragonShields}/4`}
          size="sm"
        />
      </div>
    </div>
  );
};
