import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LetterData, UserProgress } from '../types';
import { speakKannada, playTapSound, playSuccessSound, playGentleWrongSound } from '../utils/audio';
import { ExplorerCharacter } from './ExplorerCharacter';

interface DiscoverLevelProps {
  unlockedLetters: LetterData[];
  currentLetter: LetterData;
  progress: UserProgress;
  onLetterLearned: (letterId: string, result: 'correct' | 'wrong') => void;
  onNextLetter: () => void;
  onGoToTracing: (letter: LetterData) => void;
}

export const DiscoverLevel: React.FC<DiscoverLevelProps> = ({
  unlockedLetters,
  currentLetter,
  progress,
  onLetterLearned,
  onNextLetter,
  onGoToTracing,
}) => {
  const [options, setOptions] = useState<LetterData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [hintActive, setHintActive] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [speaking, setSpeaking] = useState<boolean>(false);

  useEffect(() => {
    setSelectedId(null);
    setIsCorrect(null);
    setShakeId(null);
    setHintActive(false);
    setAttempts(0);

    const distractors = unlockedLetters
      .filter(l => l.id !== currentLetter.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    if (distractors.length < 3) {
      const fallbackList = unlockedLetters.filter(l => l.id !== currentLetter.id);
      distractors.push(...fallbackList.slice(0, 3 - distractors.length));
    }

    const shuffled = [currentLetter, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(shuffled);

    const timer = setTimeout(() => {
      handlePronounce();
    }, 400);

    return () => clearTimeout(timer);
  }, [currentLetter.id, unlockedLetters]);

  const handlePronounce = () => {
    setSpeaking(true);
    speakKannada(currentLetter.char, progress.soundEnabled);
    setTimeout(() => setSpeaking(false), 900);
  };

  const handleSelect = (option: LetterData) => {
    playTapSound(progress.soundEnabled);
    setSelectedId(option.id);

    if (option.id === currentLetter.id) {
      setIsCorrect(true);
      playSuccessSound(progress.soundEnabled);
      onLetterLearned(currentLetter.id, 'correct');

      try {
        confetti({
          particleCount: 50,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#FF5400', '#FFC700', '#00D084', '#2563EB'],
        });
      } catch {
        // ignore
      }
    } else {
      setIsCorrect(false);
      setShakeId(option.id);
      playGentleWrongSound(progress.soundEnabled);
      onLetterLearned(currentLetter.id, 'wrong');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 2) {
        setHintActive(true);
      }

      setTimeout(() => {
        setShakeId(null);
      }, 700);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 flex flex-col items-center">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-pop text-xs text-white bg-[#FF5400] border-2.5 border-black px-3 py-1 rounded-full shadow-[2.5px_2.5px_0px_#000] rotate-[-1deg]">
            STAGE 1: DISCOVER
          </span>
          <span className="font-display font-extrabold text-slate-800 text-xs sm:text-sm">
            Rune Lore
          </span>
        </div>

        <button
          onClick={() => onGoToTracing(currentLetter)}
          className="pop-btn bg-white hover:bg-emerald-50 text-emerald-600 px-3 py-1 text-xs font-pop flex items-center gap-1.5 cursor-pointer"
          title="Practice Tracing this rune"
        >
          <span>✍️ TRACE {currentLetter.char}</span>
        </button>
      </div>

      {/* Main Runic Chamber Card (Pop Art Vinyl Sticker Card) */}
      <motion.div
        key={currentLetter.id}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full bg-white border-3.5 border-black rounded-3xl p-6 sm:p-7 flex flex-col items-center relative overflow-hidden my-2 shadow-[6px_6px_0px_#111827]"
      >
        {/* Subtle decorative dot pattern */}
        <div className="absolute inset-0 halftone-cream pointer-events-none opacity-40" />

        {/* Large High-Contrast Pop Kannada Character */}
        <div className="relative flex flex-col items-center z-10">
          <motion.div
            animate={speaking ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="text-8xl sm:text-9xl font-bold text-[#FF5400] font-kannada leading-none select-none filter drop-shadow-[4px_4px_0px_#111827] py-2"
          >
            {currentLetter.char}
          </motion.div>

          {/* Sound Button */}
          <button
            id="pronounce-main-btn"
            onClick={handlePronounce}
            className={`mt-2 pop-btn flex items-center gap-2 px-5 py-2.5 font-pop text-xs cursor-pointer ${
              speaking
                ? 'bg-[#FFC700] text-slate-950 scale-105'
                : 'bg-white hover:bg-amber-50 text-slate-900'
            }`}
            aria-label={`Hear sound of ${currentLetter.char}`}
          >
            <Volume2 className={`w-4 h-4 stroke-[2.5] ${speaking ? 'animate-bounce text-slate-950' : 'text-[#FF5400]'}`} />
            <span>LISTEN AUDIO</span>
          </button>
        </div>

        {/* English Pronunciation & Phonetic Guide */}
        <div className="mt-4 flex flex-col items-center text-center z-10">
          <div className="font-pop text-base sm:text-lg text-slate-900 tracking-wide">
            {currentLetter.char} — {currentLetter.name.toUpperCase()}
          </div>
          <div className="text-xs font-display font-semibold text-slate-600 mt-0.5">
            Phonetic: &ldquo;<span className="text-[#FF5400] font-black">{currentLetter.phonetic}</span>&rdquo;
          </div>

          {/* Example Word Sticker Pill */}
          <div className="mt-3 px-4 py-2 bg-[#FFF9E6] border-2.5 border-black rounded-xl text-xs font-display text-slate-900 flex items-center gap-2 shadow-[2px_2px_0px_#000]">
            <span className="font-pop text-[#FF5400]">EXAMPLE:</span>
            <span className="font-bold font-kannada text-base text-slate-950">{currentLetter.sampleWordKannada}</span>
            <span className="text-slate-600 font-semibold">({currentLetter.sampleWordEnglish} = {currentLetter.sampleWordMeaning})</span>
          </div>
        </div>
      </motion.div>

      {/* Pop Companion Guidance */}
      <div className="my-2">
        <ExplorerCharacter
          mood={
            isCorrect === true
              ? 'celebrating'
              : isCorrect === false
              ? 'encouraging'
              : 'happy'
          }
          speechText={
            isCorrect === true
              ? `Boom! You recognized the rune "${currentLetter.char}"! ⚡`
              : isCorrect === false
              ? 'Oops! Listen closely to the audio and tap the matching rune below!'
              : `Tap the matching rune for "${currentLetter.name}" below!`
          }
          subText={
            isCorrect === true
              ? '+10 XP gained! Keep charging ahead!'
              : isCorrect === false
              ? 'Look at the curved contours'
              : 'Select 1 of the 4 rune buttons'
          }
          size="sm"
        />
      </div>

      {/* 4 Chunky Pop Choice Buttons */}
      <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 mt-2">
        {options.map((opt, idx) => {
          const isSelected = selectedId === opt.id;
          const isTarget = opt.id === currentLetter.id;
          const isShaking = shakeId === opt.id;
          const isHinted = hintActive && isTarget;

          let btnClass = 'bg-white text-slate-900 hover:bg-amber-50';
          if (isSelected && isCorrect) {
            btnClass = 'bg-[#00D084] text-slate-950';
          } else if (isShaking) {
            btnClass = 'bg-[#FF453A] text-white';
          } else if (isHinted) {
            btnClass = 'bg-[#FFDE59] text-slate-950 animate-pulse';
          }

          return (
            <motion.button
              key={`${opt.id}-${idx}`}
              id={`choice-${opt.id}`}
              onClick={() => handleSelect(opt)}
              animate={
                isShaking
                  ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                  : isSelected && isCorrect
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ duration: 0.35 }}
              disabled={isCorrect === true}
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

      {/* Victory Notification & Next Quest */}
      <AnimatePresence>
        {isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-[#FFDE59] border-3 border-black rounded-2xl shadow-[4px_4px_0px_#111827]"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-pop text-xs text-slate-950">
                  +10 XP EARNED!
                </p>
                <p className="text-xs font-display font-bold text-slate-800">
                  Ready for the next rune challenge?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => onGoToTracing(currentLetter)}
                className="pop-btn px-3 py-2 bg-white hover:bg-slate-50 text-slate-900 font-pop text-xs cursor-pointer"
              >
                TRACE {currentLetter.char} ✍️
              </button>
              <button
                id="next-letter-btn"
                onClick={() => {
                  playTapSound(progress.soundEnabled);
                  onNextLetter();
                }}
                className="pop-btn px-4 py-2 bg-[#FF5400] hover:bg-[#FF4500] text-white font-pop text-xs flex items-center gap-1.5 cursor-pointer shadow-[2.5px_2.5px_0px_#000]"
              >
                <span>NEXT RUNE</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
