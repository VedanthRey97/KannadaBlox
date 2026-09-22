import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LetterData, UserProgress } from '../types';
import { speakKannada, playTapSound, playSuccessSound, playGentleWrongSound } from '../utils/audio';
import { ExplorerCharacter } from './ExplorerCharacter';

interface CardItem {
  id: string;
  letterId: string;
  char: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MatchingLevelProps {
  unlockedLetters: LetterData[];
  progress: UserProgress;
  onMatchComplete: () => void;
  onLetterMatched: (letterId: string) => void;
}

export const MatchingLevel: React.FC<MatchingLevelProps> = ({
  unlockedLetters,
  progress,
  onMatchComplete,
  onLetterMatched,
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const setupGame = () => {
    const pairCount = Math.min(4, Math.max(2, unlockedLetters.length));
    const chosenLetters = [...unlockedLetters]
      .sort(() => 0.5 - Math.random())
      .slice(0, pairCount);

    const cardList: CardItem[] = [];
    chosenLetters.forEach(letter => {
      cardList.push({
        id: `${letter.id}-1`,
        letterId: letter.id,
        char: letter.char,
        name: letter.name,
        isFlipped: false,
        isMatched: false,
      });
      cardList.push({
        id: `${letter.id}-2`,
        letterId: letter.id,
        char: letter.char,
        name: letter.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(cardList.sort(() => 0.5 - Math.random()));
    setFlippedIds([]);
    setMatchesCount(0);
    setIsGameOver(false);
    setIsChecking(false);
  };

  useEffect(() => {
    setupGame();
  }, [unlockedLetters]);

  const handleCardClick = (card: CardItem) => {
    if (isChecking || card.isFlipped || card.isMatched) return;

    playTapSound(progress.soundEnabled);
    speakKannada(card.char, progress.soundEnabled);

    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    setCards(prev =>
      prev.map(c => (c.id === card.id ? { ...c, isFlipped: true } : c))
    );

    if (nextFlipped.length === 2) {
      setIsChecking(true);
      const [firstId, secondId] = nextFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = card;

      if (firstCard && firstCard.letterId === secondCard.letterId) {
        setTimeout(() => {
          playSuccessSound(progress.soundEnabled);
          setCards(prev =>
            prev.map(c =>
              c.letterId === firstCard.letterId
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setFlippedIds([]);
          setIsChecking(false);
          onLetterMatched(firstCard.letterId);

          const newMatchTotal = matchesCount + 1;
          setMatchesCount(newMatchTotal);

          const totalPairs = cards.length / 2;
          if (newMatchTotal >= totalPairs) {
            setIsGameOver(true);
            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF5400', '#FFC700', '#00D084', '#2563EB'],
              });
            } catch {
              // ignore
            }
          }
        }, 550);
      } else {
        setTimeout(() => {
          playGentleWrongSound(progress.soundEnabled);
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
          setIsChecking(false);
        }, 900);
      }
    }
  };

  const totalPairs = Math.max(1, cards.length / 2);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 flex flex-col items-center">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-pop text-xs text-white bg-purple-600 border-2.5 border-black px-3 py-1 rounded-full shadow-[2.5px_2.5px_0px_#000] rotate-[-1deg]">
            STAGE 3: CARD MATCH
          </span>
          <span className="font-display font-extrabold text-slate-800 text-xs sm:text-sm">
            Pairs: <strong className="text-purple-600">{matchesCount}</strong> / {totalPairs}
          </span>
        </div>

        <button
          onClick={setupGame}
          className="pop-btn bg-white hover:bg-slate-50 text-slate-900 px-3 py-1 text-xs font-pop flex items-center gap-1.5 cursor-pointer"
          title="Shuffle Cards"
        >
          <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>SHUFFLE</span>
        </button>
      </div>

      {/* Progress Strip */}
      <div className="w-full bg-white border-3 border-black p-3 rounded-2xl shadow-[4px_4px_0px_#111827] flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 border-2 border-black rounded-lg flex items-center justify-center text-base shadow-[1.5px_1.5px_0px_#000]">
            🧠
          </div>
          <div>
            <div className="font-pop text-xs text-slate-900">
              MEMORY STICKER PACK
            </div>
            <div className="text-[11px] font-display font-semibold text-slate-500">
              Flip tiles to find matching twin Kannada runes
            </div>
          </div>
        </div>

        <div className="font-pop text-xs text-purple-600 bg-purple-50 border-2 border-black px-2.5 py-1 rounded-full shadow-[1.5px_1.5px_0px_#000]">
          {matchesCount === totalPairs ? 'ALL FOUND! 🎉' : `${totalPairs - matchesCount} PAIRS LEFT`}
        </div>
      </div>

      {/* Pop Card Grid */}
      <div className="w-full grid grid-cols-4 gap-2.5 sm:gap-3.5 my-1">
        {cards.map(card => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card)}
              whileHover={{ scale: card.isMatched ? 1 : 1.04 }}
              whileTap={{ scale: card.isMatched ? 1 : 0.96 }}
              className={`h-24 sm:h-28 rounded-2xl border-3.5 border-black transition-all flex flex-col items-center justify-center select-none cursor-pointer relative ${
                card.isMatched
                  ? 'bg-[#00D084] text-slate-950 shadow-[3px_3px_0px_#000]'
                  : isRevealed
                  ? 'bg-white text-slate-950 shadow-[4px_4px_0px_#111827]'
                  : 'bg-[#FFDE59] text-slate-950 shadow-[4px_4px_0px_#111827] hover:bg-[#FFE500]'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center">
                  <span className="font-kannada font-bold text-3xl sm:text-4xl text-slate-950 leading-none">
                    {card.char}
                  </span>
                  <span className="font-pop text-[9px] text-slate-600 uppercase mt-0.5">
                    [{card.name}]
                  </span>
                  {card.isMatched && (
                    <div className="absolute top-1 right-1 text-slate-950">
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
                    <span className="font-pop text-sm text-[#FF5400] font-black">⚡</span>
                  </div>
                  <span className="font-pop text-[9px] text-slate-900 mt-1 uppercase">
                    QUEST
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isGameOver && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full mt-3 p-4 bg-[#FFDE59] border-3.5 border-black rounded-2xl shadow-[5px_5px_0px_#111827] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-950"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <div className="font-pop text-sm sm:text-base">
                ALL PAIRS MATCHED! +20 XP
              </div>
              <div className="text-xs font-display font-bold text-slate-800">
                Incredible memory! Your rune knowledge is growing fast.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onMatchComplete();
            }}
            className="pop-btn px-4 py-2 bg-[#FF5400] hover:bg-[#FF4500] text-white font-pop text-xs cursor-pointer shadow-[3px_3px_0px_#000]"
          >
            CONTINUE QUEST ▶
          </button>
        </motion.div>
      )}

      {/* Companion Character Guidance */}
      <div className="my-2">
        <ExplorerCharacter
          mood={isGameOver ? 'celebrating' : matchesCount > 0 ? 'encouraging' : 'idle'}
          speechText={
            isGameOver
              ? 'Outstanding focus! You matched every twin rune pair! ⚡'
              : matchesCount > 0
              ? `Nice match! Find the remaining ${totalPairs - matchesCount} pairs!`
              : 'Tap any card to flip and discover the hidden Kannada runes!'
          }
          subText={isGameOver ? '+20 XP Earned!' : `Matches: ${matchesCount}/${totalPairs}`}
          size="sm"
        />
      </div>
    </div>
  );
};
