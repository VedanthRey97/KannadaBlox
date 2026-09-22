import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Lock, X, Edit3, Star } from 'lucide-react';
import { LetterData, UserProgress } from '../types';
import { KANNADA_LETTERS } from '../data/kannadaData';
import { speakKannada, playTapSound } from '../utils/audio';

interface AlphabetBookProps {
  progress: UserProgress;
  onTraceLetter: (letter: LetterData) => void;
  onClose: () => void;
}

export const AlphabetBook: React.FC<AlphabetBookProps> = ({
  progress,
  onTraceLetter,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'vowel' | 'consonant'>('all');
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);

  const filteredLetters = KANNADA_LETTERS.filter(letter => {
    if (filter === 'vowel') return letter.type === 'vowel' || letter.type === 'yogavaha';
    if (filter === 'consonant') return letter.type === 'consonant';
    return true;
  });

  const handleCardClick = (letter: LetterData, isLocked: boolean) => {
    playTapSound(progress.soundEnabled);
    if (isLocked) {
      return;
    }
    speakKannada(letter.char, progress.soundEnabled);
    setSelectedLetter(letter);
  };

  const getMasteryStars = (level: number) => {
    if (level === 4) return '⭐⭐⭐';
    if (level === 3) return '⭐⭐';
    if (level === 2) return '⭐';
    if (level === 1) return '🟢';
    return '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Title & Filter Tabs */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-pop text-xl sm:text-2xl text-slate-950 flex items-center gap-2">
            <span>📖 RUNIC STICKER CODEX</span>
          </h2>
          <p className="font-display font-semibold text-xs sm:text-sm text-slate-600 mt-0.5">
            Full album of all Kannada runes, phonetic guides, and mastery tiers
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 border-2.5 border-black rounded-full shadow-[2.5px_2.5px_0px_#000]">
          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              setFilter('all');
            }}
            className={`px-3 py-1 font-pop text-xs rounded-full transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#FF5400] text-white shadow-[1.5px_1.5px_0px_#000]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ALL RUNES
          </button>
          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              setFilter('vowel');
            }}
            className={`px-3 py-1 font-pop text-xs rounded-full transition-all cursor-pointer ${
              filter === 'vowel'
                ? 'bg-[#FF5400] text-white shadow-[1.5px_1.5px_0px_#000]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            VOWELS
          </button>
          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              setFilter('consonant');
            }}
            className={`px-3 py-1 font-pop text-xs rounded-full transition-all cursor-pointer ${
              filter === 'consonant'
                ? 'bg-[#FF5400] text-white shadow-[1.5px_1.5px_0px_#000]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CONSONANTS
          </button>
        </div>
      </div>

      {/* Grid of Rune Sticker Cards */}
      <div className="w-full grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 sm:gap-3">
        {filteredLetters.map(letter => {
          const isUnlocked = letter.groupIndex <= progress.unlockedGroup;
          const masteryLevel = progress.letterStats[letter.id]?.mastery || 0;

          return (
            <motion.button
              key={letter.id}
              onClick={() => handleCardClick(letter, !isUnlocked)}
              whileHover={{ scale: isUnlocked ? 1.06 : 1 }}
              whileTap={{ scale: isUnlocked ? 0.94 : 1 }}
              className={`h-22 sm:h-24 rounded-2xl border-3 border-black flex flex-col items-center justify-center p-1 relative select-none transition-all shadow-[3px_3px_0px_#111827] ${
                isUnlocked
                  ? 'bg-white hover:bg-amber-50 text-slate-950 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              {isUnlocked ? (
                <>
                  <span className="font-kannada font-bold text-3xl sm:text-4xl text-slate-950 leading-none">
                    {letter.char}
                  </span>
                  <span className="font-pop text-[9px] text-[#FF5400] mt-1 uppercase">
                    [{letter.name}]
                  </span>
                  {masteryLevel > 0 && (
                    <div className="absolute top-1 right-1 text-[9px] leading-none">
                      {getMasteryStars(masteryLevel)}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Lock className="w-5 h-5 text-slate-400 mb-0.5" />
                  <span className="font-pop text-[8px] text-slate-500 uppercase">
                    W{letter.groupIndex}
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Letter Popup Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 15 }}
              onClick={e => e.stopPropagation()}
              className="bg-white border-3.5 border-black rounded-3xl p-6 max-w-sm w-full shadow-[8px_8px_0px_#111827] flex flex-col items-center relative text-slate-900"
            >
              <button
                onClick={() => setSelectedLetter(null)}
                className="absolute top-3 right-3 pop-btn p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="w-24 h-24 bg-[#FFF9E6] border-3 border-black rounded-2xl flex items-center justify-center text-7xl font-kannada font-bold text-[#FF5400] shadow-[3px_3px_0px_#000] my-2">
                {selectedLetter.char}
              </div>

              <div className="text-center mt-2">
                <div className="font-pop text-lg text-slate-950">
                  {selectedLetter.char} — {selectedLetter.name.toUpperCase()}
                </div>
                <div className="text-xs font-display font-semibold text-slate-600 mt-0.5">
                  Phonetic: &ldquo;<strong className="text-[#FF5400]">{selectedLetter.phonetic}</strong>&rdquo;
                </div>
              </div>

              <div className="w-full mt-4 p-3 bg-[#FFF9E6] border-2 border-black rounded-xl text-xs font-display flex flex-col items-center gap-1 shadow-[2px_2px_0px_#000]">
                <div className="font-pop text-[10px] text-[#FF5400] uppercase">
                  VOCABULARY EXAMPLE
                </div>
                <div className="font-kannada font-bold text-xl text-slate-950">
                  {selectedLetter.sampleWordKannada}
                </div>
                <div className="text-slate-600 font-semibold">
                  {selectedLetter.sampleWordEnglish} = {selectedLetter.sampleWordMeaning}
                </div>
              </div>

              <div className="w-full flex items-center gap-2 mt-5">
                <button
                  onClick={() => speakKannada(selectedLetter.char, progress.soundEnabled)}
                  className="flex-1 pop-btn py-2.5 bg-[#FFDE59] hover:bg-[#FFE500] text-slate-950 font-pop text-xs flex items-center justify-center gap-1.5 shadow-[2.5px_2.5px_0px_#000]"
                >
                  <Volume2 className="w-4 h-4 stroke-[2.5]" />
                  <span>AUDIO</span>
                </button>

                <button
                  onClick={() => {
                    onTraceLetter(selectedLetter);
                    setSelectedLetter(null);
                  }}
                  className="flex-1 pop-btn py-2.5 bg-[#FF5400] hover:bg-[#FF4500] text-white font-pop text-xs flex items-center justify-center gap-1.5 shadow-[2.5px_2.5px_0px_#000]"
                >
                  <Edit3 className="w-4 h-4 stroke-[2.5]" />
                  <span>TRACE</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
