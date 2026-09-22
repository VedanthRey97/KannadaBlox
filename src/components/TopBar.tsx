import React from 'react';
import { Volume2, VolumeX, ArrowLeft, Flame, Star } from 'lucide-react';
import { UserProgress } from '../types';
import { playTapSound } from '../utils/audio';
import { AppLogo } from './AppLogo';

interface TopBarProps {
  progress: UserProgress;
  onBack?: () => void;
  title?: string;
  showHearts?: boolean;
  onToggleSound: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  progress,
  onBack,
  title,
  showHearts = false,
  onToggleSound,
}) => {
  const currentLevel = Math.floor(progress.xp / 100) + 1;

  return (
    <header className="w-full bg-[#FFFDF9] border-b-3.5 border-black sticky top-0 z-30 px-3 sm:px-5 py-2.5 shadow-[0_4px_0px_#111827]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Back Button or Pop Logo Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onBack ? (
            <button
              id="back-btn"
              onClick={() => {
                playTapSound(progress.soundEnabled);
                onBack();
              }}
              className="pop-btn flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-50 text-slate-900 font-pop text-xs min-h-[38px] cursor-pointer"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>BACK</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <AppLogo size="sm" />
            </div>
          )}

          {title && (
            <span className="font-display font-extrabold text-xs sm:text-sm text-slate-700 bg-amber-100 border-2 border-black px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_#000] truncate max-w-[130px] sm:max-w-none">
              {title}
            </span>
          )}
        </div>

        {/* Center: Pop Cartoon Hearts */}
        {showHearts && (
          <div className="flex items-center gap-1.5 bg-white border-2.5 border-black rounded-full px-3 py-1 shadow-[2.5px_2.5px_0px_#000]">
            {[1, 2, 3].map(i => (
              <span
                key={i}
                className={`text-base transition-transform ${
                  i <= progress.hearts
                    ? 'opacity-100 scale-100'
                    : 'opacity-25 grayscale scale-90'
                }`}
                title={`Heart ${i}`}
              >
                ❤️
              </span>
            ))}
          </div>
        )}

        {/* Right: Sticker Badges & Audio Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Level & XP Sticker Pill */}
          <div
            className="flex items-center gap-1.5 bg-[#FFDE59] border-2.5 border-black px-2.5 py-1 text-slate-950 font-pop text-xs rounded-full shadow-[2.5px_2.5px_0px_#000]"
            title={`Level ${currentLevel} (${progress.xp} Total XP)`}
          >
            <span className="text-[#FF5400] font-black">LVL {currentLevel}</span>
            <span className="text-slate-400">|</span>
            <span className="font-black">{progress.xp} XP</span>
          </div>

          {/* Stars Sticker */}
          <div
            className="hidden xs:flex items-center gap-1 bg-white border-2.5 border-black px-2.5 py-1 text-slate-900 font-pop text-xs rounded-full shadow-[2px_2px_0px_#000]"
            title="Total Stars Earned"
          >
            <Star className="w-3.5 h-3.5 fill-[#FFC700] text-black stroke-[2]" />
            <span className="font-black">{progress.stars}</span>
          </div>

          {/* Coins Sticker */}
          <div
            className="flex items-center gap-1 bg-white border-2.5 border-black px-2.5 py-1 text-slate-900 font-pop text-xs rounded-full shadow-[2px_2px_0px_#000]"
            title="Quest Coins"
          >
            <span className="text-xs">🪙</span>
            <span className="font-black">{progress.coins}</span>
          </div>

          {/* Streak Sticker */}
          <div
            className="hidden sm:flex items-center gap-1 bg-[#FF5400] text-white border-2.5 border-black px-2.5 py-1 font-pop text-xs rounded-full shadow-[2px_2px_0px_#000]"
            title="Day Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            <span className="font-black">{progress.streak}d</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            id="sound-toggle-btn"
            onClick={() => {
              onToggleSound();
              playTapSound(!progress.soundEnabled);
            }}
            className="pop-btn p-2 bg-white hover:bg-amber-100 text-slate-900 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
            aria-label={progress.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            title={progress.soundEnabled ? 'Sound ON' : 'Sound OFF'}
          >
            {progress.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#00D084] stroke-[2.5]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
