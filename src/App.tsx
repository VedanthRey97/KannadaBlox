/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { GameScreen, LetterData, UserProgress } from './types';
import { KANNADA_LETTERS, GROUP_INFO } from './data/kannadaData';
import {
  loadProgress,
  saveProgress,
  updateLetterProgress,
  getUnlockedLetters,
  getWeakLetters,
} from './utils/storage';
import { TopBar } from './components/TopBar';
import { HomeScreen } from './components/HomeScreen';
import { LevelSelectScreen } from './components/LevelSelectScreen';
import { DoorsGameLevel } from './components/DoorsGameLevel';
import { BossRaid3D } from './components/BossRaid3D';
import { DiscoverLevel } from './components/DiscoverLevel';
import { TracingLevel } from './components/TracingLevel';
import { MatchingLevel } from './components/MatchingLevel';
import { LetterHuntLevel } from './components/LetterHuntLevel';
import { SoundQuizLevel } from './components/SoundQuizLevel';
import { WordBuilderLevel } from './components/WordBuilderLevel';
import { BossBattle } from './components/BossBattle';
import { AlphabetBook } from './components/AlphabetBook';
import { PracticeScreen } from './components/PracticeScreen';
import { SessionSummary } from './components/SessionSummary';
import { playSuccessSound, playGentleWrongSound, playCoinSound } from './utils/audio';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
  const [currentTraceIndex, setCurrentTraceIndex] = useState<number>(() => progress.traceLevel || 0);
  const [sessionXp, setSessionXp] = useState<number>(0);
  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Unlocked letters based on group
  const unlockedLetters = useMemo(() => {
    return getUnlockedLetters(progress);
  }, [progress.unlockedGroup]);

  // Weak letters for personalized practice
  const weakLetters = useMemo(() => {
    return getWeakLetters(progress);
  }, [progress.letterStats, progress.unlockedGroup]);

  // Current active letter (defaults to first vowel 'ಅ' or index within unlocked)
  const currentLetter = unlockedLetters[currentLetterIndex % Math.max(1, unlockedLetters.length)] || KANNADA_LETTERS[0];

  // XP & Stats Adders
  const addXpAndCoins = (xpGain: number, coinGain: number = 2, starGain: number = 0) => {
    setSessionXp(prev => prev + xpGain);
    setProgress(prev => {
      const nextXp = prev.xp + xpGain;
      const nextCoins = prev.coins + coinGain;
      const nextStars = prev.stars + starGain;

      // Update daily mission
      let newDailyProgress = prev.dailyMissionProgress + 1;
      let missionComplete = prev.completedDailyMission;
      let bonusXp = 0;
      let bonusStars = 0;

      if (!missionComplete && newDailyProgress >= prev.dailyMissionTarget) {
        missionComplete = true;
        bonusXp = 50;
        bonusStars = 1;
      }

      return {
        ...prev,
        xp: nextXp + bonusXp,
        coins: nextCoins,
        stars: nextStars + bonusStars,
        dailyMissionProgress: newDailyProgress,
        completedDailyMission: missionComplete,
      };
    });
  };

  // Sound toggle
  const handleToggleSound = () => {
    setProgress(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  // Navigation
  const handleNavigate = (screen: GameScreen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Discover Letter completion
  const handleLetterLearned = (letterId: string, result: 'correct' | 'wrong') => {
    if (result === 'correct') {
      addXpAndCoins(10, 2);
      setProgress(prev => updateLetterProgress(prev, letterId, 'correct'));
    } else {
      setProgress(prev => updateLetterProgress(prev, letterId, 'wrong'));
    }
  };

  const handleNextLetter = () => {
    setCurrentLetterIndex(prev => (prev + 1) % unlockedLetters.length);
  };

  // Tracing completion
  const handleTraceCompleted = (letterId: string) => {
    addXpAndCoins(20, 3, 1);
    setProgress(prev => updateLetterProgress(prev, letterId, 'traced'));
  };

  // Matching completion
  const handleMatchCompleted = () => {
    addXpAndCoins(20, 4, 1);
  };

  const handleLetterMatched = (letterId: string) => {
    setProgress(prev => updateLetterProgress(prev, letterId, 'correct'));
  };

  // Letter hunt found
  const handleLetterHuntFound = (letterId: string) => {
    addXpAndCoins(20, 3);
    setProgress(prev => updateLetterProgress(prev, letterId, 'correct'));
  };

  // Sound quiz
  const handleSoundQuizCorrect = (letterId: string) => {
    addXpAndCoins(20, 2);
    setProgress(prev => updateLetterProgress(prev, letterId, 'correct'));
  };

  const handleSoundQuizWrong = (letterId: string) => {
    setProgress(prev => {
      const nextHearts = Math.max(0, prev.hearts - 1);
      const updated = updateLetterProgress(prev, letterId, 'wrong');
      // If hearts depleted, take to gentle practice
      if (nextHearts === 0) {
        setTimeout(() => {
          setCurrentScreen('practice-weak');
        }, 1000);
      }
      return {
        ...updated,
        hearts: nextHearts === 0 ? 3 : nextHearts,
      };
    });
  };

  // Word builder
  const handleWordBuilt = (wordId: string) => {
    addXpAndCoins(30, 5, 1);
  };

  // Dragon Boss Victory
  const handleBossVictory = () => {
    addXpAndCoins(100, 15, 3);
    setProgress(prev => ({
      ...prev,
      unlockedBadges: Array.from(new Set([...prev.unlockedBadges, 'dragon_slayer'])),
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans select-none text-slate-900">
      {/* Top Header Bar */}
      <TopBar
        progress={progress}
        onBack={currentScreen !== 'home' ? () => handleNavigate('home') : undefined}
        title={
          currentScreen === 'boss-raid'
            ? '3D Boss Raid (ಅ to ಳ)'
            : currentScreen === 'doors-game'
            ? 'Doors Challenge (ಅ to ಳ)'
            : currentScreen === 'level-select'
            ? 'Alphabet Levels'
            : currentScreen === 'discover'
            ? 'Discover Rune'
            : currentScreen === 'tracing'
            ? 'Trace Game (ಅ to ಳ)'
            : currentScreen === 'matching'
            ? 'Card Match'
            : currentScreen === 'letter-hunt'
            ? 'Rune Hunt'
            : currentScreen === 'sound-quiz'
            ? 'Sound Radar'
            : currentScreen === 'word-builder'
            ? 'Word Craft'
            : currentScreen === 'boss-battle'
            ? 'Dragon Raid'
            : currentScreen === 'alphabet-book'
            ? 'Rune Codex'
            : currentScreen === 'practice-weak'
            ? 'Training Dojo'
            : undefined
        }
        showHearts={currentScreen === 'sound-quiz' || currentScreen === 'boss-battle'}
        onToggleSound={handleToggleSound}
      />

      {/* Main Screen Content */}
      <main className="flex-1 flex flex-col justify-start py-2 pb-16">
        {currentScreen === 'home' && (
          <HomeScreen
            progress={progress}
            onNavigate={handleNavigate}
            weakCount={weakLetters.length}
          />
        )}

        {currentScreen === 'level-select' && (
          <LevelSelectScreen
            progress={progress}
            onSelectTraceLevel={(letter, idx) => {
              setCurrentTraceIndex(idx);
              handleNavigate('tracing');
            }}
            onStartDoorsGame={() => handleNavigate('doors-game')}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'doors-game' && (
          <DoorsGameLevel
            progress={progress}
            onCorrect={(letterId, levelNum) => {
              addXpAndCoins(15, 2);
              setProgress(prev => {
                const updated = updateLetterProgress(prev, letterId, 'correct');
                const nextBest = Math.max(prev.doorsBestStreak || 0, levelNum);
                return { ...updated, doorsBestStreak: nextBest };
              });
            }}
            onWrong={() => {
              setProgress(prev => ({ ...prev }));
            }}
            onExit={() => handleNavigate('home')}
          />
        )}

        {currentScreen === 'boss-raid' && (
          <BossRaid3D
            progress={progress}
            onVictory={(xpGain) => {
              addXpAndCoins(xpGain, 25, 3);
            }}
            onExit={() => handleNavigate('home')}
            onUpdateStreak={(bestStreak) => {
              setProgress(prev => ({
                ...prev,
                bossRaidBestStreak: Math.max(prev.bossRaidBestStreak || 0, bestStreak),
              }));
            }}
          />
        )}

        {currentScreen === 'discover' && (
          <DiscoverLevel
            unlockedLetters={unlockedLetters}
            currentLetter={currentLetter}
            progress={progress}
            onLetterLearned={handleLetterLearned}
            onNextLetter={handleNextLetter}
            onGoToTracing={(l) => {
              const fullIdx = KANNADA_LETTERS.findIndex(x => x.id === l.id);
              if (fullIdx !== -1) setCurrentTraceIndex(fullIdx);
              handleNavigate('tracing');
            }}
          />
        )}

        {currentScreen === 'tracing' && (
          <TracingLevel
            currentLetter={KANNADA_LETTERS[currentTraceIndex] || KANNADA_LETTERS[0]}
            progress={progress}
            levelNumber={currentTraceIndex + 1}
            totalLevels={KANNADA_LETTERS.length}
            allLetters={KANNADA_LETTERS}
            onTraceCompleted={handleTraceCompleted}
            onNext={() => {
              const nextIdx = (currentTraceIndex + 1) % KANNADA_LETTERS.length;
              setCurrentTraceIndex(nextIdx);
              setProgress(prev => ({ ...prev, traceLevel: nextIdx }));
            }}
            onPrev={() => {
              const prevIdx = Math.max(0, currentTraceIndex - 1);
              setCurrentTraceIndex(prevIdx);
              setProgress(prev => ({ ...prev, traceLevel: prevIdx }));
            }}
            onSelectLevel={(letter, idx) => {
              setCurrentTraceIndex(idx);
              setProgress(prev => ({ ...prev, traceLevel: idx }));
            }}
          />
        )}

        {currentScreen === 'matching' && (
          <MatchingLevel
            unlockedLetters={unlockedLetters}
            progress={progress}
            onMatchComplete={handleMatchCompleted}
            onLetterMatched={handleLetterMatched}
          />
        )}

        {currentScreen === 'letter-hunt' && (
          <LetterHuntLevel
            unlockedLetters={unlockedLetters}
            progress={progress}
            onHuntComplete={handleLetterHuntFound}
            onLetterFound={handleLetterHuntFound}
          />
        )}

        {currentScreen === 'sound-quiz' && (
          <SoundQuizLevel
            unlockedLetters={unlockedLetters}
            progress={progress}
            onCorrectAnswer={handleSoundQuizCorrect}
            onWrongAnswer={handleSoundQuizWrong}
          />
        )}

        {currentScreen === 'word-builder' && (
          <WordBuilderLevel
            progress={progress}
            onWordBuilt={handleWordBuilt}
          />
        )}

        {currentScreen === 'boss-battle' && (
          <BossBattle
            unlockedLetters={unlockedLetters}
            progress={progress}
            onVictory={handleBossVictory}
            onExit={() => handleNavigate('home')}
          />
        )}

        {currentScreen === 'alphabet-book' && (
          <AlphabetBook
            progress={progress}
            onTraceLetter={(l) => {
              const idx = unlockedLetters.findIndex(x => x.id === l.id);
              if (idx !== -1) setCurrentLetterIndex(idx);
              handleNavigate('tracing');
            }}
            onClose={() => handleNavigate('home')}
          />
        )}

        {currentScreen === 'practice-weak' && (
          <PracticeScreen
            weakLetters={weakLetters}
            unlockedLetters={unlockedLetters}
            progress={progress}
            onSelectLetterForPractice={(l) => {
              const idx = unlockedLetters.findIndex(x => x.id === l.id);
              if (idx !== -1) setCurrentLetterIndex(idx);
              handleNavigate('discover');
            }}
            onStartTracing={(l) => {
              const idx = unlockedLetters.findIndex(x => x.id === l.id);
              if (idx !== -1) setCurrentLetterIndex(idx);
              handleNavigate('tracing');
            }}
          />
        )}
      </main>

      {/* Session Wrap-up / Progress check helper button at bottom */}
      {currentScreen !== 'home' && (
        <div className="fixed bottom-3 right-3 z-20">
          <button
            onClick={() => setShowSessionModal(true)}
            className="pop-btn px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-900 font-pop text-[10px] shadow-[2.5px_2.5px_0px_#000] flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏆 STATS</span>
          </button>
        </div>
      )}

      {/* Session Modal */}
      {showSessionModal && (
        <SessionSummary
          progress={progress}
          sessionXp={sessionXp}
          onContinue={() => setShowSessionModal(false)}
        />
      )}
    </div>
  );
}
