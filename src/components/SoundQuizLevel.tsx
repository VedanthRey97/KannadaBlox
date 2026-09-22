import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LetterData, UserProgress } from '../types';
import { speakKannada, playTapSound, playSuccessSound, playGentleWrongSound } from '../utils/audio';
import { ExplorerCharacter } from './ExplorerCharacter';

interface SoundQuizLevelProps {
  unlockedLetters: LetterData[];
  progress: UserProgress;
  onCorrectAnswer: (letterId: string) => void;
  onWrongAnswer: (letterId: string) => void;
}

export const SoundQuizLevel: React.FC<SoundQuizLevelProps> = ({
  unlockedLetters,
  progress,
  onCorrectAnswer,
  onWrongAnswer,
}) => {
  const [targetLetter, setTargetLetter] = useState<LetterData>(unlockedLetters[0]);
  const [options, setOptions] = useState<LetterData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const setupRound = () => {
    setSelectedId(null);
    setIsCorrect(null);
    setShakeId(null);

    const target = unlockedLetters[Math.floor(Math.random() * unlockedLetters.length)];
    setTargetLetter(target);

    const otherLetters = unlockedLetters.filter(l => l.id !== target.id);
    const shuffledOthers = [...otherLetters].sort(() => 0.5 - Math.random()).slice(0, 3);
    const roundOptions = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);

    setTimeout(() => {
      handlePlaySound(target.char);
    }, 400);
  };

  useEffect(() => {
    setupRound();
  }, [unlockedLetters]);

  const handlePlaySound = (charToPlay?: string) => {
    setIsPlayingSound(true);
    speakKannada(charToPlay || targetLetter.char, progress.soundEnabled);
    setTimeout(() => setIsPlayingSound(false), 900);
  };

  const handleChoice = (opt: LetterData) => {
    if (selectedId && isCorrect) return;

    playTapSound(progress.soundEnabled);
    setSelectedId(opt.id);

    if (opt.id === targetLetter.id) {
      setIsCorrect(true);
      playSuccessSound(progress.soundEnabled);
      onCorrectAnswer(targetLetter.id);

      try {
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#FF5400', '#FFC700', '#00D084', '#2563EB'],
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setupRound();
      }, 1500);
    } else {
      setIsCorrect(false);
      setShakeId(opt.id);
      playGentleWrongSound(progress.soundEnabled);
      onWrongAnswer(targetLetter.id);
      setTimeout(() => setShakeId(null), 600);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 flex flex-col items-center">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-pop text-xs text-white bg-rose-500 border-2.5 border-black px-3 py-1 rounded-full shadow-[2.5px_2.5px_0px_#000] rotate-[-1deg]">
            STAGE 5: SOUND RADAR
          </span>
          <span className="font-display font-extrabold text-slate-800 text-xs sm:text-sm">
            Audio Decoder
          </span>
        </div>

        <button
          onClick={setupRound}
          className="pop-btn bg-white hover:bg-slate-50 text-slate-900 px-3 py-1 text-xs font-pop flex items-center gap-1.5 cursor-pointer"
          title="New Sound Challenge"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>SKIP</span>
        </button>
      </div>

      {/* Pop Art Comic Boombox Speaker Card */}
      <div className="w-full bg-white border-3.5 border-black rounded-3xl p-6 flex flex-col items-center relative overflow-hidden shadow-[6px_6px_0px_#111827] my-2">
        <div className="absolute inset-0 halftone-cream pointer-events-none opacity-40" />

        <div className="relative flex flex-col items-center z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#FF5400] border-3.5 border-black rounded-3xl flex items-center justify-center shadow-[4px_4px_0px_#000] relative">
            <span className="text-5xl sm:text-6xl filter drop-shadow-[2px_2px_0px_#000]">
              📻
            </span>
            {isPlayingSound && (
              <div className="absolute -top-3 -right-3 px-2 py-0.5 bg-[#FFDE59] border-2 border-black rounded-full text-[10px] font-pop uppercase animate-bounce shadow-[1.5px_1.5px_0px_#000]">
                PLAYING 🎵
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handlePlaySound()}
            className="mt-4 pop-btn px-6 py-2.5 bg-[#FFDE59] hover:bg-[#FFE500] text-slate-950 font-pop text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000]"
          >
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
            <span>PLAY SOUND CLUE</span>
          </motion.button>
          <span className="text-[11px] font-display font-semibold text-slate-500 mt-1.5">
            Tap button above to repeat the sound
          </span>
        </div>
      </div>

      {/* Companion Character Guidance */}
      <div className="my-2">
        <ExplorerCharacter
          mood={
            isCorrect === true
              ? 'celebrating'
              : isCorrect === false
              ? 'encouraging'
              : 'thinking'
          }
          speechText={
            isCorrect === true
              ? `You cracked the audio code! That was "${targetLetter.char}"! ⚡`
              : isCorrect === false
              ? 'Listen to the vowel/consonant sound again and tap the matching rune!'
              : 'Listen to the audio radar and pick which Kannada rune matches!'
          }
          subText={isCorrect === true ? '+20 XP Gained!' : 'Select 1 of the 4 rune buttons'}
          size="sm"
        />
      </div>

      {/* 4 Chunky Pop Choice Buttons */}
      <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 mt-2">
        {options.map((opt, idx) => {
          const isSelected = selectedId === opt.id;
          const isTarget = opt.id === targetLetter.id;
          const isShaking = shakeId === opt.id;

          let btnClass = 'bg-white text-slate-900 hover:bg-slate-50';
          if (isSelected && isCorrect) {
            btnClass = 'bg-[#00D084] text-slate-950';
          } else if (isShaking) {
            btnClass = 'bg-[#FF453A] text-white';
          }

          return (
            <motion.button
              key={`${opt.id}-${idx}`}
              onClick={() => handleChoice(opt)}
              animate={
                isShaking
                  ? { x: [-8, 8, -6, 6, 0] }
                  : isSelected && isCorrect
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ duration: 0.3 }}
              className={`h-22 sm:h-24 pop-btn flex flex-col items-center justify-center select-none cursor-pointer relative ${btnClass}`}
            >
              <span className="font-kannada font-bold text-4xl sm:text-5xl leading-none">{opt.char}</span>
              <span className="font-pop text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                [{opt.name}]
              </span>

              {isSelected && isCorrect && (
                <div className="absolute top-2 right-2 text-slate-950">
                  <CheckCircle2 className="w-5 h-5 stroke-[3]" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
