let audioCtx: AudioContext | null = null;
let currentLetterAudio: HTMLAudioElement | null = null;

// Authentic pronunciation audio map for all 49 Kannada letters
const LETTER_AUDIO_MAP: Record<string, string> = {
  // Swaras (Vowels)
  'ಅ': '/audio/letters/a.mp3',
  'ಆ': '/audio/letters/aa.mp3',
  'ಇ': '/audio/letters/i.mp3',
  'ಈ': '/audio/letters/ee.mp3',
  'ಉ': '/audio/letters/u.mp3',
  'ಊ': '/audio/letters/oo.mp3',
  'ಋ': '/audio/letters/ru.mp3',
  'ಎ': '/audio/letters/e.mp3',
  'ಏ': '/audio/letters/ae.mp3',
  'ಐ': '/audio/letters/ai.mp3',
  'ಒ': '/audio/letters/o.mp3',
  'ಓ': '/audio/letters/oh.mp3',
  'ಔ': '/audio/letters/au.mp3',
  'ಅಂ': '/audio/letters/am.mp3',
  'ಅಃ': '/audio/letters/aha.mp3',

  // Vyanjanas (Consonants)
  'ಕ': '/audio/letters/ka.mp3',
  'ಖ': '/audio/letters/kha.mp3',
  'ಗ': '/audio/letters/ga.mp3',
  'ಘ': '/audio/letters/gha.mp3',
  'ಙ': '/audio/letters/nga.mp3',
  'ಚ': '/audio/letters/cha.mp3',
  'ಛ': '/audio/letters/chha.mp3',
  'ಜ': '/audio/letters/ja.mp3',
  'ಝ': '/audio/letters/jha.mp3',
  'ಞ': '/audio/letters/nya.mp3',
  'ಟ': '/audio/letters/ta.mp3',
  'ಠ': '/audio/letters/tha_hard.mp3',
  'ಡ': '/audio/letters/da_hard.mp3',
  'ಢ': '/audio/letters/dha_hard.mp3',
  'ಣ': '/audio/letters/na_retroflex.mp3',
  'ತ': '/audio/letters/tha_soft.mp3',
  'ಥ': '/audio/letters/thha_soft.mp3',
  'ದ': '/audio/letters/da_soft.mp3',
  'ಧ': '/audio/letters/dha_soft.mp3',
  'ನ': '/audio/letters/na_soft.mp3',
  'ಪ': '/audio/letters/pa.mp3',
  'ಫ': '/audio/letters/pha.mp3',
  'ಬ': '/audio/letters/ba.mp3',
  'ಭ': '/audio/letters/bha.mp3',
  'ಮ': '/audio/letters/ma.mp3',
  'ಯ': '/audio/letters/ya.mp3',
  'ರ': '/audio/letters/ra.mp3',
  'ಲ': '/audio/letters/la.mp3',
  'ವ': '/audio/letters/va.mp3',
  'ಶ': '/audio/letters/sha.mp3',
  'ಷ': '/audio/letters/ssa.mp3',
  'ಸ': '/audio/letters/sa.mp3',
  'ಹ': '/audio/letters/ha.mp3',
  'ಳ': '/audio/letters/lla.mp3',

  // Letter IDs support
  'a': '/audio/letters/a.mp3',
  'aa': '/audio/letters/aa.mp3',
  'i': '/audio/letters/i.mp3',
  'ee': '/audio/letters/ee.mp3',
  'u': '/audio/letters/u.mp3',
  'oo': '/audio/letters/oo.mp3',
  'ru': '/audio/letters/ru.mp3',
  'e': '/audio/letters/e.mp3',
  'ae': '/audio/letters/ae.mp3',
  'ai': '/audio/letters/ai.mp3',
  'o': '/audio/letters/o.mp3',
  'oh': '/audio/letters/oh.mp3',
  'au': '/audio/letters/au.mp3',
  'am': '/audio/letters/am.mp3',
  'aha': '/audio/letters/aha.mp3',
  'ka': '/audio/letters/ka.mp3',
  'kha': '/audio/letters/kha.mp3',
  'ga': '/audio/letters/ga.mp3',
  'gha': '/audio/letters/gha.mp3',
  'nga': '/audio/letters/nga.mp3',
  'cha': '/audio/letters/cha.mp3',
  'chha': '/audio/letters/chha.mp3',
  'ja': '/audio/letters/ja.mp3',
  'jha': '/audio/letters/jha.mp3',
  'nya': '/audio/letters/nya.mp3',
  'ta': '/audio/letters/ta.mp3',
  'tha_hard': '/audio/letters/tha_hard.mp3',
  'da_hard': '/audio/letters/da_hard.mp3',
  'dha_hard': '/audio/letters/dha_hard.mp3',
  'na_retroflex': '/audio/letters/na_retroflex.mp3',
  'tha_soft': '/audio/letters/tha_soft.mp3',
  'thha_soft': '/audio/letters/thha_soft.mp3',
  'da_soft': '/audio/letters/da_soft.mp3',
  'dha_soft': '/audio/letters/dha_soft.mp3',
  'na_soft': '/audio/letters/na_soft.mp3',
  'pa': '/audio/letters/pa.mp3',
  'pha': '/audio/letters/pha.mp3',
  'ba': '/audio/letters/ba.mp3',
  'bha': '/audio/letters/bha.mp3',
  'ma': '/audio/letters/ma.mp3',
  'ya': '/audio/letters/ya.mp3',
  'ra': '/audio/letters/ra.mp3',
  'la': '/audio/letters/la.mp3',
  'va': '/audio/letters/va.mp3',
  'sha': '/audio/letters/sha.mp3',
  'ssa': '/audio/letters/ssa.mp3',
  'sa': '/audio/letters/sa.mp3',
  'ha': '/audio/letters/ha.mp3',
  'lla': '/audio/letters/lla.mp3',
};

// Audio cache to avoid re-instantiating HTMLAudioElements
const audioCache: Record<string, HTMLAudioElement> = {};

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function fallbackSpeechSynthesis(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const kannadaVoice = voices.find(v => v.lang.startsWith('kn') || v.name.toLowerCase().includes('kannada'));
    if (kannadaVoice) {
      utterance.voice = kannadaVoice;
      utterance.lang = kannadaVoice.lang;
    } else {
      const fallbackVoice = voices.find(v => v.lang.includes('IN') || v.lang.startsWith('hi'));
      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
        utterance.lang = fallbackVoice.lang;
      }
    }
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

export function speakKannada(text: string, isSoundEnabled: boolean = true) {
  if (!isSoundEnabled || typeof window === 'undefined') {
    return;
  }

  const trimmed = text.trim();
  const audioSrc = LETTER_AUDIO_MAP[trimmed];

  if (audioSrc) {
    try {
      if (currentLetterAudio) {
        currentLetterAudio.pause();
        currentLetterAudio.currentTime = 0;
      }

      if (!audioCache[audioSrc]) {
        audioCache[audioSrc] = new Audio(audioSrc);
      }

      const audio = audioCache[audioSrc];
      audio.currentTime = 0;
      currentLetterAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Direct audio play failed, falling back to speech synthesis:', err);
          fallbackSpeechSynthesis(trimmed);
        });
      }
      return;
    } catch (err) {
      console.warn('Letter audio exception:', err);
    }
  }

  // Fallback for multi-letter words or unmapped items
  fallbackSpeechSynthesis(trimmed);
}

// Pop sound tone generator
function playTone(freq: number, type: OscillatorType, duration: number, gainValue: number = 0.15, startTimeOffset: number = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + startTimeOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

// High-Contrast Pop & Cartoon Audio Synthesizers

export function playTapSound(enabled: boolean = true) {
  if (!enabled) return;
  // Cheerful cartoon bubble pop
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(840, now + 0.05);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}

export function playSuccessSound(enabled: boolean = true) {
  if (!enabled) return;
  // Vibrant pop fanfare arpeggio (C5 -> E5 -> G5 -> C6)
  playTone(523.25, 'triangle', 0.1, 0.14, 0);
  playTone(659.25, 'triangle', 0.1, 0.14, 0.08);
  playTone(783.99, 'sine', 0.12, 0.16, 0.16);
  playTone(1046.50, 'sine', 0.3, 0.18, 0.24);
}

export function playCelebrationFanfare(enabled: boolean = true) {
  if (!enabled) return;
  // Grand pop fanfare with brassy overtone
  playTone(440, 'triangle', 0.12, 0.15, 0);
  playTone(554.37, 'triangle', 0.12, 0.15, 0.1);
  playTone(659.25, 'triangle', 0.15, 0.18, 0.2);
  playTone(880, 'sine', 0.45, 0.2, 0.32);
}

export function playGentleWrongSound(enabled: boolean = true) {
  if (!enabled) return;
  // Bouncy cartoon "boop-boop"
  playTone(320, 'sine', 0.1, 0.1, 0);
  playTone(240, 'sine', 0.15, 0.09, 0.09);
}

export function playTraceTickSound(enabled: boolean = true) {
  if (!enabled) return;
  // Crisp pop star collect tick
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const freq = 880 + Math.random() * 200;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

export function playCoinSound(enabled: boolean = true) {
  if (!enabled) return;
  // Bright shiny sticker/coin chime
  playTone(987.77, 'sine', 0.08, 0.14, 0);
  playTone(1318.51, 'sine', 0.25, 0.15, 0.07);
}

export function playDragonHitSound(enabled: boolean = true) {
  if (!enabled) return;
  // Pop comic impact punch ("POW!")
  playTone(150, 'sawtooth', 0.08, 0.18, 0);
  playTone(450, 'triangle', 0.1, 0.16, 0.03);
  playTone(900, 'sine', 0.15, 0.12, 0.08);
}

export function playDoorOpenSound(enabled: boolean = true) {
  if (!enabled) return;
  // Satisfying wooden latch slide & resonant ring
  playTone(280, 'triangle', 0.07, 0.12, 0);
  playTone(560, 'sine', 0.15, 0.15, 0.06);
}

export function playDoorBuzzerSound(enabled: boolean = true) {
  if (!enabled) return;
  // Comical trap buzzer
  playTone(140, 'sawtooth', 0.18, 0.18, 0);
  playTone(110, 'sawtooth', 0.25, 0.2, 0.12);
}

export function playCarEngineRev(enabled: boolean = true) {
  if (!enabled) return;
  // Blox-style kart engine roar
  playTone(120, 'sawtooth', 0.12, 0.1, 0);
  playTone(160, 'sawtooth', 0.15, 0.12, 0.08);
  playTone(220, 'triangle', 0.2, 0.1, 0.15);
}

export function playCarTurboBoost(enabled: boolean = true) {
  if (!enabled) return;
  // Sci-fi high-speed nitro turbo whoosh & coin chime
  playTone(300, 'sine', 0.08, 0.15, 0);
  playTone(600, 'sine', 0.12, 0.15, 0.05);
  playTone(1200, 'triangle', 0.25, 0.18, 0.1);
  playTone(1500, 'sine', 0.35, 0.14, 0.18);
}

export function playCarSkidCrash(enabled: boolean = true) {
  if (!enabled) return;
  // Tire screech & blox bumper bounce
  playTone(850, 'sawtooth', 0.15, 0.16, 0);
  playTone(620, 'sawtooth', 0.18, 0.18, 0.08);
  playTone(180, 'sawtooth', 0.25, 0.22, 0.18);
}

