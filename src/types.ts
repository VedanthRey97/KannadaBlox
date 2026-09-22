export type MasteryLevel = 0 | 1 | 2 | 3 | 4; // 0: unlearned, 1: seen, 2: recognized, 3: reliable, 4: mastered

export interface LetterData {
  id: string;
  char: string;
  name: string; // e.g. 'A', 'Aa', 'Ka'
  kannadaName: string; // e.g. 'ಅ'
  type: 'vowel' | 'consonant' | 'yogavaha';
  phonetic: string;
  groupIndex: number; // 1 to 9 for progressive unlocking
  sampleWordKannada: string;
  sampleWordEnglish: string;
  sampleWordMeaning: string;
  tracingStrokes?: number;
  guidePoints?: { x: number; y: number }[];
}

export interface WordData {
  id: string;
  letters: string[];
  kannadaWord: string;
  englishMeaning: string;
  phonetic: string;
  hintEmoji: string;
}

export interface UserProgress {
  xp: number;
  coins: number;
  stars: number;
  streak: number;
  lastPlayedDate: string;
  hearts: number;
  soundEnabled: boolean;
  unlockedGroup: number; // starts at 1
  letterStats: Record<string, {
    seenCount: number;
    correctCount: number;
    wrongCount: number;
    traced: boolean;
    mastery: MasteryLevel;
  }>;
  completedDailyMission: boolean;
  dailyMissionProgress: number;
  dailyMissionTarget: number;
  unlockedBadges: string[];
  doorsBestStreak?: number;
  bossRaidBestStreak?: number;
  traceLevel?: number;
}

export type GameScreen = 
  | 'home'
  | 'level-select'
  | 'tracing'
  | 'doors-game'
  | 'boss-raid'
  | 'discover'
  | 'matching'
  | 'letter-hunt'
  | 'sound-quiz'
  | 'word-builder'
  | 'boss-battle'
  | 'alphabet-book'
  | 'daily-mission'
  | 'practice-weak';

export type CharacterMood = 
  | 'idle'
  | 'happy'
  | 'celebrating'
  | 'thinking'
  | 'encouraging'
  | 'super-excited';
