import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Grid, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LetterData, UserProgress } from '../types';
import { speakKannada, playTapSound, playSuccessSound, playTraceTickSound } from '../utils/audio';
import { ExplorerCharacter } from './ExplorerCharacter';

interface TracingLevelProps {
  currentLetter: LetterData;
  progress: UserProgress;
  onTraceCompleted: (letterId: string) => void;
  onNext: () => void;
  onPrev?: () => void;
  levelNumber?: number;
  totalLevels?: number;
  allLetters?: LetterData[];
  onSelectLevel?: (letter: LetterData, idx: number) => void;
}

interface Waypoint {
  id: number;
  x: number;
  y: number;
  hit: boolean;
}

export const TracingLevel: React.FC<TracingLevelProps> = ({
  currentLetter,
  progress,
  onTraceCompleted,
  onNext,
  onPrev,
  levelNumber = 1,
  totalLevels = 49,
  allLetters = [],
  onSelectLevel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [activeTrail, setActiveTrail] = useState<{ x: number; y: number }[]>([]);
  const [showLevelPicker, setShowLevelPicker] = useState<boolean>(false);
  const waypointsRef = useRef<Waypoint[]>([]);

  // Generate exact waypoints based on letter glyph contour
  const generateLetterWaypoints = useCallback((size: number): Waypoint[] => {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = size;
    offCanvas.height = size;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return [];

    offCtx.fillStyle = '#000000';
    offCtx.fillRect(0, 0, size, size);

    offCtx.font = `bold ${Math.round(size * 0.62)}px "Baloo Tamma 2", "Noto Sans Kannada", "Kannada Sangam MN", "Nirmala UI", sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#FFFFFF';
    offCtx.fillText(currentLetter.char, size / 2, size / 2 + 10);

    const imgData = offCtx.getImageData(0, 0, size, size);
    const data = imgData.data;

    let minX = size, maxX = 0, minY = size, maxY = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        if (data[idx] > 180) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (minX >= maxX || minY >= maxY) {
      const fallback: Waypoint[] = [];
      const count = 18;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        fallback.push({
          id: i,
          x: size / 2 + Math.cos(angle) * (size * 0.28),
          y: size / 2 + Math.sin(angle) * (size * 0.28),
          hit: false,
        });
      }
      return fallback;
    }

    const cols = 7;
    const rows = 7;
    const cellW = (maxX - minX) / cols;
    const cellH = (maxY - minY) / rows;
    const generated: Waypoint[] = [];
    let idCounter = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const startX = Math.round(minX + c * cellW);
        const startY = Math.round(minY + r * cellH);
        const endX = Math.round(startX + cellW);
        const endY = Math.round(startY + cellH);

        let sumX = 0;
        let sumY = 0;
        let count = 0;

        for (let py = startY; py < endY; py += 2) {
          for (let px = startX; px < endX; px += 2) {
            if (px < size && py < size) {
              const idx = (py * size + px) * 4;
              if (data[idx] > 180) {
                sumX += px;
                sumY += py;
                count++;
              }
            }
          }
        }

        if (count >= 5) {
          generated.push({
            id: idCounter++,
            x: Math.round(sumX / count),
            y: Math.round(sumY / count),
            hit: false,
          });
        }
      }
    }

    if (generated.length < 14) {
      const extra: Waypoint[] = [];
      for (let i = 0; i < generated.length - 1; i++) {
        extra.push({
          id: idCounter++,
          x: Math.round((generated[i].x + generated[i + 1].x) / 2),
          y: Math.round((generated[i].y + generated[i + 1].y) / 2),
          hit: false,
        });
      }
      return [...generated, ...extra];
    }

    return generated;
  }, [currentLetter.char]);

  // Render Background and Pop Art Guide Letter
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Pop Art Warm Paper Sketch Canvas
    ctx.fillStyle = '#FFFDF8';
    ctx.fillRect(0, 0, width, height);

    // Subtle Comic Halftone Dot Grid
    ctx.fillStyle = 'rgba(17, 24, 39, 0.04)';
    const step = 20;
    for (let x = step / 2; x < width; x += step) {
      for (let y = step / 2; y < height; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Outer Sketch Frame
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Render large Kannada Letter as template outline
    ctx.save();
    ctx.font = `bold ${Math.round(height * 0.62)}px "Baloo Tamma 2", "Noto Sans Kannada", "Kannada Sangam MN", "Nirmala UI", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Faint warm pop orange inner fill
    ctx.fillStyle = 'rgba(255, 84, 0, 0.06)';
    ctx.fillText(currentLetter.char, width / 2, height / 2 + 10);

    // Outer soft outline
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'rgba(17, 24, 39, 0.15)';
    ctx.lineWidth = 24;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeText(currentLetter.char, width / 2, height / 2 + 10);

    // Inner bright pop orange guide line
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#FF5400';
    ctx.lineWidth = 4;
    ctx.strokeText(currentLetter.char, width / 2, height / 2 + 10);

    ctx.restore();
  }, [currentLetter.char]);

  // Setup canvas size & waypoints
  useEffect(() => {
    const handleSetup = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, 360);
      canvas.width = size;
      canvas.height = size;

      const pts = generateLetterWaypoints(size);
      setWaypoints(pts);
      waypointsRef.current = pts;

      renderCanvas();
      setIsCompleted(false);
      setActiveTrail([]);
    };

    handleSetup();
    window.addEventListener('resize', handleSetup);
    return () => window.removeEventListener('resize', handleSetup);
  }, [generateLetterWaypoints, renderCanvas]);

  const handleReset = () => {
    playTapSound(progress.soundEnabled);
    renderCanvas();
    const resetPts = waypointsRef.current.map(p => ({ ...p, hit: false }));
    setWaypoints(resetPts);
    waypointsRef.current = resetPts;
    setIsCompleted(false);
    setActiveTrail([]);
  };

  const drawStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    setActiveTrail(prev => [...prev.slice(-10), { x, y }]);

    // High-Contrast Pop Art Glowing Brush Stroke
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Outer pop glow (Electric Orange aura)
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 84, 0, 0.35)';
    ctx.fill();

    // Solid core pop ink stroke
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#FF5400';
    ctx.fill();

    // Center bright yellow core
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFDE59';
    ctx.fill();

    ctx.restore();

    // Check hit against each waypoint
    const currentPts = waypointsRef.current;
    let hitAnyNew = false;
    const hitRadius = 24;

    const updated = currentPts.map(wp => {
      if (wp.hit) return wp;
      const dist = Math.hypot(wp.x - x, wp.y - y);
      if (dist <= hitRadius) {
        hitAnyNew = true;
        return { ...wp, hit: true };
      }
      return wp;
    });

    if (hitAnyNew) {
      waypointsRef.current = updated;
      setWaypoints(updated);
      playTraceTickSound(progress.soundEnabled);

      const total = updated.length;
      const hitCount = updated.filter(w => w.hit).length;
      const requiredHits = Math.max(1, Math.ceil(total * 0.90));

      if (hitCount >= requiredHits && !isCompleted) {
        setIsCompleted(true);
        setIsDrawing(false);
        playSuccessSound(progress.soundEnabled);
        speakKannada(currentLetter.char, progress.soundEnabled);
        onTraceCompleted(currentLetter.id);

        try {
          confetti({
            particleCount: 65,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#FF5400', '#FFC700', '#E5192D', '#00D084'],
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isCompleted) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    drawStroke(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isCompleted) return;
    drawStroke(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      setIsDrawing(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // pointer released
      }
    }
  };

  const hitCount = waypoints.filter(w => w.hit).length;
  const totalCount = Math.max(1, waypoints.length);
  const progressPercent = Math.min(100, Math.round((hitCount / totalCount) * 100));

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 flex flex-col items-center">
      {/* Top Level Navigation Bar */}
      <div className="w-full flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-1.5">
          {onPrev && (
            <button
              onClick={onPrev}
              disabled={levelNumber <= 1}
              className={`pop-btn p-1.5 bg-white text-slate-900 border-2 border-black flex items-center justify-center cursor-pointer ${
                levelNumber <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100'
              }`}
              title="Previous Letter"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>
          )}

          <span className="font-pop text-xs text-white bg-[#FF5400] border-2.5 border-black px-2.5 py-1 rounded-full shadow-[2px_2px_0px_#000] rotate-[-1deg]">
            LVL {levelNumber}/{totalLevels}
          </span>

          <span className="font-display font-extrabold text-slate-800 text-sm sm:text-base">
            <strong className="text-[#FF5400] text-lg font-kannada font-bold">{currentLetter.char}</strong> [{currentLetter.name}]
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {allLetters.length > 0 && onSelectLevel && (
            <button
              onClick={() => setShowLevelPicker(true)}
              className="pop-btn bg-white hover:bg-amber-50 text-slate-900 px-2.5 py-1 text-xs font-pop flex items-center gap-1 cursor-pointer"
              title="Select Level (ಅ to ಳ)"
            >
              <Grid className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">LEVELS</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="pop-btn bg-white hover:bg-amber-50 text-slate-900 px-2.5 py-1 text-xs font-pop flex items-center gap-1 cursor-pointer"
            title="Reset Tracing Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>RESET</span>
          </button>

          <button
            onClick={onNext}
            className="pop-btn p-1.5 bg-[#FFDE59] hover:bg-[#FFE500] text-slate-900 border-2 border-black flex items-center justify-center cursor-pointer"
            title="Next Letter"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Pop Art Clean Progress Bar (No Distracting Stars) */}
      <div className="w-full bg-white border-3 border-black p-3 rounded-2xl shadow-[4px_4px_0px_#111827] flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-2.5">
        <div className="flex items-center gap-2.5 text-left w-full sm:w-auto">
          <div className="w-8 h-8 bg-[#FF5400] text-white border-2 border-black rounded-lg flex items-center justify-center text-sm font-pop font-black shadow-[1.5px_1.5px_0px_#000]">
            ✍️
          </div>
          <div>
            <div className="font-pop text-xs text-slate-900 leading-tight">
              TRACE RUNE PATH
            </div>
            <div className="text-xs text-slate-500 font-display font-semibold">
              Smoothly drag your finger or cursor along the orange line
            </div>
          </div>
        </div>

        {/* Clean Pop Progress Bar */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="w-full sm:w-36 bg-slate-100 h-4 border-2 border-black rounded-full relative overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FFC700] via-[#FF5400] to-[#00D084] rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-pop text-xs text-[#FF5400] min-w-[50px] text-right font-bold">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Interactive Tracing Canvas Box (Clean - No Distracting Star Badges) */}
      <div
        ref={containerRef}
        className="w-full flex justify-center my-1 relative"
      >
        <div className="relative border-3.5 border-black rounded-3xl bg-[#FFFDF8] shadow-[6px_6px_0px_#111827] overflow-hidden touch-none select-none">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="cursor-crosshair block touch-none"
            style={{ touchAction: 'none' }}
          />

          {/* Trace prompt overlay before first stroke */}
          {!isDrawing && !isCompleted && hitCount === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 border-2.5 border-black px-4 py-1.5 rounded-full shadow-[3px_3px_0px_#000] pointer-events-none flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="text-sm">👆</span>
              <span className="font-pop text-xs text-slate-900">
                DRAG FINGER ALONG THE RUNE
              </span>
            </motion.div>
          )}

          {/* Audio Pronunciation Button */}
          <button
            onClick={() => speakKannada(currentLetter.char, progress.soundEnabled)}
            className="absolute top-3 left-3 pop-btn p-2 bg-[#FFC700] hover:bg-[#FFE500] text-slate-900 flex items-center justify-center shadow-[2.5px_2.5px_0px_#000] cursor-pointer"
            title="Hear Pronunciation"
            aria-label="Hear Pronunciation"
          >
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full mt-3 p-4 bg-[#00D084] border-3.5 border-black rounded-2xl shadow-[5px_5px_0px_#111827] text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 bg-white border-2.5 border-black rounded-xl flex items-center justify-center text-xl shadow-[2px_2px_0px_#000]">
              🎉
            </div>
            <div>
              <div className="font-pop text-sm sm:text-base text-slate-950">
                RUNE FORGED! +20 XP
              </div>
              <div className="text-xs font-display font-bold text-slate-900">
                Awesome craftsmanship! You traced &ldquo;{currentLetter.char}&rdquo; cleanly!
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playTapSound(progress.soundEnabled);
              onNext();
            }}
            className="pop-btn px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-950 font-pop text-xs flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000] rotate-[-1deg]"
          >
            <span>NEXT LEVEL ▶</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </motion.div>
      )}

      {/* Companion Character Guidance */}
      <div className="my-2">
        <ExplorerCharacter
          mood={isCompleted ? 'celebrating' : hitCount > 0 ? 'encouraging' : 'idle'}
          speechText={
            isCompleted
              ? `Boom! Excellent work on "${currentLetter.char}"! Tap Next Level to forge the next rune! ⚡`
              : hitCount > 0
              ? 'Great flow! Keep following the orange letter contour! 🎨'
              : `Trace rune "${currentLetter.char}" [${currentLetter.name}]. Follow the orange dashed line!`
          }
          subText={isCompleted ? '+20 XP Earned!' : `Progress: ${progressPercent}%`}
          size="sm"
        />
      </div>

      {/* Level Picker Modal (Jump to any letter from ಅ to ಳ) */}
      <AnimatePresence>
        {showLevelPicker && allLetters.length > 0 && onSelectLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowLevelPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 15 }}
              onClick={e => e.stopPropagation()}
              className="bg-white border-3.5 border-black rounded-3xl p-5 max-w-md w-full max-h-[85vh] flex flex-col shadow-[8px_8px_0px_#111827]"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                <div>
                  <div className="font-pop text-base text-slate-950">
                    SELECT LEVEL (ಅ TO ಳ)
                  </div>
                  <div className="text-xs font-display text-slate-500">
                    Jump to any Kannada rune in the sequence
                  </div>
                </div>
                <button
                  onClick={() => setShowLevelPicker(false)}
                  className="pop-btn px-2.5 py-1 bg-slate-100 text-slate-800 font-pop text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Grid of 49 Letters */}
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 overflow-y-auto py-3 pr-1">
                {allLetters.map((letter, idx) => {
                  const isCurrent = letter.id === currentLetter.id;
                  const isTraced = progress.letterStats[letter.id]?.traced;

                  return (
                    <button
                      key={letter.id}
                      onClick={() => {
                        onSelectLevel(letter, idx);
                        setShowLevelPicker(false);
                      }}
                      className={`h-14 rounded-xl border-2.5 flex flex-col items-center justify-center select-none cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[#FF5400] text-white border-black shadow-[2px_2px_0px_#000] scale-105'
                          : isTraced
                          ? 'bg-[#00D084] text-slate-950 border-black'
                          : 'bg-[#FFF9E6] hover:bg-[#FFE500] text-slate-900 border-black'
                      }`}
                    >
                      <span className="font-kannada font-bold text-xl leading-none">
                        {letter.char}
                      </span>
                      <span className="font-pop text-[8px] uppercase mt-0.5 opacity-80">
                        L{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
