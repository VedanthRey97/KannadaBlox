import React from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen, Target, Sparkles, Trophy, ArrowRight, Compass, Shield } from 'lucide-react';
import { UserProgress, GameScreen } from '../types';
import { EXPLORER_RANKS, GROUP_INFO } from '../data/kannadaData';
import { ExplorerCharacter } from './ExplorerCharacter';
import { AppLogo } from './AppLogo';
import { playTapSound } from '../utils/audio';

interface HomeScreenProps {
  progress: UserProgress;
  onNavigate: (screen: GameScreen) => void;
  weakCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onNavigate,
  weakCount,
}) => {
  const currentRank = [...EXPLORER_RANKS].reverse().find(r => progress.xp >= r.minXp) || EXPLORER_RANKS[0];
  const nextRank = EXPLORER_RANKS.find(r => r.minXp > progress.xp);
  const currentLevel = Math.floor(progress.xp / 100) + 1;
  const xpInCurrentLevel = progress.xp % 100;
  const currentGroupMeta = GROUP_INFO[progress.unlockedGroup] || GROUP_INFO[1];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Pop Art Title Banner with New Official App Logo */}
      <div className="text-center mt-1 mb-2 flex flex-col items-center">
        <AppLogo size="hero" className="mb-2" />
        <p className="font-display font-bold text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Master the Kannada alphabet (ಅ to ಳ) with 3D Boss Raid car racing, mystery doors, and tactile tracing!
        </p>
      </div>

      {/* Pop Character Companion with Comic Speech Bubble */}
      <div className="my-2">
        <ExplorerCharacter
          mood="happy"
          size="hero"
          speechText="Welcome to KannadaBLOX! Ready to race through 3D Boss Raid or open Mystery Doors? 🏎️🚪"
          subText="Steer your kart or trace runes from ಅ all the way to ಳ!"
        />
      </div>

      {/* Collectible Sticker Album: Player Profile Card */}
      <div className="w-full bg-white border-3.5 border-black p-4 rounded-2xl shadow-[5px_5px_0px_#111827] mb-3 flex flex-col gap-2.5 relative overflow-hidden">
        {/* Subtle decorative pop sticker tape top-right */}
        <div className="absolute top-2 right-3 px-2 py-0.5 bg-[#FFDE59] border border-black text-[9px] font-pop uppercase rotate-3 shadow-[1px_1px_0px_#000]">
          PASSPORT
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FF5400] border-3 border-black rounded-xl flex items-center justify-center text-2xl shadow-[2.5px_2.5px_0px_#000] rotate-[-2deg]">
              {currentRank.badge}
            </div>
            <div>
              <div className="font-pop text-sm sm:text-base text-slate-900 leading-tight">
                {currentRank.title.toUpperCase()} · LVL {currentLevel}
              </div>
              <div className="text-xs text-slate-500 font-display font-semibold mt-0.5">
                World {progress.unlockedGroup}: <span className="text-[#FF5400] font-bold">{currentGroupMeta.title}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-pop text-base sm:text-lg text-emerald-600">
              {progress.xp} <span className="text-xs text-slate-500 font-display">XP</span>
            </div>
            <div className="text-[10px] text-slate-400 font-display font-bold">
              Next: {nextRank ? `${nextRank.minXp} XP` : 'MAX TIER'}
            </div>
          </div>
        </div>

        {/* Chunky Pop XP Progress Bar */}
        <div className="w-full bg-slate-100 h-5 border-2.5 border-black rounded-full relative overflow-hidden p-0.5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpInCurrentLevel}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#FFC700] via-[#FF5400] to-[#E5192D] rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center font-pop text-[10px] text-slate-900 font-black">
            LEVEL EXP: {xpInCurrentLevel} / 100
          </div>
        </div>
      </div>

      {/* Daily Quest Pop Sticker */}
      <div className="w-full bg-[#FFF9E6] border-3 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_#111827] mb-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFC700] border-2.5 border-black rounded-xl flex items-center justify-center text-xl shadow-[2px_2px_0px_#000]">
            🎯
          </div>
          <div>
            <div className="font-pop text-[10px] text-[#FF5400] uppercase tracking-wider">
              DAILY STICKER QUEST
            </div>
            <div className="font-display font-extrabold text-slate-900 text-xs sm:text-sm">
              {progress.completedDailyMission ? 'Quest Complete! Collected +50 XP! 🎉' : 'Find 5 Kannada runes in Rune Hunt!'}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold font-display">
              Bounty: +50 XP &amp; +1 ⭐
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            playTapSound(progress.soundEnabled);
            onNavigate('letter-hunt');
          }}
          className="pop-btn px-3.5 py-2 bg-[#FFC700] hover:bg-[#FFE500] text-slate-950 font-pop text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>HUNT</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* PRIMARY LEVEL MODES: TRACE GAME, DOORS GAME, & 3D BOSS RAID */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        {/* Trace Game Mode */}
        <motion.button
          id="trace-game-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playTapSound(progress.soundEnabled);
            onNavigate('tracing');
          }}
          className="p-3.5 bg-gradient-to-r from-[#FF5400] to-[#FF8A00] text-white border-3.5 border-black rounded-2xl shadow-[4px_4px_0px_#111827] text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 bg-black text-white font-pop text-[9px] rounded-full uppercase font-black">
                MODE 1 · TRACE
              </span>
              <span className="font-pop text-[10px] text-[#FFDE59]">
                ಅ ➔ ಳ
              </span>
            </div>
            <div className="font-pop text-base sm:text-lg text-white flex items-center gap-1.5">
              <span>✍️ TRACE GAME</span>
            </div>
            <div className="font-display font-semibold text-[11px] text-white/90 mt-1">
              Contour tracing from <strong className="font-kannada font-bold text-white">ಅ</strong> to <strong className="font-kannada font-bold text-white">ಳ</strong>!
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-pop font-bold pt-2 border-t border-white/30">
            <span>TRACE</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </motion.button>

        {/* Doors Game Mode */}
        <motion.button
          id="doors-game-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playTapSound(progress.soundEnabled);
            onNavigate('doors-game');
          }}
          className="p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-3.5 border-black rounded-2xl shadow-[4px_4px_0px_#111827] text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-pop text-[9px] rounded-full uppercase font-black">
                MODE 2 · DOORS
              </span>
              <span className="font-pop text-[10px] text-amber-300">
                BEST: {progress.doorsBestStreak || 0}/49
              </span>
            </div>
            <div className="font-pop text-base sm:text-lg text-white flex items-center gap-1.5">
              <span>🚪 DOORS GAME</span>
            </div>
            <div className="font-display font-semibold text-[11px] text-white/90 mt-1">
              Two mystery doors in sequence! Right door opens; wrong door resets to <strong className="font-kannada font-bold text-white">ಅ</strong>!
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-pop font-bold pt-2 border-t border-white/30">
            <span>DOORS</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </motion.button>

        {/* 3D Boss Raid Car Mode */}
        <motion.button
          id="boss-raid-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playTapSound(progress.soundEnabled);
            onNavigate('boss-raid');
          }}
          className="p-3.5 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white border-3.5 border-black rounded-2xl shadow-[4px_4px_0px_#111827] text-left flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 bg-white text-slate-950 font-pop text-[9px] rounded-full uppercase font-black">
                MODE 3 · 3D CAR
              </span>
              <span className="font-pop text-[10px] text-yellow-300">
                BEST: {progress.bossRaidBestStreak || 0}/49
              </span>
            </div>
            <div className="font-pop text-base sm:text-lg text-white flex items-center gap-1.5">
              <span>🏎️ BOSS RAID</span>
            </div>
            <div className="font-display font-semibold text-[11px] text-white/90 mt-1">
              3D Highway runner! Steer Left or Right road from <strong className="font-kannada font-bold text-white">ಅ</strong> to <strong className="font-kannada font-bold text-white">ಳ</strong>!
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-pop font-bold pt-2 border-t border-white/30">
            <span>RACE RAID</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </motion.button>
      </div>

      {/* Levels Roadmap Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => {
          playTapSound(progress.soundEnabled);
          onNavigate('level-select');
        }}
        className="w-full py-3 px-4 bg-white hover:bg-amber-50 text-slate-950 border-3 border-black rounded-2xl shadow-[4px_4px_0px_#111827] flex items-center justify-between mb-3 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🗺️</span>
          <div className="text-left">
            <div className="font-pop text-xs text-purple-700 uppercase">
              ALPHABET MAP
            </div>
            <div className="font-display font-extrabold text-xs sm:text-sm text-slate-900">
              View All 49 Levels (ಅ to ಳ)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 font-pop text-xs text-[#FF5400]">
          <span>LEVELS</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </div>
      </motion.button>

      {/* Secondary Action Grid: Training & Codex */}
      <div className="w-full grid grid-cols-2 gap-3 mb-4">
        {/* Practice / Training Grounds */}
        <button
          id="practice-btn"
          onClick={() => {
            playTapSound(progress.soundEnabled);
            onNavigate(weakCount > 0 ? 'practice-weak' : 'tracing');
          }}
          className="pop-btn p-3 bg-white hover:bg-slate-50 text-slate-900 flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-[#FF5400]">
            <Target className="w-4 h-4 stroke-[2.5]" />
            <span className="font-pop text-xs">TRAINING</span>
          </div>
          <span className="text-[11px] text-slate-500 font-display font-semibold">
            {weakCount > 0 ? `Review ${weakCount} Missed Runes` : 'Precision Rune Tracing'}
          </span>
        </button>

        {/* Alphabet Codex */}
        <button
          id="alphabet-book-btn"
          onClick={() => {
            playTapSound(progress.soundEnabled);
            onNavigate('alphabet-book');
          }}
          className="pop-btn p-3 bg-white hover:bg-slate-50 text-slate-900 flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-blue-600">
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span className="font-pop text-xs">ALPHABET CODEX</span>
          </div>
          <span className="text-[11px] text-slate-500 font-display font-semibold">
            All Vowels &amp; Consonants
          </span>
        </button>
      </div>

      {/* Quest Hub: Mini-Games Grid styled as Die-Cut Pop Stickers */}
      <div className="w-full mt-1">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="font-pop text-xs text-slate-500 uppercase tracking-wider">
            ⚡ MINI-GAME CHALLENGES
          </span>
          <span className="font-pop text-xs text-[#FF5400] bg-orange-100 border-2 border-black px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_#000]">
            WORLD {progress.unlockedGroup}/9
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Level 1: Discover */}
          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onNavigate('discover');
            }}
            className="pop-btn p-3 bg-white hover:bg-amber-50 text-left flex items-center gap-2.5 cursor-pointer"
          >
            <span className="text-2xl">👀</span>
            <div>
              <div className="font-pop text-xs text-slate-900">
                1. DISCOVER
              </div>
              <div className="text-[10px] text-slate-500 font-display font-bold">Hear sound (+10 XP)</div>
            </div>
          </button>

          {/* Level 2: Tracing */}
          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onNavigate('tracing');
            }}
            className="pop-btn p-3 bg-white hover:bg-emerald-50 text-left flex items-center gap-2.5 cursor-pointer"
          >
            <span className="text-2xl">✍️</span>
            <div>
              <div className="font-pop text-xs text-emerald-600">
                2. RUNE TRACE
              </div>
              <div className="text-[10px] text-slate-500 font-display font-bold">Gem trace (+20 XP)</div>
            </div>
          </button>

          {/* Level 3: Matching */}
          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onNavigate('matching');
            }}
            className="pop-btn p-3 bg-white hover:bg-purple-50 text-left flex items-center gap-2.5 cursor-pointer"
          >
            <span className="text-2xl">🧠</span>
            <div>
              <div className="font-pop text-xs text-purple-600">
                3. CARD MATCH
              </div>
              <div className="text-[10px] text-slate-500 font-display font-bold">Memory pairs (+20 XP)</div>
            </div>
          </button>

          {/* Level 4: Hunt */}
          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onNavigate('letter-hunt');
            }}
            className="pop-btn p-3 bg-white hover:bg-cyan-50 text-left flex items-center gap-2.5 cursor-pointer"
          >
            <span className="text-2xl">🌲</span>
            <div>
              <div className="font-pop text-xs text-cyan-600">
                4. RUNE HUNT
              </div>
              <div className="text-[10px] text-slate-500 font-display font-bold">Find runes (+20 XP)</div>
            </div>
          </button>

          {/* Level 5: Sound Radar */}
          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onNavigate('sound-quiz');
            }}
            className="pop-btn p-3 bg-white hover:bg-rose-50 text-left flex items-center gap-2.5 cursor-pointer"
          >
            <span className="text-2xl">🔊</span>
            <div>
              <div className="font-pop text-xs text-rose-600">
                5. SOUND RADAR
              </div>
              <div className="text-[10px] text-slate-500 font-display font-bold">Audio quiz (+20 XP)</div>
            </div>
          </button>

          {/* Level 6: Word Crafter */}
          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onNavigate('word-builder');
            }}
            className="pop-btn p-3 bg-white hover:bg-yellow-50 text-left flex items-center gap-2.5 cursor-pointer"
          >
            <span className="text-2xl">🔤</span>
            <div>
              <div className="font-pop text-xs text-yellow-600">
                6. WORD CRAFT
              </div>
              <div className="text-[10px] text-slate-500 font-display font-bold">Craft words (+30 XP)</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3D Boss Raid Highway Runner */}
      <div className="w-full mt-4">
        <button
          onClick={() => {
            playTapSound(progress.soundEnabled);
            onNavigate('boss-raid');
          }}
          className="w-full p-4 bg-gradient-to-r from-red-600 via-purple-700 to-indigo-800 text-white border-3.5 border-black rounded-2xl shadow-[5px_5px_0px_#111827] flex items-center justify-between hover:brightness-105 active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#111827] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-[2px_2px_0px_#000]">🏎️</span>
            <div className="text-left">
              <div className="font-pop text-sm sm:text-base text-white flex items-center gap-1.5">
                <span>BOSS RAID: 3D CAR ROAD RUNNER</span>
                <span className="px-2 py-0.5 bg-yellow-400 text-slate-950 text-[9px] rounded-full uppercase font-black">
                  ಅ ➔ ಳ
                </span>
              </div>
              <div className="font-display font-bold text-xs text-white/90 mt-0.5">
                Steer left or right road across all 49 letters in order with nitro boosts to win +250 XP!
              </div>
            </div>
          </div>
          <div className="px-3.5 py-1.5 bg-yellow-400 text-slate-950 border-2.5 border-black rounded-full font-pop text-xs font-black shadow-[2px_2px_0px_#000] rotate-[-2deg]">
            RACE NOW ⚡
          </div>
        </button>
      </div>
    </div>
  );
};
