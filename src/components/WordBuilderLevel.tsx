import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordData, UserProgress } from '../types';
import { SIMPLE_WORDS } from '../data/kannadaData';
import { speakKannada, playTapSound, playSuccessSound } from '../utils/audio';
import { ExplorerCharacter } from './ExplorerCharacter';

interface WordBuilderLevelProps {
  progress: UserProgress;
  onWordBuilt: (wordId: string) => void;
}

export const WordBuilderLevel: React.FC<WordBuilderLevelProps> = ({
  progress,
  onWordBuilt,
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [assembled, setAssembled] = useState<boolean>(false);
  const [tappedLetter, setTappedLetter] = useState<string | null>(null);

  const currentWord = SIMPLE_WORDS[wordIndex % SIMPLE_WORDS.length];

  const handleTapLetter = (char: string) => {
    setTappedLetter(char);
    playTapSound(progress.soundEnabled);
    speakKannada(char, progress.soundEnabled);
    setTimeout(() => setTappedLetter(null), 700);
  };

  const handleAssembleWord = () => {
    setAssembled(true);
    playSuccessSound(progress.soundEnabled);
    speakKannada(currentWord.kannadaWord, progress.soundEnabled);
    onWordBuilt(currentWord.id);

    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF5400', '#FFC700', '#00D084', '#2563EB'],
      });
    } catch {
      // ignore
    }
  };

  const handleNextWord = () => {
    playTapSound(progress.soundEnabled);
    setAssembled(false);
    setWordIndex(prev => (prev + 1) % SIMPLE_WORDS.length);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 flex flex-col items-center">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-pop text-xs text-slate-950 bg-[#FFDE59] border-2.5 border-black px-3 py-1 rounded-full shadow-[2.5px_2.5px_0px_#000] rotate-[-1deg]">
            STAGE 6: RUNE FORGE
          </span>
          <span className="font-display font-extrabold text-slate-800 text-xs sm:text-sm">
            Word Crafting
          </span>
        </div>

        <button
          onClick={handleNextWord}
          className="pop-btn bg-white hover:bg-slate-50 text-slate-900 px-3 py-1 text-xs font-pop flex items-center gap-1.5 cursor-pointer"
          title="Next word recipe"
        >
          <span>NEXT RECIPE</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Pop Art Word Crafting Chamber Card */}
      <div className="w-full bg-white border-3.5 border-black rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_#111827] flex flex-col items-center my-2">
        <div className="font-pop text-xs text-[#FF5400] uppercase tracking-wider mb-1 text-center">
          ⚒️ STICKER COMBINATION FORGE
        </div>
        <div className="text-xs text-slate-500 font-display font-semibold mb-4 text-center">
          Tap ingredient runes to hear pronunciation, then combine into a complete word!
        </div>

        {/* Recipe Ingredient Slots */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-2">
          {currentWord.letters.map((letterChar, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="font-pop text-2xl text-slate-900 select-none">
                  +
                </span>
              )}
              <motion.button
                onClick={() => handleTapLetter(letterChar)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={`w-16 h-18 sm:w-20 sm:h-22 rounded-2xl border-3.5 border-black flex flex-col items-center justify-center cursor-pointer select-none transition-all ${
                  tappedLetter === letterChar
                    ? 'bg-[#FFDE59] scale-105 shadow-[2px_2px_0px_#000]'
                    : 'bg-[#FFF9E6] hover:bg-[#FFE500] shadow-[4px_4px_0px_#111827]'
                }`}
              >
                <span className="font-kannada font-bold text-3xl sm:text-4xl text-slate-950 leading-none">
                  {letterChar}
                </span>
                <span className="font-pop text-[8px] text-[#FF5400] uppercase mt-0.5">
                  RUNE #{i + 1}
                </span>
              </motion.button>
            </React.Fragment>
          ))}
        </div>

        {/* Assemble Button */}
        {!assembled ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAssembleWord}
            className="mt-5 pop-btn px-7 py-3 bg-[#FF5400] hover:bg-[#FF4500] text-white font-pop text-sm flex items-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
          >
            <Sparkles className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            <span>FORGE WORD &ldquo;{currentWord.englishMeaning.toUpperCase()}&rdquo;</span>
          </motion.button>
        ) : (
          /* Forged Word Outcome */
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full mt-5 p-5 bg-[#FFDE59] border-3.5 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col items-center text-slate-950"
          >
            <div className="text-3xl mb-1">{currentWord.hintEmoji}</div>
            <div className="font-kannada font-bold text-4xl sm:text-5xl text-slate-950 leading-none">
              {currentWord.kannadaWord}
            </div>
            <div className="font-pop text-base sm:text-lg text-slate-900 mt-1 uppercase">
              {currentWord.phonetic} = &ldquo;{currentWord.englishMeaning}&rdquo;
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => speakKannada(currentWord.kannadaWord, progress.soundEnabled)}
                className="pop-btn px-4 py-1.5 bg-white hover:bg-slate-50 text-slate-900 font-pop text-xs flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
                <span>PRONOUNCE</span>
              </button>

              <button
                onClick={handleNextWord}
                className="pop-btn px-4 py-1.5 bg-[#FF5400] hover:bg-[#FF4500] text-white font-pop text-xs flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                <span>NEXT WORD</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Companion Guidance */}
      <div className="my-2">
        <ExplorerCharacter
          mood={assembled ? 'celebrating' : 'happy'}
          speechText={
            assembled
              ? `Boom! You crafted "${currentWord.kannadaWord}" (${currentWord.englishMeaning})! +30 XP! ⚡`
              : `Tap the ingredient runes to listen, then combine them to forge "${currentWord.englishMeaning}"!`
          }
          subText={assembled ? 'Word Recipe Completed!' : `Recipe #${wordIndex + 1} of ${SIMPLE_WORDS.length}`}
          size="sm"
        />
      </div>
    </div>
  );
};
