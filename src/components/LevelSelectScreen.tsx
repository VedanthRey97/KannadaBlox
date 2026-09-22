import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Trophy, ArrowRight, Flame, CheckCircle2, Lock, Volume2 } from 'lucide-react';
import { UserProgress, LetterData, GameScreen } from '../types';
import { KANNADA_LETTERS, GROUP_INFO } from '../data/kannadaData';
import { speakKannada, playTapSound } from '../utils/audio';
import { ExplorerCharacter } from './ExplorerCharacter';

interface LevelSelectScreenProps {
  progress: UserProgress;
  onSelectTraceLevel: (letter: LetterData, index: number) => void;
  onStartDoorsGame: () => void;
  onNavigate: (screen: GameScreen) => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  progress,
  onSelectTraceLevel,
  onStartDoorsGame,
  onNavigate,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const totalLetters = KANNADA_LETTERS.length; // 49
  const tracedCount = Object.values(progress.letterStats).filter(s => s.traced).length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col items-center select-none text-slate-900">
      {/* Title & Pop Badge */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 text-white border-2.5 border-black rounded-full font-pop text-xs uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#000] rotate-[-1deg]">
          <span>⚡ ALPHABET ROADMAP</span>
        </div>
        <h1 className="font-pop text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight filter drop-shadow-[2px_2px_0px_#FFDE59]">
          LEVEL PROGRESSION (ಅ TO ಳ)
        </h1>
        <p className="font-display font-semibold text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-0.5">
          Journey through all 49 Kannada letters in sequence. Trace each rune and challenge the high-stakes Mystery Doors!
        </p>
      </div>

      {/* Three Main Modes Cards: Trace Mode, Doors Game, & 3D Boss Raid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Trace Game Mode Card */}
        <div className="bg-white border-3.5 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_#111827] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 bg-[#FF5400] text-white font-pop text-[9px] rounded-full border border-black uppercase shadow-[1px_1px_0px_#000]">
                MODE 1
              </span>
              <span className="font-pop text-[11px] text-emerald-600 font-bold">
                {tracedCount}/{totalLetters} Traced
              </span>
            </div>
            <div className="font-pop text-base text-slate-950 flex items-center gap-1.5">
              <span>✍️ TRACE GAME</span>
            </div>
            <p className="font-display font-semibold text-[11px] text-slate-600 mt-1">
              Progress from <strong className="font-kannada font-bold text-slate-900">ಅ</strong> to <strong className="font-kannada font-bold text-slate-900">ಳ</strong> with clean contour tracing!
            </p>
          </div>

          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onNavigate('tracing');
            }}
            className="pop-btn w-full mt-2.5 py-2 bg-[#FF5400] hover:bg-[#FF4000] text-white font-pop text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <span>PLAY TRACE</span>
            <ArrowRight className="w-3 h-3 stroke-[3]" />
          </button>
        </div>

        {/* Doors Game Mode Card */}
        <div className="bg-gradient-to-br from-purple-100 via-[#FFF9E6] to-pink-50 border-3.5 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_#111827] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 bg-purple-600 text-white font-pop text-[9px] rounded-full border border-black uppercase shadow-[1px_1px_0px_#000]">
                MODE 2
              </span>
              <span className="font-pop text-[11px] text-purple-700 flex items-center gap-1 font-bold">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                Best: {progress.doorsBestStreak || 0}/49
              </span>
            </div>
            <div className="font-pop text-base text-slate-950 flex items-center gap-1.5">
              <span>🚪 DOORS GAME</span>
            </div>
            <p className="font-display font-semibold text-[11px] text-slate-700 mt-1">
              Pick between two doors in sequence! Right door pops audio; wrong door resets to <strong className="font-kannada font-bold text-slate-900">ಅ</strong>!
            </p>
          </div>

          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onStartDoorsGame();
            }}
            className="pop-btn w-full mt-2.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-pop text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <span>ENTER DOORS</span>
            <ArrowRight className="w-3 h-3 stroke-[3]" />
          </button>
        </div>

        {/* 3D Boss Raid Mode Card */}
        <div className="bg-gradient-to-br from-red-100 via-orange-50 to-amber-100 border-3.5 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_#111827] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 bg-red-600 text-white font-pop text-[9px] rounded-full border border-black uppercase shadow-[1px_1px_0px_#000]">
                MODE 3 · 3D CAR
              </span>
              <span className="font-pop text-[11px] text-orange-600 flex items-center gap-1 font-bold">
                <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                Best: {progress.bossRaidBestStreak || 0}/49
              </span>
            </div>
            <div className="font-pop text-base text-slate-950 flex items-center gap-1.5">
              <span>🏎️ BOSS RAID</span>
            </div>
            <p className="font-display font-semibold text-[11px] text-slate-700 mt-1">
              3D Highway runner! Steer left or right road from <strong className="font-kannada font-bold text-slate-900">ಅ</strong> to <strong className="font-kannada font-bold text-slate-900">ಳ</strong>!
            </p>
          </div>

          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onNavigate('boss-raid');
            }}
            className="pop-btn w-full mt-2.5 py-2 bg-red-600 hover:bg-red-700 text-white font-pop text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <span>START 3D RAID</span>
            <ArrowRight className="w-3 h-3 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* World / Letter Family Filter Tabs */}
      <div className="w-full mb-3">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="font-pop text-xs text-slate-600 uppercase tracking-wider">
            CHOOSE LEVEL GROUP (1 TO 9)
          </span>
          <span className="font-pop text-xs text-[#FF5400] font-bold">
            {GROUP_INFO[selectedGroup]?.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {Object.entries(GROUP_INFO).map(([grpStr, info]) => {
            const grpNum = parseInt(grpStr, 10);
            const isSelected = selectedGroup === grpNum;

            return (
              <button
                key={grpNum}
                onClick={() => {
                  playTapSound(progress.soundEnabled);
                  setSelectedGroup(grpNum);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border-2 font-pop text-xs select-none cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#FF5400] text-white border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-slate-800 border-black hover:bg-amber-50'
                }`}
              >
                G{grpNum}: {info.title.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Cards Grid for Selected Group */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        {KANNADA_LETTERS.map((letter, index) => {
          if (letter.groupIndex !== selectedGroup) return null;

          const stats = progress.letterStats[letter.id];
          const isTraced = stats?.traced;
          const isMastered = (stats?.mastery || 0) >= 3;

          return (
            <motion.div
              key={letter.id}
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-2xl border-3 border-black shadow-[3.5px_3.5px_0px_#111827] flex flex-col justify-between select-none ${
                isTraced ? 'bg-white' : 'bg-[#FFFDF8]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1">
                  <span className="font-pop text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 border border-black rounded-full">
                    LVL {index + 1}
                  </span>
                  {isTraced && (
                    <span className="font-pop text-[10px] text-[#00D084] flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakKannada(letter.char, progress.soundEnabled);
                  }}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-[#FFDE59] border border-black flex items-center justify-center cursor-pointer"
                  title="Hear Sound"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>

              {/* Large Kannada Character */}
              <div className="my-2 flex flex-col items-center">
                <span className="font-kannada font-bold text-4xl sm:text-5xl text-slate-950 leading-tight">
                  {letter.char}
                </span>
                <span className="font-pop text-xs text-slate-600 uppercase mt-0.5 font-bold">
                  {letter.name} · [{letter.phonetic}]
                </span>
              </div>

              {/* Trace Button */}
              <button
                onClick={() => {
                  playTapSound(progress.soundEnabled);
                  onSelectTraceLevel(letter, index);
                }}
                className={`pop-btn w-full py-1.5 text-xs font-pop flex items-center justify-center gap-1 cursor-pointer ${
                  isTraced
                    ? 'bg-[#00D084] text-slate-950'
                    : 'bg-[#FFDE59] hover:bg-[#FFE500] text-slate-950'
                }`}
              >
                <span>{isTraced ? 'RE-TRACE' : 'TRACE RUNE'}</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Explorer Companion Dialogue */}
      <div className="w-full my-2">
        <ExplorerCharacter
          mood="happy"
          size="sm"
          speechText="Ready to master all 49 runes? Start Tracing or challenge the high-stakes Mystery Doors!"
          subText={`Current Progress: ${tracedCount} of 49 runes forged`}
        />
      </div>
    </div>
  );
};
