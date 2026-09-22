import { UserProgress, MasteryLevel } from '../types';
import { KANNADA_LETTERS } from '../data/kannadaData';

const STORAGE_KEY = 'kannada_varnamale_adventure_save_v1';

export function getDefaultProgress(): UserProgress {
  const initialStats: UserProgress['letterStats'] = {};
  KANNADA_LETTERS.forEach(letter => {
    initialStats[letter.id] = {
      seenCount: 0,
      correctCount: 0,
      wrongCount: 0,
      traced: false,
      mastery: 0,
    };
  });

  return {
    xp: 0,
    coins: 0,
    stars: 0,
    streak: 1,
    lastPlayedDate: new Date().toISOString().split('T')[0],
    hearts: 3,
    soundEnabled: true,
    unlockedGroup: 1, // Start with Group 1 (first 4 vowels: ಅ, ಆ, ಇ, ಈ)
    letterStats: initialStats,
    completedDailyMission: false,
    dailyMissionProgress: 0,
    dailyMissionTarget: 5,
    unlockedBadges: ['first_step'],
  };
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const parsed = JSON.parse(raw);
    
    // Ensure all current letters exist in stats
    const defaultStats = getDefaultProgress().letterStats;
    const mergedStats = { ...defaultStats, ...(parsed.letterStats || {}) };

    // Check streak
    const today = new Date().toISOString().split('T')[0];
    let streak = parsed.streak || 1;
    let completedDailyMission = parsed.completedDailyMission || false;
    let dailyMissionProgress = parsed.dailyMissionProgress || 0;

    if (parsed.lastPlayedDate) {
      const last = new Date(parsed.lastPlayedDate);
      const now = new Date(today);
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        // Consecutive day
      } else if (diffDays > 1) {
        streak = 1;
        completedDailyMission = false;
        dailyMissionProgress = 0;
      }
      if (diffDays >= 1) {
        completedDailyMission = false;
        dailyMissionProgress = 0;
      }
    }

    return {
      ...getDefaultProgress(),
      ...parsed,
      streak,
      lastPlayedDate: today,
      letterStats: mergedStats,
      completedDailyMission,
      dailyMissionProgress,
      hearts: 3, // Always refill hearts when starting / loading
    };
  } catch (e) {
    console.error('Failed to load progress from localStorage:', e);
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage:', e);
  }
}

export function calculateMastery(stats: {
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  traced: boolean;
}): MasteryLevel {
  const { seenCount, correctCount, wrongCount, traced } = stats;
  if (seenCount === 0) return 0;
  if (correctCount >= 5 && traced && wrongCount <= 2) return 4; // Mastered
  if (correctCount >= 3 && traced) return 3; // Reliable
  if (correctCount >= 2) return 2; // Recognized
  if (seenCount >= 1) return 1; // Seen
  return 0;
}

export function updateLetterProgress(
  prev: UserProgress,
  letterId: string,
  result: 'correct' | 'wrong' | 'traced'
): UserProgress {
  const current = prev.letterStats[letterId] || {
    seenCount: 0,
    correctCount: 0,
    wrongCount: 0,
    traced: false,
    mastery: 0,
  };

  const updatedStats = { ...current, seenCount: current.seenCount + 1 };
  if (result === 'correct') {
    updatedStats.correctCount += 1;
  } else if (result === 'wrong') {
    updatedStats.wrongCount += 1;
  } else if (result === 'traced') {
    updatedStats.traced = true;
    updatedStats.correctCount += 1;
  }

  updatedStats.mastery = calculateMastery(updatedStats);

  // Check if enough letters in current group are learned to unlock next group
  const lettersInCurrentGroup = KANNADA_LETTERS.filter(l => l.groupIndex === prev.unlockedGroup);
  const recognizedInGroup = lettersInCurrentGroup.filter(
    l => (prev.letterStats[l.id]?.mastery || 0) >= 2
  );
  
  let newUnlockedGroup = prev.unlockedGroup;
  if (recognizedInGroup.length >= Math.min(3, lettersInCurrentGroup.length) && prev.unlockedGroup < 9) {
    newUnlockedGroup = Math.max(prev.unlockedGroup, prev.unlockedGroup + 1);
  }

  const newProgress: UserProgress = {
    ...prev,
    unlockedGroup: newUnlockedGroup,
    letterStats: {
      ...prev.letterStats,
      [letterId]: updatedStats,
    },
  };

  saveProgress(newProgress);
  return newProgress;
}

export function getUnlockedLetters(progress: UserProgress) {
  return KANNADA_LETTERS.filter(l => l.groupIndex <= progress.unlockedGroup);
}

export function getWeakLetters(progress: UserProgress) {
  const unlocked = getUnlockedLetters(progress);
  return unlocked.filter(l => {
    const stats = progress.letterStats[l.id];
    if (!stats) return false;
    return stats.wrongCount > 0 && stats.mastery < 4;
  });
}
