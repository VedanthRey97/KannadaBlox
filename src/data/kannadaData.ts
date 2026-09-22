import { LetterData, WordData } from '../types';

export const KANNADA_LETTERS: LetterData[] = [
  // GROUP 1: First 4 vowels (Extreme ease for early learner)
  {
    id: 'a',
    char: 'ಅ',
    name: 'A',
    kannadaName: 'ಅ',
    type: 'vowel',
    phonetic: 'uh',
    groupIndex: 1,
    sampleWordKannada: 'ಅರಸ',
    sampleWordEnglish: 'Arasa',
    sampleWordMeaning: 'King 👑',
    guidePoints: [
      { x: 30, y: 35 }, { x: 50, y: 25 }, { x: 70, y: 35 },
      { x: 70, y: 55 }, { x: 50, y: 65 }, { x: 30, y: 60 },
      { x: 45, y: 75 }, { x: 75, y: 75 }, { x: 80, y: 50 }
    ]
  },
  {
    id: 'aa',
    char: 'ಆ',
    name: 'Aa',
    kannadaName: 'ಆ',
    type: 'vowel',
    phonetic: 'aah',
    groupIndex: 1,
    sampleWordKannada: 'ಆನೆ',
    sampleWordEnglish: 'Aane',
    sampleWordMeaning: 'Elephant 🐘',
    guidePoints: [
      { x: 28, y: 35 }, { x: 48, y: 25 }, { x: 68, y: 35 },
      { x: 68, y: 55 }, { x: 48, y: 65 }, { x: 28, y: 60 },
      { x: 45, y: 75 }, { x: 75, y: 75 }, { x: 82, y: 85 }
    ]
  },
  {
    id: 'i',
    char: 'ಇ',
    name: 'I',
    kannadaName: 'ಇ',
    type: 'vowel',
    phonetic: 'ee',
    groupIndex: 1,
    sampleWordKannada: 'ಇಲಿ',
    sampleWordEnglish: 'Ili',
    sampleWordMeaning: 'Mouse 🐭',
    guidePoints: [
      { x: 30, y: 35 }, { x: 50, y: 25 }, { x: 70, y: 35 },
      { x: 60, y: 55 }, { x: 40, y: 65 }, { x: 65, y: 75 }
    ]
  },
  {
    id: 'ee',
    char: 'ಈ',
    name: 'Ee',
    kannadaName: 'ಈ',
    type: 'vowel',
    phonetic: 'eee',
    groupIndex: 1,
    sampleWordKannada: 'ಈಜು',
    sampleWordEnglish: 'Eeju',
    sampleWordMeaning: 'Swim 🏊',
    guidePoints: [
      { x: 30, y: 35 }, { x: 50, y: 25 }, { x: 70, y: 35 },
      { x: 70, y: 65 }, { x: 45, y: 75 }, { x: 80, y: 30 }
    ]
  },

  // GROUP 2: Vowels Advanced
  {
    id: 'u',
    char: 'ಉ',
    name: 'U',
    kannadaName: 'ಉ',
    type: 'vowel',
    phonetic: 'oo',
    groupIndex: 2,
    sampleWordKannada: 'ಉಡುಗೊರೆ',
    sampleWordEnglish: 'Udugore',
    sampleWordMeaning: 'Gift 🎁',
    guidePoints: [
      { x: 25, y: 40 }, { x: 50, y: 30 }, { x: 75, y: 40 },
      { x: 60, y: 60 }, { x: 40, y: 75 }, { x: 75, y: 75 }
    ]
  },
  {
    id: 'oo',
    char: 'ಊ',
    name: 'Oo',
    kannadaName: 'ಊ',
    type: 'vowel',
    phonetic: 'oooh',
    groupIndex: 2,
    sampleWordKannada: 'ಊಟ',
    sampleWordEnglish: 'Oota',
    sampleWordMeaning: 'Meal 🍲',
    guidePoints: [
      { x: 25, y: 40 }, { x: 50, y: 30 }, { x: 75, y: 40 },
      { x: 55, y: 60 }, { x: 40, y: 75 }, { x: 80, y: 70 }
    ]
  },
  {
    id: 'ru',
    char: 'ಋ',
    name: 'Ru',
    kannadaName: 'ಋ',
    type: 'vowel',
    phonetic: 'rru',
    groupIndex: 2,
    sampleWordKannada: 'ಋಷಿ',
    sampleWordEnglish: 'Rushi',
    sampleWordMeaning: 'Sage 🧘',
    guidePoints: [
      { x: 30, y: 30 }, { x: 60, y: 30 }, { x: 45, y: 55 }, { x: 70, y: 75 }
    ]
  },
  {
    id: 'e',
    char: 'ಎ',
    name: 'E',
    kannadaName: 'ಎ',
    type: 'vowel',
    phonetic: 'eh',
    groupIndex: 2,
    sampleWordKannada: 'ಎಲೆ',
    sampleWordEnglish: 'Ele',
    sampleWordMeaning: 'Leaf 🍃',
    guidePoints: [
      { x: 30, y: 40 }, { x: 50, y: 25 }, { x: 70, y: 40 },
      { x: 50, y: 65 }, { x: 75, y: 75 }
    ]
  },
  {
    id: 'ae',
    char: 'ಏ',
    name: 'Ae',
    kannadaName: 'ಏ',
    type: 'vowel',
    phonetic: 'ay',
    groupIndex: 2,
    sampleWordKannada: 'ಏಣಿ',
    sampleWordEnglish: 'Aeni',
    sampleWordMeaning: 'Ladder 🪜',
    guidePoints: [
      { x: 30, y: 40 }, { x: 50, y: 25 }, { x: 70, y: 40 },
      { x: 50, y: 65 }, { x: 80, y: 40 }
    ]
  },

  // GROUP 3: Vowels Complete
  {
    id: 'ai',
    char: 'ಐ',
    name: 'Ai',
    kannadaName: 'ಐ',
    type: 'vowel',
    phonetic: 'eye',
    groupIndex: 3,
    sampleWordKannada: 'ಐದು',
    sampleWordEnglish: 'Aidu',
    sampleWordMeaning: 'Five 🖐️',
    guidePoints: [{ x: 30, y: 40 }, { x: 50, y: 25 }, { x: 70, y: 55 }, { x: 80, y: 75 }]
  },
  {
    id: 'o',
    char: 'ಒ',
    name: 'O',
    kannadaName: 'ಒ',
    type: 'vowel',
    phonetic: 'oh (short)',
    groupIndex: 3,
    sampleWordKannada: 'ಒಂಟೆ',
    sampleWordEnglish: 'Onte',
    sampleWordMeaning: 'Camel 🐪',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 25 }, { x: 70, y: 60 }, { x: 45, y: 75 }]
  },
  {
    id: 'oh',
    char: 'ಓ',
    name: 'Oh',
    kannadaName: 'ಓ',
    type: 'vowel',
    phonetic: 'ooh',
    groupIndex: 3,
    sampleWordKannada: 'ಓದು',
    sampleWordEnglish: 'Oodu',
    sampleWordMeaning: 'Read 📖',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 25 }, { x: 70, y: 60 }, { x: 85, y: 45 }]
  },
  {
    id: 'au',
    char: 'ಔ',
    name: 'Au',
    kannadaName: 'ಔ',
    type: 'vowel',
    phonetic: 'ow',
    groupIndex: 3,
    sampleWordKannada: 'ಔಷಧ',
    sampleWordEnglish: 'Aushadha',
    sampleWordMeaning: 'Medicine 💊',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 30 }, { x: 70, y: 65 }, { x: 85, y: 75 }]
  },
  {
    id: 'am',
    char: 'ಅಂ',
    name: 'Am',
    kannadaName: 'ಅಂ',
    type: 'yogavaha',
    phonetic: 'um',
    groupIndex: 3,
    sampleWordKannada: 'ಅಂಗಡಿ',
    sampleWordEnglish: 'Angadi',
    sampleWordMeaning: 'Shop 🏪',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 45 }, { x: 80, y: 55 }]
  },
  {
    id: 'aha',
    char: 'ಅಃ',
    name: 'Aha',
    kannadaName: 'ಅಃ',
    type: 'yogavaha',
    phonetic: 'aha',
    groupIndex: 3,
    sampleWordKannada: 'ನಮಃ',
    sampleWordEnglish: 'Namaha',
    sampleWordMeaning: 'Salutations 🙏',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 45 }, { x: 85, y: 40 }, { x: 85, y: 70 }]
  },

  // GROUP 4: Consonants Ka-Varga
  {
    id: 'ka',
    char: 'ಕ',
    name: 'Ka',
    kannadaName: 'ಕ',
    type: 'consonant',
    phonetic: 'kuh',
    groupIndex: 4,
    sampleWordKannada: 'ಕಮಲ',
    sampleWordEnglish: 'Kamala',
    sampleWordMeaning: 'Lotus 🪷',
    guidePoints: [{ x: 30, y: 40 }, { x: 50, y: 25 }, { x: 70, y: 40 }, { x: 50, y: 65 }, { x: 50, y: 85 }]
  },
  {
    id: 'kha',
    char: 'ಖ',
    name: 'Kha',
    kannadaName: 'ಖ',
    type: 'consonant',
    phonetic: 'khuh',
    groupIndex: 4,
    sampleWordKannada: 'ಖಡ್ಗ',
    sampleWordEnglish: 'Khadga',
    sampleWordMeaning: 'Sword ⚔️',
    guidePoints: [{ x: 35, y: 35 }, { x: 65, y: 35 }, { x: 50, y: 65 }, { x: 50, y: 80 }]
  },
  {
    id: 'ga',
    char: 'ಗ',
    name: 'Ga',
    kannadaName: 'ಗ',
    type: 'consonant',
    phonetic: 'guh',
    groupIndex: 4,
    sampleWordKannada: 'ಗಿಳಿ',
    sampleWordEnglish: 'Gili',
    sampleWordMeaning: 'Parrot 🦜',
    guidePoints: [{ x: 25, y: 55 }, { x: 50, y: 25 }, { x: 75, y: 55 }, { x: 50, y: 80 }]
  },
  {
    id: 'gha',
    char: 'ಘ',
    name: 'Gha',
    kannadaName: 'ಘ',
    type: 'consonant',
    phonetic: 'ghuh',
    groupIndex: 4,
    sampleWordKannada: 'ಘಂಟೆ',
    sampleWordEnglish: 'Ghante',
    sampleWordMeaning: 'Bell 🔔',
    guidePoints: [{ x: 25, y: 40 }, { x: 50, y: 30 }, { x: 75, y: 40 }, { x: 50, y: 75 }]
  },
  {
    id: 'nga',
    char: 'ಙ',
    name: 'Nga',
    kannadaName: 'ಙ',
    type: 'consonant',
    phonetic: 'nguh',
    groupIndex: 4,
    sampleWordKannada: 'ಙ',
    sampleWordEnglish: 'Nga',
    sampleWordMeaning: 'Nasal sound 🎵',
    guidePoints: [{ x: 30, y: 35 }, { x: 65, y: 35 }, { x: 50, y: 65 }]
  },

  // GROUP 5: Consonants Cha-Varga
  {
    id: 'cha',
    char: 'ಚ',
    name: 'Cha',
    kannadaName: 'ಚ',
    type: 'consonant',
    phonetic: 'chuh',
    groupIndex: 5,
    sampleWordKannada: 'ಚಂಡು',
    sampleWordEnglish: 'Chandu',
    sampleWordMeaning: 'Ball ⚽',
    guidePoints: [{ x: 30, y: 35 }, { x: 50, y: 25 }, { x: 70, y: 40 }, { x: 50, y: 70 }]
  },
  {
    id: 'chha',
    char: 'ಛ',
    name: 'Chha',
    kannadaName: 'ಛ',
    type: 'consonant',
    phonetic: 'chhuh',
    groupIndex: 5,
    sampleWordKannada: 'ಛತ್ರಿ',
    sampleWordEnglish: 'Chhatri',
    sampleWordMeaning: 'Umbrella ☂️',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 35 }, { x: 50, y: 65 }, { x: 50, y: 85 }]
  },
  {
    id: 'ja',
    char: 'ಜ',
    name: 'Ja',
    kannadaName: 'ಜ',
    type: 'consonant',
    phonetic: 'juh',
    groupIndex: 5,
    sampleWordKannada: 'ಜಿಂಕೆ',
    sampleWordEnglish: 'Jinke',
    sampleWordMeaning: 'Deer 🦌',
    guidePoints: [{ x: 30, y: 40 }, { x: 50, y: 30 }, { x: 70, y: 45 }, { x: 55, y: 75 }]
  },
  {
    id: 'jha',
    char: 'ಝ',
    name: 'Jha',
    kannadaName: 'ಝ',
    type: 'consonant',
    phonetic: 'jhuh',
    groupIndex: 5,
    sampleWordKannada: 'ಝರಿ',
    sampleWordEnglish: 'Jhari',
    sampleWordMeaning: 'Waterfall 🌊',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 35 }, { x: 45, y: 65 }, { x: 75, y: 70 }]
  },
  {
    id: 'nya',
    char: 'ಞ',
    name: 'Nya',
    kannadaName: 'ಞ',
    type: 'consonant',
    phonetic: 'nyuh',
    groupIndex: 5,
    sampleWordKannada: 'ಞ',
    sampleWordEnglish: 'Nya',
    sampleWordMeaning: 'Nasal sound 🎵',
    guidePoints: [{ x: 30, y: 40 }, { x: 60, y: 40 }, { x: 50, y: 70 }]
  },

  // GROUP 6: Consonants Ta-Varga
  {
    id: 'ta',
    char: 'ಟ',
    name: 'Ta',
    kannadaName: 'ಟ',
    type: 'consonant',
    phonetic: 'tuh (hard)',
    groupIndex: 6,
    sampleWordKannada: 'ಟೊಮೆಟೊ',
    sampleWordEnglish: 'Tomato',
    sampleWordMeaning: 'Tomato 🍅',
    guidePoints: [{ x: 25, y: 45 }, { x: 50, y: 25 }, { x: 75, y: 45 }, { x: 50, y: 75 }]
  },
  {
    id: 'tha_hard',
    char: 'ಠ',
    name: 'Tha',
    kannadaName: 'ಠ',
    type: 'consonant',
    phonetic: 'thuh (hard)',
    groupIndex: 6,
    sampleWordKannada: 'ಠಸ್ಸೆ',
    sampleWordEnglish: 'Thasse',
    sampleWordMeaning: 'Stamp 🏷️',
    guidePoints: [{ x: 50, y: 25 }, { x: 75, y: 50 }, { x: 50, y: 75 }, { x: 25, y: 50 }, { x: 50, y: 50 }]
  },
  {
    id: 'da_hard',
    char: 'ಡ',
    name: 'Da',
    kannadaName: 'ಡ',
    type: 'consonant',
    phonetic: 'duh (hard)',
    groupIndex: 6,
    sampleWordKannada: 'ಡಬ್ಬಿ',
    sampleWordEnglish: 'Dabbi',
    sampleWordMeaning: 'Box 📦',
    guidePoints: [{ x: 30, y: 35 }, { x: 65, y: 30 }, { x: 50, y: 55 }, { x: 70, y: 75 }]
  },
  {
    id: 'dha_hard',
    char: 'ಢ',
    name: 'Dha',
    kannadaName: 'ಢ',
    type: 'consonant',
    phonetic: 'dhuh (hard)',
    groupIndex: 6,
    sampleWordKannada: 'ಢಕ್ಕೆ',
    sampleWordEnglish: 'Dhakke',
    sampleWordMeaning: 'Drum 🥁',
    guidePoints: [{ x: 30, y: 35 }, { x: 65, y: 30 }, { x: 50, y: 55 }, { x: 70, y: 75 }, { x: 50, y: 85 }]
  },
  {
    id: 'na_retroflex',
    char: 'ಣ',
    name: 'Na',
    kannadaName: 'ಣ',
    type: 'consonant',
    phonetic: 'nuh (hard)',
    groupIndex: 6,
    sampleWordKannada: 'ಬಾಣ',
    sampleWordEnglish: 'Baana',
    sampleWordMeaning: 'Arrow 🏹',
    guidePoints: [{ x: 30, y: 40 }, { x: 50, y: 35 }, { x: 70, y: 40 }, { x: 60, y: 75 }]
  },

  // GROUP 7: Consonants Tha-Varga (Dental)
  {
    id: 'tha_soft',
    char: 'ತ',
    name: 'Ta',
    kannadaName: 'ತ',
    type: 'consonant',
    phonetic: 'thuh (soft)',
    groupIndex: 7,
    sampleWordKannada: 'ತಬಲ',
    sampleWordEnglish: 'Tabala',
    sampleWordMeaning: 'Tabla Drum 🪘',
    guidePoints: [{ x: 30, y: 35 }, { x: 55, y: 30 }, { x: 70, y: 50 }, { x: 45, y: 75 }]
  },
  {
    id: 'thha_soft',
    char: 'ಥ',
    name: 'Tha',
    kannadaName: 'ಥ',
    type: 'consonant',
    phonetic: 'thhuh',
    groupIndex: 7,
    sampleWordKannada: 'ರಥ',
    sampleWordEnglish: 'Ratha',
    sampleWordMeaning: 'Chariot 🛞',
    guidePoints: [{ x: 35, y: 35 }, { x: 65, y: 35 }, { x: 50, y: 65 }]
  },
  {
    id: 'da_soft',
    char: 'ದ',
    name: 'Da',
    kannadaName: 'ದ',
    type: 'consonant',
    phonetic: 'duh (soft)',
    groupIndex: 7,
    sampleWordKannada: 'ದೋಸೆ',
    sampleWordEnglish: 'Dose',
    sampleWordMeaning: 'Crispy Dosa 🥞',
    guidePoints: [{ x: 30, y: 35 }, { x: 55, y: 30 }, { x: 75, y: 55 }, { x: 50, y: 75 }]
  },
  {
    id: 'dha_soft',
    char: 'ಧ',
    name: 'Dha',
    kannadaName: 'ಧ',
    type: 'consonant',
    phonetic: 'dhuh (soft)',
    groupIndex: 7,
    sampleWordKannada: 'ಧನುಸ್ಸು',
    sampleWordEnglish: 'Dhanussu',
    sampleWordMeaning: 'Bow 🏹',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 30 }, { x: 70, y: 55 }, { x: 50, y: 80 }]
  },
  {
    id: 'na_soft',
    char: 'ನ',
    name: 'Na',
    kannadaName: 'ನ',
    type: 'consonant',
    phonetic: 'nuh',
    groupIndex: 7,
    sampleWordKannada: 'ನವಿಲು',
    sampleWordEnglish: 'Navilu',
    sampleWordMeaning: 'Peacock 🦚',
    guidePoints: [{ x: 30, y: 35 }, { x: 55, y: 30 }, { x: 75, y: 50 }, { x: 65, y: 75 }]
  },

  // GROUP 8: Consonants Pa-Varga
  {
    id: 'pa',
    char: 'ಪ',
    name: 'Pa',
    kannadaName: 'ಪ',
    type: 'consonant',
    phonetic: 'puh',
    groupIndex: 8,
    sampleWordKannada: 'ಪತಂಗ',
    sampleWordEnglish: 'Patanga',
    sampleWordMeaning: 'Kite 🪁',
    guidePoints: [{ x: 30, y: 30 }, { x: 30, y: 65 }, { x: 60, y: 65 }, { x: 60, y: 30 }]
  },
  {
    id: 'pha',
    char: 'ಫ',
    name: 'Pha',
    kannadaName: 'ಫ',
    type: 'consonant',
    phonetic: 'phuh / fuh',
    groupIndex: 8,
    sampleWordKannada: 'ಫಲ',
    sampleWordEnglish: 'Phala',
    sampleWordMeaning: 'Fruit 🍎',
    guidePoints: [{ x: 30, y: 30 }, { x: 30, y: 65 }, { x: 65, y: 65 }, { x: 65, y: 30 }, { x: 50, y: 80 }]
  },
  {
    id: 'ba',
    char: 'ಬ',
    name: 'Ba',
    kannadaName: 'ಬ',
    type: 'consonant',
    phonetic: 'buh',
    groupIndex: 8,
    sampleWordKannada: 'ಬಲೂನ್',
    sampleWordEnglish: 'Balloon',
    sampleWordMeaning: 'Balloon 🎈',
    guidePoints: [{ x: 30, y: 35 }, { x: 55, y: 25 }, { x: 75, y: 45 }, { x: 55, y: 75 }]
  },
  {
    id: 'bha',
    char: 'ಭ',
    name: 'Bha',
    kannadaName: 'ಭ',
    type: 'consonant',
    phonetic: 'bhuh',
    groupIndex: 8,
    sampleWordKannada: 'ಭಾರತ',
    sampleWordEnglish: 'Bharata',
    sampleWordMeaning: 'India 🇮🇳',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 30 }, { x: 70, y: 60 }, { x: 50, y: 85 }]
  },
  {
    id: 'ma',
    char: 'ಮ',
    name: 'Ma',
    kannadaName: 'ಮ',
    type: 'consonant',
    phonetic: 'muh',
    groupIndex: 8,
    sampleWordKannada: 'ಮರ',
    sampleWordEnglish: 'Mara',
    sampleWordMeaning: 'Tree 🌳',
    guidePoints: [{ x: 30, y: 35 }, { x: 55, y: 30 }, { x: 75, y: 50 }, { x: 60, y: 75 }]
  },

  // GROUP 9: Consonants Final & Additional
  {
    id: 'ya',
    char: 'ಯ',
    name: 'Ya',
    kannadaName: 'ಯ',
    type: 'consonant',
    phonetic: 'yuh',
    groupIndex: 9,
    sampleWordKannada: 'ಯಂತ್ರ',
    sampleWordEnglish: 'Yantra',
    sampleWordMeaning: 'Machine ⚙️',
    guidePoints: [{ x: 25, y: 40 }, { x: 50, y: 30 }, { x: 75, y: 40 }, { x: 50, y: 75 }]
  },
  {
    id: 'ra',
    char: 'ರ',
    name: 'Ra',
    kannadaName: 'ರ',
    type: 'consonant',
    phonetic: 'ruh',
    groupIndex: 9,
    sampleWordKannada: 'ರಥ',
    sampleWordEnglish: 'Ratha',
    sampleWordMeaning: 'Chariot 🛞',
    guidePoints: [{ x: 30, y: 45 }, { x: 50, y: 25 }, { x: 70, y: 45 }, { x: 50, y: 75 }]
  },
  {
    id: 'la',
    char: 'ಲ',
    name: 'La',
    kannadaName: 'ಲ',
    type: 'consonant',
    phonetic: 'luh',
    groupIndex: 9,
    sampleWordKannada: 'ಲಡ್ಡು',
    sampleWordEnglish: 'Laddu',
    sampleWordMeaning: 'Sweet Laddu 🟡',
    guidePoints: [{ x: 25, y: 45 }, { x: 50, y: 35 }, { x: 75, y: 45 }, { x: 50, y: 75 }]
  },
  {
    id: 'va',
    char: 'ವ',
    name: 'Va',
    kannadaName: 'ವ',
    type: 'consonant',
    phonetic: 'vuh',
    groupIndex: 9,
    sampleWordKannada: 'ವನ',
    sampleWordEnglish: 'Vana',
    sampleWordMeaning: 'Forest 🌲',
    guidePoints: [{ x: 30, y: 40 }, { x: 55, y: 25 }, { x: 75, y: 45 }, { x: 50, y: 75 }]
  },
  {
    id: 'sha',
    char: 'ಶ',
    name: 'Sha',
    kannadaName: 'ಶ',
    type: 'consonant',
    phonetic: 'shuh',
    groupIndex: 9,
    sampleWordKannada: 'ಶಂಖ',
    sampleWordEnglish: 'Shankha',
    sampleWordMeaning: 'Conch 🐚',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 30 }, { x: 70, y: 65 }]
  },
  {
    id: 'ssa',
    char: 'ಷ',
    name: 'Sha (retroflex)',
    kannadaName: 'ಷ',
    type: 'consonant',
    phonetic: 'shuh',
    groupIndex: 9,
    sampleWordKannada: 'ಷಟ್ಕೋಣ',
    sampleWordEnglish: 'Shatkona',
    sampleWordMeaning: 'Hexagon ⬡',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 35 }, { x: 50, y: 65 }]
  },
  {
    id: 'sa',
    char: 'ಸ',
    name: 'Sa',
    kannadaName: 'ಸ',
    type: 'consonant',
    phonetic: 'suh',
    groupIndex: 9,
    sampleWordKannada: 'ಸೂರ್ಯ',
    sampleWordEnglish: 'Surya',
    sampleWordMeaning: 'Sun ☀️',
    guidePoints: [{ x: 30, y: 35 }, { x: 55, y: 25 }, { x: 75, y: 45 }, { x: 50, y: 75 }]
  },
  {
    id: 'ha',
    char: 'ಹ',
    name: 'Ha',
    kannadaName: 'ಹ',
    type: 'consonant',
    phonetic: 'huh',
    groupIndex: 9,
    sampleWordKannada: 'ಹೂವು',
    sampleWordEnglish: 'Hoovu',
    sampleWordMeaning: 'Flower 🌸',
    guidePoints: [{ x: 30, y: 35 }, { x: 60, y: 30 }, { x: 70, y: 60 }, { x: 50, y: 80 }]
  },
  {
    id: 'lla',
    char: 'ಳ',
    name: 'La (hard)',
    kannadaName: 'ಳ',
    type: 'consonant',
    phonetic: 'lluh',
    groupIndex: 9,
    sampleWordKannada: 'ಬಳೆ',
    sampleWordEnglish: 'Bale',
    sampleWordMeaning: 'Bangle ⭕',
    guidePoints: [{ x: 30, y: 40 }, { x: 50, y: 30 }, { x: 70, y: 40 }, { x: 65, y: 75 }]
  }
];

export const GROUP_INFO: Record<number, { title: string; kannadaTitle: string; desc: string }> = {
  1: { title: 'First Vowels', kannadaTitle: 'ಮೊದಲ ಸ್ವರಗಳು', desc: 'ಅ, ಆ, ಇ, ಈ' },
  2: { title: 'Middle Vowels', kannadaTitle: 'ಮುಂದಿನ ಸ್ವರಗಳು', desc: 'ಉ, ಊ, ಋ, ಎ, ಏ' },
  3: { title: 'Vowels & Sounds', kannadaTitle: 'ಉಳಿದ ಸ್ವರಗಳು', desc: 'ಐ, ಒ, ಓ, ಔ, ಅಂ, ಅಃ' },
  4: { title: 'Ka Family', kannadaTitle: 'ಕ-ವರ್ಗ ವ್ಯಂಜನಗಳು', desc: 'ಕ, ಖ, ಗ, ಘ, ಙ' },
  5: { title: 'Cha Family', kannadaTitle: 'ಚ-ವರ್ಗ ವ್ಯಂಜನಗಳು', desc: 'ಚ, ಛ, ಜ, ಝ, ಞ' },
  6: { title: 'Ta Family', kannadaTitle: 'ಟ-ವರ್ಗ ವ್ಯಂಜನಗಳು', desc: 'ಟ, ಠ, ಡ, ಢ, ಣ' },
  7: { title: 'Tha Family', kannadaTitle: 'ತ-ವರ್ಗ ವ್ಯಂಜನಗಳು', desc: 'ತ, ಥ, ದ, ಧ, ನ' },
  8: { title: 'Pa Family', kannadaTitle: 'ಪ-ವರ್ಗ ವ್ಯಂಜನಗಳು', desc: 'ಪ, ಫ, ಬ, ಭ, ಮ' },
  9: { title: 'Final Letters', kannadaTitle: 'ಅಂತ್ಯ ವ್ಯಂಜನಗಳು', desc: 'ಯ, ರ, ಲ, ವ, ಶ, ಷ, ಸ, ಹ, ಳ' },
};

export const SIMPLE_WORDS: WordData[] = [
  {
    id: 'w_mana',
    letters: ['ಮ', 'ನ'],
    kannadaWord: 'ಮನ',
    englishMeaning: 'Mind / Heart',
    phonetic: 'Mana',
    hintEmoji: '❤️'
  },
  {
    id: 'w_kala',
    letters: ['ಕ', 'ಲ'],
    kannadaWord: 'ಕಲ',
    englishMeaning: 'Art / Gentle Sound',
    phonetic: 'Kala',
    hintEmoji: '🎨'
  },
  {
    id: 'w_mala',
    letters: ['ಮ', 'ಲ'],
    kannadaWord: 'ಮಲ',
    englishMeaning: 'Bloom / Garland',
    phonetic: 'Mala',
    hintEmoji: '🌸'
  },
  {
    id: 'w_jala',
    letters: ['ಜ', 'ಲ'],
    kannadaWord: 'ಜಲ',
    englishMeaning: 'Water',
    phonetic: 'Jala',
    hintEmoji: '💧'
  },
  {
    id: 'w_vana',
    letters: ['ವ', 'ನ'],
    kannadaWord: 'ವನ',
    englishMeaning: 'Forest / Woods',
    phonetic: 'Vana',
    hintEmoji: '🌲'
  },
  {
    id: 'w_mara',
    letters: ['ಮ', 'ರ'],
    kannadaWord: 'ಮರ',
    englishMeaning: 'Tree',
    phonetic: 'Mara',
    hintEmoji: '🌳'
  },
  {
    id: 'w_gaja',
    letters: ['ಗ', 'ಜ'],
    kannadaWord: 'ಗಜ',
    englishMeaning: 'Elephant',
    phonetic: 'Gaja',
    hintEmoji: '🐘'
  },
  {
    id: 'w_sara',
    letters: ['ಸ', 'ರ'],
    kannadaWord: 'ಸರ',
    englishMeaning: 'Garland / Necklace',
    phonetic: 'Sara',
    hintEmoji: '📿'
  },
  {
    id: 'w_hala',
    letters: ['ಹ', 'ಲ'],
    kannadaWord: 'ಹಲ',
    englishMeaning: 'Plough / Many',
    phonetic: 'Hala',
    hintEmoji: '🌾'
  },
  {
    id: 'w_bala',
    letters: ['ಬ', 'ಲ'],
    kannadaWord: 'ಬಲ',
    englishMeaning: 'Strength',
    phonetic: 'Bala',
    hintEmoji: '💪'
  },
  {
    id: 'w_ratha',
    letters: ['ರ', 'ಥ'],
    kannadaWord: 'ರಥ',
    englishMeaning: 'Chariot',
    phonetic: 'Ratha',
    hintEmoji: '🛞'
  },
  {
    id: 'w_arasa',
    letters: ['ಅ', 'ರ', 'ಸ'],
    kannadaWord: 'ಅರಸ',
    englishMeaning: 'King',
    phonetic: 'Arasa',
    hintEmoji: '👑'
  }
];

export const EXPLORER_RANKS = [
  { minXp: 0, title: 'Little Explorer', kannadaTitle: 'ಪುಟ್ಟ ಸಾಹಸಿ', color: 'bg-emerald-500', badge: '🌱' },
  { minXp: 100, title: 'Bronze Explorer', kannadaTitle: 'ಕಂಚಿನ ಸಾಹಸಿ', color: 'bg-amber-600', badge: '🥉' },
  { minXp: 250, title: 'Silver Explorer', kannadaTitle: 'ಬೆಳ್ಳಿಯ ಸಾಹಸಿ', color: 'bg-slate-400', badge: '🥈' },
  { minXp: 500, title: 'Golden Explorer', kannadaTitle: 'ಚಿನ್ನದ ಸಾಹಸಿ', color: 'bg-yellow-500', badge: '🥇' },
  { minXp: 1000, title: 'Kannada Master', kannadaTitle: 'ಕನ್ನಡ ಗುರು', color: 'bg-purple-600', badge: '👑' },
];
