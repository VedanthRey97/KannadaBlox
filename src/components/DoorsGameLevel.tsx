import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Volume2, RotateCcw, ArrowRight, Trophy, ShieldAlert, Sparkles, Flame, CheckCircle2, XCircle } from 'lucide-react';
import { LetterData, UserProgress } from '../types';
import { KANNADA_LETTERS } from '../data/kannadaData';
import { ExplorerCharacter } from './ExplorerCharacter';
import {
  speakKannada,
  playSuccessSound,
  playGentleWrongSound,
  playTapSound,
  playDoorOpenSound,
  playDoorBuzzerSound,
  playCelebrationFanfare
} from '../utils/audio';

interface DoorsGameLevelProps {
  progress: UserProgress;
  onCorrect: (letterId: string, levelNum: number) => void;
  onWrong: () => void;
  onExit: () => void;
}

type RoundStatus = 'choosing' | 'correct' | 'wrong' | 'victory';

export const DoorsGameLevel: React.FC<DoorsGameLevelProps> = ({
  progress,
  onCorrect,
  onWrong,
  onExit,
}) => {
  // Level progression strictly from ಅ (index 0) to ಳ (index 48)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [roundStatus, setRoundStatus] = useState<RoundStatus>('choosing');
  const [chosenDoor, setChosenDoor] = useState<0 | 1 | null>(null);
  const [correctDoorIndex, setCorrectDoorIndex] = useState<0 | 1>(0);
  const [distractorLetter, setDistractorLetter] = useState<LetterData>(KANNADA_LETTERS[1]);
  const [bestStreak, setBestStreak] = useState<number>(() => {
    return progress.doorsBestStreak || 0;
  });
  const [showConfettiEffect, setShowConfettiEffect] = useState<boolean>(false);

  const totalLetters = KANNADA_LETTERS.length; // 49
  const currentLetter = KANNADA_LETTERS[currentIndex] || KANNADA_LETTERS[0];
  const nextLetter = currentIndex + 1 < totalLetters ? KANNADA_LETTERS[currentIndex + 1] : null;

  // Initialize round
  const setupRound = useCallback((index: number) => {
    const target = KANNADA_LETTERS[index];
    
    // Choose distractor: either adjacent letter or random from alphabet
    const candidates: LetterData[] = [];
    if (index + 1 < KANNADA_LETTERS.length) candidates.push(KANNADA_LETTERS[index + 1]);
    if (index + 2 < KANNADA_LETTERS.length) candidates.push(KANNADA_LETTERS[index + 2]);
    if (index > 0) candidates.push(KANNADA_LETTERS[index - 1]);

    const remaining = KANNADA_LETTERS.filter(l => l.id !== target.id);
    const usePool = candidates.length > 0 && Math.random() < 0.7 ? candidates : remaining;
    const chosenDistractor = usePool[Math.floor(Math.random() * usePool.length)] || remaining[0];

    // Randomize door position (0 = Left Door, 1 = Right Door)
    const luckyDoor = Math.random() < 0.5 ? 0 : 1;

    setDistractorLetter(chosenDistractor);
    setCorrectDoorIndex(luckyDoor as 0 | 1);
    setChosenDoor(null);
    setRoundStatus('choosing');
    setShowConfettiEffect(false);
  }, []);

  useEffect(() => {
    setupRound(currentIndex);
  }, [currentIndex, setupRound]);

  // Handle door tap
  const handleSelectDoor = (doorIdx: 0 | 1) => {
    if (roundStatus !== 'choosing') return;

    setChosenDoor(doorIdx);
    playDoorOpenSound(progress.soundEnabled);

    const isCorrect = doorIdx === correctDoorIndex;

    if (isCorrect) {
      setRoundStatus('correct');
      setShowConfettiEffect(true);
      playSuccessSound(progress.soundEnabled);

      // Pronounce the alphabet in audio immediately upon opening right door
      speakKannada(currentLetter.char, progress.soundEnabled);

      // Pop confetti
      try {
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFC700', '#FF5400', '#00D084', '#3B82F6', '#EC4899'],
        });
      } catch {
        // ignore
      }

      const nextLevelNum = currentIndex + 1;
      const newStreak = nextLevelNum;
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      onCorrect(currentLetter.id, nextLevelNum);

      // Check for ultimate victory (completed ಳ)
      if (currentIndex === totalLetters - 1) {
        setRoundStatus('victory');
        playCelebrationFanfare(progress.soundEnabled);
      }
    } else {
      // WRONG DOOR: Starts from ಅ all over again!
      setRoundStatus('wrong');
      playDoorBuzzerSound(progress.soundEnabled);
      playGentleWrongSound(progress.soundEnabled);
      onWrong();
    }
  };

  // Advance to next letter in sequence
  const handleProceedNext = () => {
    playTapSound(progress.soundEnabled);
    if (currentIndex + 1 < totalLetters) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Reset all the way back to ಅ (Level 1)
  const handleRestartFromStart = () => {
    playTapSound(progress.soundEnabled);
    setCurrentIndex(0);
    setupRound(0);
  };

  // Pronounce target
  const handleHearTarget = () => {
    playTapSound(progress.soundEnabled);
    speakKannada(currentLetter.char, progress.soundEnabled);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-3 flex flex-col items-center select-none text-slate-900">
      {/* Top Header & Streak Banner */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-pop text-xs text-white bg-purple-600 border-2.5 border-black px-3 py-1 rounded-full shadow-[2.5px_2.5px_0px_#000] rotate-[-1deg]">
            DOORS CHALLENGE 🚪
          </span>
          <span className="font-display font-extrabold text-xs sm:text-sm text-slate-700">
            Sequence: <strong className="text-purple-600 font-bold">ಅ</strong> ➔ <strong className="text-purple-600 font-bold">ಳ</strong>
          </span>
        </div>

        {/* Best Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF9E6] border-2 border-black rounded-full text-xs font-pop text-amber-700 shadow-[1.5px_1.5px_0px_#000]">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>BEST: {bestStreak}/49</span>
        </div>
      </div>

      {/* Target Mission Card */}
      <div className="w-full bg-white border-3.5 border-black p-4 rounded-2xl shadow-[5px_5px_0px_#111827] mb-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-[#FFF9E6] border-3 border-black rounded-2xl flex items-center justify-center font-kannada font-bold text-4xl text-[#FF5400] shadow-[3px_3px_0px_#000]">
              {currentLetter.char}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pop text-xs text-purple-700 font-bold uppercase">
                  LEVEL {currentIndex + 1} OF {totalLetters}
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-black px-1.5 py-0.5 rounded font-pop">
                  {currentLetter.type.toUpperCase()}
                </span>
              </div>
              <div className="font-pop text-lg text-slate-950 leading-tight mt-0.5">
                FIND DOOR WITH: &ldquo;{currentLetter.char}&rdquo; [{currentLetter.name}]
              </div>
              <div className="text-xs text-slate-500 font-display font-semibold">
                Phonetic sound: &ldquo;<strong className="text-[#FF5400]">{currentLetter.phonetic}</strong>&rdquo;
              </div>
            </div>
          </div>

          {/* Audio Speaker Button */}
          <button
            onClick={handleHearTarget}
            className="pop-btn px-4 py-2 bg-[#FFDE59] hover:bg-[#FFE500] text-slate-950 font-pop text-xs flex items-center gap-1.5 cursor-pointer shadow-[2.5px_2.5px_0px_#000] whitespace-nowrap"
            title="Hear Target Letter"
          >
            <Volume2 className="w-4 h-4 stroke-[2.5] text-slate-900" />
            <span>HEAR RUNE</span>
          </button>
        </div>

        {/* Sequence Progress Bar from 1 to 49 */}
        <div className="w-full mt-3 pt-2.5 border-t-2 border-dashed border-slate-200">
          <div className="flex items-center justify-between text-[10px] font-pop text-slate-500 mb-1">
            <span>START: ಅ (1)</span>
            <span className="text-purple-600 font-bold">CURRENT: {currentLetter.char} ({currentIndex + 1})</span>
            <span>GOAL: ಳ (49)</span>
          </div>
          <div className="w-full bg-slate-100 h-3 border-2 border-black rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-[#00D084] rounded-full"
              style={{ width: `${Math.round(((currentIndex + 1) / totalLetters) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Game Stage: Two Visible Alphabet Doors (Not Mystery!) */}
      <div className="w-full my-3">
        <div className="text-center mb-2">
          <span className="font-pop text-xs text-slate-700 uppercase tracking-wider font-bold">
            CHOOSE THE DOOR WITH THE NEXT LETTER IN ORDER:
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
          {[0, 1].map(doorIdx => {
            const isLeft = doorIdx === 0;
            const isTargetDoor = doorIdx === correctDoorIndex;
            const doorLetter = isTargetDoor ? currentLetter : distractorLetter;
            const isSelected = chosenDoor === doorIdx;
            const isOpen = isSelected;
            const isWrongDoor = isSelected && !isTargetDoor;

            return (
              <div key={doorIdx} className="flex flex-col items-center">
                <span className="font-pop text-xs text-purple-700 uppercase mb-1.5 tracking-wider font-extrabold">
                  {isLeft ? 'DOOR 1' : 'DOOR 2'}
                </span>

                {/* 3D Door Portal Container */}
                <motion.div
                  animate={
                    isWrongDoor
                      ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                      : {}
                  }
                  transition={{ duration: 0.45 }}
                  onClick={() => handleSelectDoor(doorIdx as 0 | 1)}
                  className={`w-38 sm:w-48 h-64 sm:h-74 relative rounded-3xl border-4 border-black shadow-[6px_6px_0px_#111827] overflow-hidden cursor-pointer select-none transition-all ${
                    roundStatus === 'choosing'
                      ? 'hover:scale-103 hover:shadow-[8px_8px_0px_#111827] active:scale-97'
                      : ''
                  }`}
                  style={{ perspective: 900 }}
                >
                  {/* INSIDE CHAMBER (Revealed when correct door swings open) */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center p-3 text-center transition-colors ${
                      isOpen && isTargetDoor
                        ? 'bg-gradient-to-b from-amber-100 via-amber-200 to-[#00D084]'
                        : isOpen && !isTargetDoor
                        ? 'bg-gradient-to-b from-red-100 via-red-200 to-red-400'
                        : 'bg-slate-900'
                    }`}
                  >
                    {isOpen && (
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="flex flex-col items-center justify-center"
                      >
                        {isTargetDoor ? (
                          <>
                            <div className="w-12 h-12 rounded-full bg-white border-2.5 border-black flex items-center justify-center shadow-[2.5px_2.5px_0px_#000] mb-1">
                              <CheckCircle2 className="w-7 h-7 text-[#00D084] stroke-[3]" />
                            </div>
                            <span className="font-kannada font-bold text-5xl sm:text-6xl text-slate-950 filter drop-shadow-[2px_2px_0px_#FFC700] leading-none">
                              {doorLetter.char}
                            </span>
                            <span className="font-pop text-xs text-slate-900 mt-1 uppercase font-black">
                              [{doorLetter.name}]
                            </span>
                            <span className="mt-1.5 px-3 py-0.5 bg-white text-slate-900 border-2 border-black rounded-full font-pop text-[10px] shadow-[1.5px_1.5px_0px_#000]">
                              CORRECT! 🎉
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-white border-2.5 border-black flex items-center justify-center shadow-[2.5px_2.5px_0px_#000] mb-1">
                              <XCircle className="w-7 h-7 text-[#FF453A] stroke-[3]" />
                            </div>
                            <span className="font-kannada font-bold text-4xl sm:text-5xl text-red-950 leading-none">
                              {doorLetter.char}
                            </span>
                            <span className="font-pop text-[10px] text-red-900 mt-0.5 uppercase">
                              [{doorLetter.name}]
                            </span>
                            <span className="mt-1.5 px-2.5 py-0.5 bg-[#FF453A] text-white border-2 border-black rounded-full font-pop text-[10px] shadow-[1.5px_1.5px_0px_#000]">
                              WRONG DOOR! 💥
                            </span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* FRONT WOODEN POP DOOR (Prominently displays the alphabet!) */}
                  <motion.div
                    animate={
                      isOpen && isTargetDoor
                        ? {
                            rotateY: isLeft ? -115 : 115,
                            opacity: 0.15,
                          }
                        : isWrongDoor
                        ? {
                            rotateY: 0,
                            backgroundColor: '#FCA5A5',
                          }
                        : {
                            rotateY: 0,
                            opacity: 1,
                            backgroundColor: isLeft ? '#E28B38' : '#D97706',
                          }
                    }
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    style={{
                      transformOrigin: isLeft ? 'left center' : 'right center',
                      transformStyle: 'preserve-3d',
                    }}
                    className="absolute inset-0 border-r-3 border-l-3 border-amber-950 flex flex-col items-center justify-between p-3.5 z-10 shadow-inner"
                  >
                    {/* Top Door Arch & Rivets */}
                    <div className="w-full flex items-center justify-between">
                      <div className="w-3 h-3 rounded-full bg-[#52290A] border border-black shadow-inner" />
                      <div className="px-2.5 py-0.5 bg-[#FFF9E6] border-2 border-black rounded-full font-pop text-[9px] text-slate-900 font-extrabold uppercase shadow-[1px_1px_0px_#000]">
                        {isLeft ? 'DOOR 1' : 'DOOR 2'}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakKannada(doorLetter.char, progress.soundEnabled);
                        }}
                        className="w-6 h-6 rounded-full bg-white hover:bg-[#FFDE59] border-1.5 border-black flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                        title={`Hear ${doorLetter.char} sound`}
                      >
                        <Volume2 className="w-3 h-3 text-slate-900" />
                      </button>
                    </div>

                    {/* Central Display: Prominent Kannada Alphabet */}
                    <div className="flex flex-col items-center w-full px-1">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-3.5 border-black flex flex-col items-center justify-center shadow-[3.5px_3.5px_0px_#000] rotate-[-1deg] transition-transform hover:scale-105">
                        <span className="font-kannada font-bold text-4xl sm:text-5xl text-slate-950 leading-none">
                          {doorLetter.char}
                        </span>
                        <span className="font-pop text-[9px] text-purple-700 font-black uppercase mt-0.5">
                          [{doorLetter.name}]
                        </span>
                      </div>

                      <div className="mt-2 text-[10px] font-pop text-white font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full border border-black/50 shadow-sm">
                        SELECT DOOR
                      </div>
                    </div>

                    {/* Vintage Brass Door Knocker / Handle */}
                    <div className="w-full flex items-center justify-between px-1">
                      <div className="w-3 h-3 rounded-full bg-[#52290A] border border-black shadow-inner" />
                      <div className="w-8 h-8 rounded-full border-2.5 border-black bg-[#FFC700] flex items-center justify-center shadow-[2px_2px_0px_#000]">
                        <div className="w-2.5 h-3.5 border-2 border-black rounded-b-md bg-[#FFA800]" />
                      </div>
                      <div className="w-3 h-3 rounded-full bg-[#52290A] border border-black shadow-inner" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outcome Cards (Correct vs Wrong) */}
      <AnimatePresence>
        {roundStatus === 'correct' && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="w-full mt-3 p-4 bg-[#00D084] border-3.5 border-black rounded-2xl shadow-[5px_5px_0px_#111827] text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 bg-white border-2.5 border-black rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                🎉
              </div>
              <div>
                <div className="font-pop text-base sm:text-lg text-slate-950 leading-tight">
                  DOOR UNLOCKED! &ldquo;{currentLetter.char}&rdquo; FOUND!
                </div>
                <div className="text-xs font-display font-bold text-slate-900 mt-0.5">
                  Audio pronounced &amp; confetti popped! +15 XP earned!
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedNext}
              className="pop-btn px-6 py-3 bg-white hover:bg-slate-50 text-slate-950 font-pop text-sm flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000] rotate-[-1deg]"
            >
              <span>{nextLetter ? `NEXT DOOR: ${nextLetter.char} (${currentIndex + 2})` : 'COMPLETE!'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>
        )}

        {roundStatus === 'wrong' && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="w-full mt-3 p-4 bg-[#FF453A] border-3.5 border-black rounded-2xl shadow-[5px_5px_0px_#111827] text-white flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 bg-white border-2.5 border-black rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000] text-slate-950">
                💥
              </div>
              <div>
                <div className="font-pop text-base sm:text-lg text-white leading-tight">
                  TRAP TRIGGERED! START OVER FROM &ldquo;ಅ&rdquo;!
                </div>
                <div className="text-xs font-display font-semibold text-white/95 mt-0.5">
                  You reached Level {currentIndex + 1} ({currentLetter.char}). In Doors Challenge, wrong door restarts from ಅ!
                </div>
              </div>
            </div>

            <button
              onClick={handleRestartFromStart}
              className="pop-btn px-6 py-3 bg-[#FFDE59] hover:bg-[#FFE500] text-slate-950 font-pop text-sm flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000]"
            >
              <RotateCcw className="w-4 h-4 stroke-[3]" />
              <span>RESTART FROM ಅ</span>
            </button>
          </motion.div>
        )}

        {roundStatus === 'victory' && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full mt-3 p-5 bg-[#FFDE59] border-4 border-black rounded-2xl shadow-[6px_6px_0px_#111827] text-slate-950 flex flex-col items-center text-center gap-3"
          >
            <div className="text-5xl">👑</div>
            <div className="font-pop text-2xl sm:text-3xl text-slate-950">
              YOU REACHED THE END DOOR &amp; WON!
            </div>
            <p className="font-display font-bold text-sm text-slate-800 max-w-md">
              Magnificent! You opened every correct door in order across the entire Kannada alphabet from <strong className="font-kannada font-bold text-lg">ಅ</strong> to <strong className="font-kannada font-bold text-lg">ಳ</strong> and conquered the ultimate end door!
            </p>
            <div className="flex gap-3 mt-1">
              <button
                onClick={handleRestartFromStart}
                className="pop-btn px-5 py-2.5 bg-white text-slate-900 font-pop text-xs cursor-pointer"
              >
                PLAY AGAIN FROM ಅ
              </button>
              <button
                onClick={onExit}
                className="pop-btn px-5 py-2.5 bg-[#FF5400] text-white font-pop text-xs cursor-pointer"
              >
                RETURN HOME
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explorer Companion Dialogue */}
      <div className="my-2">
        <ExplorerCharacter
          mood={
            roundStatus === 'correct'
              ? 'celebrating'
              : roundStatus === 'wrong'
              ? 'encouraging'
              : roundStatus === 'victory'
              ? 'super-excited'
              : 'thinking'
          }
          speechText={
            roundStatus === 'correct'
              ? `Woohoo! You opened the right door for "${currentLetter.char}"! Keep going to "ಳ"! ⚡`
              : roundStatus === 'wrong'
              ? `Yikes! A trap door! Starting back at Level 1 (ಅ). You can do this!`
              : roundStatus === 'victory'
              ? `LEGENDARY! You completed the entire alphabet sequence to "ಳ"! 👑`
              : `One door holds "${currentLetter.char}", one is a trap! Which door do you choose?`
          }
          subText={
            roundStatus === 'correct'
              ? '+15 XP gained! Tap Next Door to proceed!'
              : roundStatus === 'wrong'
              ? 'Tap Restart from ಅ to try again!'
              : `Level ${currentIndex + 1} of 49 | Target: ${currentLetter.char}`
          }
          size="sm"
        />
      </div>

      {/* Quick Letter Matrix Drawer / Strip */}
      <div className="w-full mt-2 p-3 bg-white border-3 border-black rounded-2xl shadow-[3px_3px_0px_#111827]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-pop text-[10px] text-slate-500 uppercase tracking-wider">
            ALPHABET TRAIL (ಅ TO ಳ)
          </span>
          <span className="font-pop text-[10px] text-purple-700">
            {currentIndex + 1} / {totalLetters} COMPLETE
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {KANNADA_LETTERS.map((l, i) => {
            const isDone = i < currentIndex;
            const isCurrent = i === currentIndex;

            return (
              <div
                key={l.id}
                className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-kannada font-bold select-none ${
                  isCurrent
                    ? 'bg-purple-600 text-white border-black scale-110 shadow-[2px_2px_0px_#000]'
                    : isDone
                    ? 'bg-[#00D084] text-slate-950 border-black'
                    : 'bg-slate-100 text-slate-400 border-slate-300'
                }`}
              >
                {l.char}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
