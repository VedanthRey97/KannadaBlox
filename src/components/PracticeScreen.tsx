import React from 'react';
import { motion } from 'motion/react';
import { Target, Volume2, Edit3, ArrowRight } from 'lucide-react';
import { LetterData, UserProgress } from '../types';
import { speakKannada, playTapSound } from '../utils/audio';

interface PracticeScreenProps {
  weakLetters: LetterData[];
  unlockedLetters: LetterData[];
  progress: UserProgress;
  onSelectLetterForPractice: (letter: LetterData) => void;
  onStartTracing: (letter: LetterData) => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  weakLetters,
  unlockedLetters,
  progress,
  onSelectLetterForPractice,
  onStartTracing,
}) => {
  const lettersToShow = weakLetters.length > 0 ? weakLetters : unlockedLetters.slice(0, 6);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1.5 bg-[#FF5400] text-white border-2.5 border-black rounded-full px-3 py-1 font-pop text-xs shadow-[2.5px_2.5px_0px_#000] mb-1 rotate-[-1deg]">
          <Target className="w-3.5 h-3.5" />
          <span>TRAINING DOJO</span>
        </div>
        <h2 className="font-pop text-xl sm:text-2xl text-slate-950 mt-1">
          {weakLetters.length > 0 ? 'RUNES NEEDING PRACTICE' : 'RECENT RUNIC DRILLS'}
        </h2>
        <p className="font-display font-semibold text-xs sm:text-sm text-slate-600 mt-1">
          {weakLetters.length > 0
            ? 'Reinforce memory on runes you recently missed in challenges!'
            : 'Sharpen your precision and earn additional EXP!'}
        </p>
      </div>

      {/* Letters List Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
        {lettersToShow.map(letter => {
          const stats = progress.letterStats[letter.id];
          const wrongs = stats?.wrongCount || 0;
          const corrects = stats?.correctCount || 0;

          return (
            <motion.div
              key={letter.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white border-3.5 border-black rounded-2xl p-4 flex items-center justify-between gap-3 shadow-[4px_4px_0px_#111827]"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-[#FFF9E6] border-2.5 border-black rounded-xl flex items-center justify-center font-kannada font-bold text-3xl text-[#FF5400] shadow-[2px_2px_0px_#000]">
                  {letter.char}
                </div>
                <div>
                  <div className="font-pop text-sm text-slate-900">
                    {letter.char} — {letter.name.toUpperCase()}
                  </div>
                  <div className="font-display font-bold text-xs text-slate-600 mt-0.5">
                    {letter.sampleWordKannada} ({letter.sampleWordMeaning})
                  </div>
                  <div className="font-pop text-[10px] text-slate-500 mt-1">
                    HITS: <span className="text-emerald-600 font-black">{corrects}</span> | MISS: <span className="text-red-500 font-black">{wrongs}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    playTapSound(progress.soundEnabled);
                    speakKannada(letter.char, progress.soundEnabled);
                  }}
                  className="pop-btn p-2 bg-[#FFDE59] hover:bg-[#FFE500] text-slate-900 flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000]"
                  title="Hear Sound"
                >
                  <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => {
                    playTapSound(progress.soundEnabled);
                    onStartTracing(letter);
                  }}
                  className="pop-btn p-2 bg-[#FF5400] hover:bg-[#FF4500] text-white flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000]"
                  title="Trace Letter"
                >
                  <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Launch into Tracing */}
      {lettersToShow.length > 0 && (
        <button
          onClick={() => {
            playTapSound(progress.soundEnabled);
            onStartTracing(lettersToShow[0]);
          }}
          className="mt-4 pop-btn px-6 py-3 bg-[#FF5400] hover:bg-[#FF4500] text-white font-pop text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
        >
          <span>QUICK DRILL: TRACE &ldquo;{lettersToShow[0].char}&rdquo;</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      )}
    </div>
  );
};
