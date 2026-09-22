import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Trophy, Star, Flame, Zap } from 'lucide-react';
import { UserProgress } from '../types';
import { playTapSound } from '../utils/audio';

interface SessionSummaryProps {
  progress: UserProgress;
  sessionXp: number;
  onContinue: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  progress,
  sessionXp,
  onContinue,
}) => {
  const masteredCount = Object.values(progress.letterStats).filter(s => s.mastery >= 3).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-white border-3.5 border-black rounded-3xl p-6 shadow-[8px_8px_0px_#111827] flex flex-col items-center text-center relative"
      >
        <div className="w-16 h-16 bg-[#FFDE59] border-3 border-black rounded-2xl flex items-center justify-center text-4xl mb-2 shadow-[2.5px_2.5px_0px_#000] rotate-[-2deg]">
          🏆
        </div>

        <h3 className="font-pop text-lg sm:text-xl text-slate-950">
          MISSION COMPLETE!
        </h3>
        <p className="font-display font-bold text-xs sm:text-sm text-slate-600 mt-1">
          Outstanding run today, Hero! Your Kannada knowledge grows stronger!
        </p>

        {/* Stats Grid with Pop Colors */}
        <div className="w-full grid grid-cols-2 gap-2.5 my-4">
          <div className="p-3 bg-[#FFF9E6] border-2.5 border-black rounded-xl flex flex-col items-center shadow-[2px_2px_0px_#000]">
            <span className="font-pop text-[10px] text-[#FF5400] uppercase">EXP EARNED</span>
            <span className="font-pop text-xl text-emerald-600 mt-0.5">+{sessionXp}</span>
          </div>

          <div className="p-3 bg-[#EBF5FF] border-2.5 border-black rounded-xl flex flex-col items-center shadow-[2px_2px_0px_#000]">
            <span className="font-pop text-[10px] text-blue-600 uppercase">MASTERED</span>
            <span className="font-pop text-xl text-blue-600 mt-0.5">{masteredCount}</span>
          </div>

          <div className="p-3 bg-[#FFF0EB] border-2.5 border-black rounded-xl flex flex-col items-center shadow-[2px_2px_0px_#000]">
            <span className="font-pop text-[10px] text-[#FF5400] uppercase">DAY STREAK</span>
            <span className="font-pop text-xl text-[#FF5400] mt-0.5">{progress.streak}D 🔥</span>
          </div>

          <div className="p-3 bg-[#FEF9C3] border-2.5 border-black rounded-xl flex flex-col items-center shadow-[2px_2px_0px_#000]">
            <span className="font-pop text-[10px] text-amber-600 uppercase">TOTAL STARS</span>
            <span className="font-pop text-xl text-amber-600 mt-0.5">{progress.stars} ⭐</span>
          </div>
        </div>

        <p className="font-display font-semibold text-xs text-slate-500 mb-4">
          Return tomorrow to continue your Kannada quest and unlock the next world!
        </p>

        <button
          onClick={() => {
            playTapSound(progress.soundEnabled);
            onContinue();
          }}
          className="w-full py-3 pop-btn bg-[#FF5400] hover:bg-[#FF4500] text-white font-pop text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000]"
        >
          <span>CONTINUE QUEST</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </motion.div>
    </div>
  );
};
