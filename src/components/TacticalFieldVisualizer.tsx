/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Activity, Radio, CloudRain, 
  BrainCircuit, ShieldAlert, Cpu, Eye, AlertTriangle, 
  ChevronRight, Compass, Zap
} from 'lucide-react';
import { INITIAL_FIELD_PLAYERS, TacticalPlayer } from '../data/sportsAiKnowledge';

export type VisualizerMode = 'digital_athlete' | 'rfid' | 'weather_fusion' | 'coaching_pipeline';
export type WeatherType = 'clear' | 'drizzle' | 'heavy_rain' | 'dense_fog';

interface TacticalFieldVisualizerProps {
  activeMode: VisualizerMode;
  onSelectMode: (mode: VisualizerMode) => void;
  onOpenDocTopic: (topicId: string) => void;
}

export const TacticalFieldVisualizer: React.FC<TacticalFieldVisualizerProps> = ({
  activeMode,
  onSelectMode,
  onOpenDocTopic,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playProgress, setPlayProgress] = useState<number>(0.35); // 0 to 1
  const [selectedPlayer, setSelectedPlayer] = useState<TacticalPlayer | null>(INITIAL_FIELD_PLAYERS[3]); // Default to WR #4 Rice
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [deRainActive, setDeRainActive] = useState<boolean>(true);
  const [sensorFusionEnabled, setSensorFusionEnabled] = useState<boolean>(true);
  const [showVoronoi, setShowVoronoi] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Play animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayProgress((prev) => {
        const next = prev + 0.006 * simulationSpeed;
        return next > 1 ? 0 : next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, simulationSpeed]);

  // Compute interpolated positions for the 22 players based on playProgress
  const currentPlayers = INITIAL_FIELD_PLAYERS.map((p) => {
    // Non-linear trajectory simulation (cut move at t=0.45)
    let t = playProgress;
    let currX = p.x + (p.targetX - p.x) * t;
    let currY = p.y + (p.targetY - p.y) * t;

    // Add lateral juke for skill positions around mid-play
    if (p.role === 'WR' || p.role === 'RB' || p.role === 'CB') {
      const juke = Math.sin(t * Math.PI * 2) * (p.id % 2 === 0 ? 1.8 : -1.8);
      currY += juke * (1 - Math.abs(t - 0.5) * 2);
    }

    // Dynamic speed variation
    const currentSpeed = (p.speed * (0.6 + 0.8 * Math.sin(t * Math.PI))).toFixed(1);

    // Weather impact on visual tracking confidence
    let visualConfidence = p.detectionConfidence;
    if (weather === 'heavy_rain' && !deRainActive) {
      visualConfidence = Math.max(0.38, p.detectionConfidence - 0.45 + (p.id % 3) * 0.1);
    } else if (weather === 'dense_fog' && !deRainActive) {
      visualConfidence = Math.max(0.42, p.detectionConfidence - 0.40);
    } else if (weather === 'drizzle' && !deRainActive) {
      visualConfidence = Math.max(0.68, p.detectionConfidence - 0.22);
    }

    return {
      ...p,
      x: currX,
      y: currY,
      currentSpeed: Number(currentSpeed),
      visualConfidence: Number(visualConfidence.toFixed(2)),
    };
  });

  // Calculate field dimensions (scale: 100 yards wide x 53.3 yards high)
  // We'll render an SVG viewport of 1000 x 533
  const yardToSvgX = (yd: number) => yd * 10;
  const yardToSvgY = (yd: number) => yd * 10;

  // Stadium RFID receivers along the perimeter
  const rfidReceivers = [
    { id: 'REC-01', x: 100, y: 15, name: 'North Catwalk W' },
    { id: 'REC-02', x: 350, y: 15, name: 'North Catwalk Mid-W' },
    { id: 'REC-03', x: 650, y: 15, name: 'North Catwalk Mid-E' },
    { id: 'REC-04', x: 900, y: 15, name: 'North Catwalk E' },
    { id: 'REC-05', x: 100, y: 518, name: 'South Catwalk W' },
    { id: 'REC-06', x: 350, y: 518, name: 'South Catwalk Mid-W' },
    { id: 'REC-07', x: 650, y: 518, name: 'South Catwalk Mid-E' },
    { id: 'REC-08', x: 900, y: 518, name: 'South Catwalk E' },
  ];

  const activeDocId = 
    activeMode === 'digital_athlete' ? 'doc_001' :
    activeMode === 'rfid' ? 'doc_002' :
    activeMode === 'weather_fusion' ? 'doc_003' : 'doc_004';

  return (
    <div className="flex flex-col gap-4">
      {/* Visualizer Control Ribbon */}
      <div className="bg-[#0e131f] border border-slate-800/80 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
        {/* Lens Mode Selector */}
        <div className="flex items-center gap-1.5 bg-[#080b12] p-1 border border-slate-800 rounded-md">
          <button
            onClick={() => onSelectMode('digital_athlete')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono-code transition-all ${
              activeMode === 'digital_athlete'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-600/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>01 · Digital Athlete</span>
          </button>

          <button
            onClick={() => onSelectMode('rfid')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono-code transition-all ${
              activeMode === 'rfid'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-600/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>02 · RFID Mesh</span>
          </button>

          <button
            onClick={() => onSelectMode('weather_fusion')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono-code transition-all ${
              activeMode === 'weather_fusion'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-600/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-amber-400" />
            <span>03 · Weather & Fusion</span>
          </button>

          <button
            onClick={() => onSelectMode('coaching_pipeline')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono-code transition-all ${
              activeMode === 'coaching_pipeline'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
            <span>04 · AI Coaching Vision</span>
          </button>
        </div>

        {/* Playback & Telemetry Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#080b12] border border-slate-800 px-2 py-1 rounded">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
              className="p-1 hover:text-cyan-400 text-slate-300 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setPlayProgress(0)}
              aria-label="Reset simulation playhead"
              className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono-code text-slate-400 ml-1">
              T+{((playProgress * 4.2)).toFixed(1)}s
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono-code text-slate-400">
            <span className="text-slate-500">SPEED</span>
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  simulationSpeed === spd
                    ? 'bg-slate-700 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => onOpenDocTopic(activeDocId)}
            className="flex items-center gap-1.5 text-xs font-mono-code text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 border border-cyan-800/40 px-2.5 py-1.5 rounded transition-colors"
          >
            <span>DOC SPECS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode-Specific Sub-Controls Bar */}
      {activeMode === 'weather_fusion' && (
        <div className="bg-[#101625] border border-amber-900/40 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5" />
              CONDITIONS:
            </span>
            {(['clear', 'drizzle', 'heavy_rain', 'dense_fog'] as WeatherType[]).map((w) => (
              <button
                key={w}
                onClick={() => setWeather(w)}
                className={`px-2 py-1 rounded capitalize ${
                  weather === w
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                }`}
              >
                {w.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deRainActive}
                onChange={(e) => setDeRainActive(e.target.checked)}
                className="accent-amber-400"
              />
              <span className="text-slate-300">DeRainNet AI Filtering</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sensorFusionEnabled}
                onChange={(e) => setSensorFusionEnabled(e.target.checked)}
                className="accent-cyan-400"
              />
              <span className="text-slate-300">RFID + Video Fusion (Kalman)</span>
            </label>
          </div>
        </div>
      )}

      {activeMode === 'coaching_pipeline' && (
        <div className="bg-[#0b1616] border border-emerald-900/40 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5" />
              FORMATION DETECTED:
            </span>
            <span className="text-slate-200 font-semibold">11 Personnel · Shotgun Trey Right</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-300 font-semibold">DEFENSE: Cover 3 Match (1-High Safety)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVoronoi(!showVoronoi)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                showVoronoi
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Voronoi Pitch Control {showVoronoi ? 'ON' : 'OFF'}
            </button>
            <span className="text-slate-400">YOLOv10 Latency: <strong className="text-emerald-400">8.9ms</strong></span>
          </div>
        </div>
      )}

      {activeMode === 'rfid' && (
        <div className="bg-[#09151e] border border-cyan-900/40 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
          <div className="flex items-center gap-4">
            <span className="text-cyan-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              RADIO FREQ GRID:
            </span>
            <span className="text-slate-300">UWB 6.49 GHz / 20 Hz Chirps</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Active Tags: <strong>22/22 Players + Ball</strong></span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">TDOA Accuracy: <strong className="text-cyan-300">± 12 cm</strong></span>
          </div>
          <div className="text-slate-400">
            Reader Trilateration Latency: <span className="text-cyan-300">3.8 ms</span>
          </div>
        </div>
      )}

      {activeMode === 'digital_athlete' && (
        <div className="bg-[#190d13] border border-rose-900/40 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
          <div className="flex items-center gap-4">
            <span className="text-rose-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              BIOMECHANICAL RISK MONITOR:
            </span>
            <span className="text-slate-300">High Risk Flags: <strong className="text-rose-400">1 Player (#4 R. Rice)</strong></span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Moderate: <strong className="text-amber-400">2 Players</strong></span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Optimal (ACWR 0.8-1.3): <strong className="text-emerald-400">19 Players</strong></span>
          </div>
          <div className="text-slate-400">
            Click any player node to view 3D joint kinetics & fatigue forecast.
          </div>
        </div>
      )}

      {/* Main Pitch & Tactical Telemetry Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Pitch Canvas (3 cols) */}
        <div className="lg:col-span-3 bg-[#080d16] border border-slate-800 rounded-lg overflow-hidden relative shadow-2xl">
          {/* Weather Overlay FX */}
          {weather === 'heavy_rain' && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <div 
                className="w-full h-full opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-black"
                style={{
                  backgroundImage: 'repeating-linear-gradient(105deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 2px, transparent 14px)',
                  animation: 'pulse 1.2s infinite'
                }}
              />
              {!deRainActive && (
                <div className="absolute top-2 left-2 bg-amber-950/80 border border-amber-600/60 text-amber-200 text-[10px] font-mono-code px-2 py-0.5 rounded">
                  ⚠️ RAW VIDEO NOISE: Rain droplets causing bounding box flickering
                </div>
              )}
            </div>
          )}

          {weather === 'dense_fog' && (
            <div className="absolute inset-0 pointer-events-none z-10 bg-slate-900/50 backdrop-blur-[1px] flex items-start p-2">
              {!deRainActive && (
                <span className="bg-slate-900/90 text-slate-300 border border-slate-700 text-[10px] font-mono-code px-2 py-0.5 rounded">
                  ⚠️ OPTICAL CONTRAST DEGRADED -58%
                </span>
              )}
            </div>
          )}

          {/* SVG Pitch Display */}
          <div className="w-full aspect-[1000/533] min-h-[380px] relative select-none">
            <svg
              viewBox="0 0 1000 533"
              className="w-full h-full block"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Field Base Turf */}
              <rect x="0" y="0" width="1000" height="533" fill="#091410" />

              {/* End zones */}
              <rect x="0" y="0" width="100" height="533" fill="#0c1d18" stroke="#16382c" strokeWidth="2" />
              <text x="50" y="275" fill="#1b4536" fontSize="24" fontFamily="Chakra Petch" fontWeight="bold" textAnchor="middle" transform="rotate(-90 50 275)">
                END ZONE
              </text>

              <rect x="900" y="0" width="100" height="533" fill="#0c1d18" stroke="#16382c" strokeWidth="2" />
              <text x="950" y="275" fill="#1b4536" fontSize="24" fontFamily="Chakra Petch" fontWeight="bold" textAnchor="middle" transform="rotate(90 950 275)">
                END ZONE
              </text>

              {/* Playing Field Yard Lines (Every 10 yards: 100 to 900) */}
              {[10, 20, 30, 40, 50, 40, 30, 20, 10].map((yardNum, i) => {
                const x = 100 + (i + 1) * 80;
                return (
                  <g key={`yardline-${i}`}>
                    <line x1={x} y1="0" x2={x} y2="533" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    {/* Numbers top and bottom */}
                    <text x={x} y="45" fill="rgba(255,255,255,0.25)" fontSize="16" fontFamily="Chakra Petch" textAnchor="middle">
                      {yardNum}
                    </text>
                    <text x={x} y="495" fill="rgba(255,255,255,0.25)" fontSize="16" fontFamily="Chakra Petch" textAnchor="middle">
                      {yardNum}
                    </text>
                  </g>
                );
              })}

              {/* Every 5-yard subdivision line */}
              {[...Array(17)].map((_, i) => {
                const x = 140 + i * 40;
                return (
                  <line
                    key={`five-yard-${i}`}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="533"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Hash marks (NFL: 70 ft 9 in from sidelines = ~215px & 318px in our 533 scale) */}
              {[...Array(80)].map((_, i) => {
                const x = 100 + i * 10;
                return (
                  <g key={`hash-${i}`}>
                    <line x1={x} y1="215" x2={x + 3} y2="215" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <line x1={x} y1="318" x2={x + 3} y2="318" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <line x1={x} y1="10" x2={x + 3} y2="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <line x1={x} y1="523" x2={x + 3} y2="523" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  </g>
                );
              })}

              {/* Line of Scrimmage (33 yards) & First Down Line (43 yards) */}
              <line x1={yardToSvgX(33)} y1="0" x2={yardToSvgX(33)} y2="533" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="6 3" />
              <line x1={yardToSvgX(43)} y1="0" x2={yardToSvgX(43)} y2="533" stroke="#eab308" strokeWidth="2.5" strokeOpacity="0.8" />
              <text x={yardToSvgX(33) - 6} y="20" fill="#60a5fa" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">LOS 33 YD</text>
              <text x={yardToSvgX(43) + 6} y="20" fill="#facc15" fontSize="10" fontFamily="JetBrains Mono">LINE TO GAIN</text>

              {/* RFID Receivers and Radio Signal Cones (in RFID mode) */}
              {activeMode === 'rfid' && (
                <g>
                  {rfidReceivers.map((rec) => (
                    <g key={rec.id}>
                      {/* Radio transmission cone */}
                      <circle
                        cx={rec.x}
                        cy={rec.y}
                        r="180"
                        fill="url(#rfidGlow)"
                        opacity="0.15"
                      />
                      <line
                        x1={rec.x}
                        y1={rec.y}
                        x2={selectedPlayer ? yardToSvgX(selectedPlayer.x) : 330}
                        y2={selectedPlayer ? yardToSvgY(selectedPlayer.y) : 266}
                        stroke="#06b6d4"
                        strokeWidth="0.8"
                        strokeDasharray="3 3"
                        opacity="0.4"
                      />
                      <rect
                        x={rec.x - 7}
                        y={rec.y - 7}
                        width="14"
                        height="14"
                        fill="#083344"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        rx="2"
                      />
                      <circle cx={rec.x} cy={rec.y} r="2.5" fill="#22d3ee" />
                      <text x={rec.x} y={rec.y > 200 ? rec.y + 16 : rec.y - 10} fill="#67e8f9" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                        {rec.id}
                      </text>
                    </g>
                  ))}
                  <defs>
                    <radialGradient id="rfidGlow">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </g>
              )}

              {/* Voronoi / Pitch Control approximation (in Coaching Pipeline mode) */}
              {activeMode === 'coaching_pipeline' && showVoronoi && (
                <g opacity="0.18">
                  {currentPlayers.slice(0, 10).map((p, idx) => (
                    <circle
                      key={`voronoi-${idx}`}
                      cx={yardToSvgX(p.x)}
                      cy={yardToSvgY(p.y)}
                      r="65"
                      fill={p.team === 'offense' ? '#06b6d4' : '#f43f5e'}
                    />
                  ))}
                </g>
              )}

              {/* Route Tracing Lines for Offensive Play */}
              {activeMode === 'coaching_pipeline' && (
                <g>
                  {/* WR #4 Route */}
                  <path
                    d={`M ${yardToSvgX(33)} ${yardToSvgY(12)} Q ${yardToSvgX(44)} ${yardToSvgY(11)} ${yardToSvgX(52)} ${yardToSvgY(10)}`}
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    fill="none"
                    opacity="0.7"
                  />
                  {/* WR #84 Route */}
                  <path
                    d={`M ${yardToSvgX(33)} ${yardToSvgY(44)} L ${yardToSvgX(48)} ${yardToSvgY(44)} L ${yardToSvgX(58)} ${yardToSvgY(42)}`}
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    fill="none"
                    opacity="0.7"
                  />
                  {/* TE #87 Seam Route */}
                  <path
                    d={`M ${yardToSvgX(33)} ${yardToSvgY(31)} C ${yardToSvgX(37)} ${yardToSvgY(31)}, ${yardToSvgX(40)} ${yardToSvgY(28)}, ${yardToSvgX(46)} ${yardToSvgY(26)}`}
                    stroke="#34d399"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    fill="none"
                    opacity="0.85"
                  />
                  <text x={yardToSvgX(47)} y={yardToSvgY(25)} fill="#34d399" fontSize="10" fontFamily="JetBrains Mono">
                    SEAM CUT (SEPARATION: 3.8 YD)
                  </text>
                </g>
              )}

              {/* 22 Players Rendering */}
              {currentPlayers.map((player) => {
                const px = yardToSvgX(player.x);
                const py = yardToSvgY(player.y);
                const isSelected = selectedPlayer?.id === player.id;
                const isOffense = player.team === 'offense';

                // Determine styling based on active mode
                let ringColor = isOffense ? '#06b6d4' : '#f43f5e';
                let fillColor = isOffense ? '#083344' : '#4c0519';

                if (activeMode === 'digital_athlete') {
                  if (player.injuryRiskScore === 'high') {
                    ringColor = '#ef4444';
                    fillColor = '#450a0a';
                  } else if (player.injuryRiskScore === 'moderate') {
                    ringColor = '#f59e0b';
                    fillColor = '#451a03';
                  } else {
                    ringColor = '#10b981';
                    fillColor = '#064e3b';
                  }
                }

                // If weather is bad, and de-rain is OFF, and sensor fusion is OFF -> visual tracking drops!
                const trackingDropped = 
                  (weather === 'heavy_rain' || weather === 'dense_fog') && 
                  !deRainActive && 
                  !sensorFusionEnabled && 
                  player.visualConfidence < 0.55;

                return (
                  <g
                    key={player.id}
                    className="cursor-pointer transition-all duration-75"
                    onClick={() => setSelectedPlayer(player)}
                  >
                    {/* Pulsing selection aura */}
                    {isSelected && (
                      <circle
                        cx={px}
                        cy={py}
                        r="24"
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="animate-spin"
                        style={{ transformOrigin: `${px}px ${py}px` }}
                      />
                    )}

                    {/* Mode 4: YOLO Bounding Box */}
                    {activeMode === 'coaching_pipeline' && !trackingDropped && (
                      <g>
                        <rect
                          x={px - 14}
                          y={py - 16}
                          width="28"
                          height="32"
                          fill="none"
                          stroke={isOffense ? '#06b6d4' : '#f43f5e'}
                          strokeWidth="1.2"
                          opacity="0.85"
                        />
                        <rect
                          x={px - 14}
                          y={py - 26}
                          width="28"
                          height="10"
                          fill={isOffense ? '#083344' : '#4c0519'}
                          opacity="0.9"
                        />
                        <text
                          x={px}
                          y={py - 18}
                          fill="#ffffff"
                          fontSize="7"
                          fontFamily="JetBrains Mono"
                          textAnchor="middle"
                        >
                          {player.role} {player.visualConfidence}
                        </text>
                      </g>
                    )}

                    {/* Mode 1: Skeletal Pose Keypoints Overlay on Selected Player */}
                    {activeMode === 'digital_athlete' && isSelected && (
                      <g stroke="#38bdf8" strokeWidth="1.2" opacity="0.9">
                        {/* Spine */}
                        <line x1={px} y1={py - 10} x2={px} y2={py + 5} />
                        {/* Arms / Shoulders */}
                        <line x1={px - 8} y1={py - 4} x2={px + 8} y2={py - 4} />
                        <line x1={px - 8} y1={py - 4} x2={px - 12} y2={py + 2} />
                        <line x1={px + 8} y1={py - 4} x2={px + 12} y2={py + 2} />
                        {/* Pelvis & Legs */}
                        <line x1={px} y1={py + 5} x2={px - 6} y2={py + 14} />
                        <line x1={px} y1={py + 5} x2={px + 6} y2={py + 14} />
                        {/* Joint nodes */}
                        <circle cx={px} cy={py - 12} r="2.5" fill="#38bdf8" />
                        <circle cx={px - 8} cy={py - 4} r="1.5" fill="#38bdf8" />
                        <circle cx={px + 8} cy={py - 4} r="1.5" fill="#38bdf8" />
                        <circle cx={px - 6} cy={py + 14} r="1.5" fill="#f43f5e" />
                        <circle cx={px + 6} cy={py + 14} r="1.5" fill="#10b981" />
                      </g>
                    )}

                    {/* Mode 2: RFID Chirp Wave Ripple */}
                    {activeMode === 'rfid' && (
                      <circle
                        cx={px}
                        cy={py}
                        r="18"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="0.8"
                        opacity="0.4"
                      />
                    )}

                    {/* Main Player Circle */}
                    <circle
                      cx={px}
                      cy={py}
                      r={trackingDropped ? 8 : 11}
                      fill={trackingDropped ? '#1e293b' : fillColor}
                      stroke={trackingDropped ? '#64748b' : ringColor}
                      strokeWidth={isSelected ? '2.5' : '1.8'}
                      strokeDasharray={trackingDropped ? '2 2' : 'none'}
                    />

                    {/* Jersey Number */}
                    <text
                      x={px}
                      y={py + 3.5}
                      fill={trackingDropped ? '#94a3b8' : '#ffffff'}
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {player.jersey}
                    </text>

                    {/* Warning badge if tracking lost or high strain */}
                    {trackingDropped && (
                      <text x={px} y={py - 12} fill="#ef4444" fontSize="10" textAnchor="middle">
                        ⚠️
                      </text>
                    )}

                    {activeMode === 'digital_athlete' && player.injuryRiskScore === 'high' && (
                      <circle cx={px + 8} cy={py - 8} r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Pitch Legend & Real-Time Stats */}
          <div className="bg-[#0b101a] border-t border-slate-800 p-2.5 px-4 flex flex-wrap items-center justify-between text-xs font-mono-code text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
                OFFENSE (11)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                DEFENSE (11)
              </span>
              {activeMode === 'digital_athlete' && (
                <>
                  <span className="text-slate-600">|</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    LOW STRAIN
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                    MODERATE
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                    HIGH RISK
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span>ACTIVE PLAY: <strong>Gun Trips Right - PA Dagger</strong></span>
              <span className="text-slate-600">|</span>
              <span>SAMPLING: <strong className="text-cyan-400">20Hz RFID / 60fps CV</strong></span>
            </div>
          </div>
        </div>

        {/* Selected Player & System Inspection Card (1 col) */}
        <div className="bg-[#0e1320] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          {selectedPlayer ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-mono-code font-bold ${
                      selectedPlayer.team === 'offense' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      #{selectedPlayer.jersey} · {selectedPlayer.role}
                    </span>
                    <span className="text-sm font-display font-semibold text-slate-100">
                      {selectedPlayer.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 capitalize font-mono-code">
                    {selectedPlayer.team} · Pos: ({selectedPlayer.x.toFixed(1)} yd, {selectedPlayer.y.toFixed(1)} yd)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-mono-code font-bold text-cyan-400">
                    {selectedPlayer.speed} <span className="text-xs text-slate-400 font-normal">mph</span>
                  </div>
                  <div className="text-[10px] font-mono-code text-slate-400">
                    Accel: {selectedPlayer.accel > 0 ? `+${selectedPlayer.accel}` : selectedPlayer.accel} m/s²
                  </div>
                </div>
              </div>

              {/* Mode-Relevant Metric Breakdown */}
              {activeMode === 'digital_athlete' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono-code">Injury Risk Status:</span>
                    <span className={`font-mono-code uppercase font-semibold ${
                      selectedPlayer.injuryRiskScore === 'high' ? 'text-rose-400' :
                      selectedPlayer.injuryRiskScore === 'moderate' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {selectedPlayer.injuryRiskScore} Risk
                    </span>
                  </div>

                  {/* ACWR Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono-code">
                      <span className="text-slate-400">Acute:Chronic Workload (ACWR)</span>
                      <span className="text-slate-200 font-bold">{selectedPlayer.acwr}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: '60%' }} title="Sweet spot 0.8-1.3" />
                      <div className="bg-amber-500 h-full" style={{ width: '20%' }} title="Elevated 1.3-1.5" />
                      <div className="bg-rose-500 h-full" style={{ width: '20%' }} title="Danger zone > 1.5" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono-code text-slate-500">
                      <span>0.8 Under</span>
                      <span>1.0 Optimal</span>
                      <span>1.5+ Danger</span>
                    </div>
                  </div>

                  {/* Fatigue meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono-code">
                      <span className="text-slate-400">Cumulative Game Fatigue</span>
                      <span className="text-slate-200">{selectedPlayer.fatigueIndex}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${selectedPlayer.fatigueIndex > 70 ? 'bg-rose-500' : selectedPlayer.fatigueIndex > 50 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                        style={{ width: `${selectedPlayer.fatigueIndex}%` }}
                      />
                    </div>
                  </div>

                  {selectedPlayer.poseRiskFlag && (
                    <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded text-xs text-rose-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-mono-code text-[11px]">KINEMATIC ALERT</strong>
                        <span className="text-[11px] leading-tight">{selectedPlayer.poseRiskFlag}</span>
                      </div>
                    </div>
                  )}

                  {/* Wearable Biomechanical Sensors Breakdown if available */}
                  {selectedPlayer.biomechanics && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80 font-mono-code text-[11px]">
                      <span className="text-cyan-400 font-semibold block text-[10px]">
                        WEARABLE SENSORS (IMU + INSOLE FORCE CELLS):
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 bg-[#090e18] p-2 rounded border border-slate-800">
                        <div>
                          <span className="text-slate-500 block text-[9px]">KNEE VALGUS:</span>
                          <span className={`font-bold ${selectedPlayer.biomechanics.jointAngles.kneeValgusDeg > 12 ? 'text-rose-400' : 'text-slate-200'}`}>
                            {selectedPlayer.biomechanics.jointAngles.kneeValgusDeg}°
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px]">PEAK GRF:</span>
                          <span className={`font-bold ${selectedPlayer.biomechanics.impactForces.peakGroundReactionForceBW > 4.5 ? 'text-rose-400' : 'text-slate-200'}`}>
                            {selectedPlayer.biomechanics.impactForces.peakGroundReactionForceBW}x BW
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px]">HIP ROM DEFICIT:</span>
                          <span className="text-slate-300">
                            {selectedPlayer.biomechanics.rangeOfMotion.hipExtensionDeficitPct}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px]">LIMB ASYMMETRY:</span>
                          <span className={`font-bold ${selectedPlayer.biomechanics.impactForces.limbAsymmetryPct > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {selectedPlayer.biomechanics.impactForces.limbAsymmetryPct}%
                          </span>
                        </div>
                      </div>

                      <div className="p-2 bg-emerald-950/20 border border-emerald-900/40 rounded text-[10px] text-slate-300">
                        <strong className="text-emerald-400 block mb-0.5">PERFORMANCE INTERVENTION:</strong>
                        {selectedPlayer.biomechanics.performanceRecommendations.inGameAction}
                      </div>
                    </div>
                  )}

                  <div className="p-2 bg-slate-900/80 rounded border border-slate-800 text-[11px] text-slate-400">
                    <strong className="text-slate-200 block mb-0.5">Digital Athlete Action:</strong>
                    {selectedPlayer.biomechanics?.performanceRecommendations.trainingAdjustment || "Recommend rest rotation for next 3 snaps to avoid hamstring overload during deceleration cuts."}
                  </div>
                </div>
              )}

              {activeMode === 'rfid' && (
                <div className="space-y-2.5 text-xs font-mono-code">
                  <div className="p-2.5 bg-cyan-950/30 border border-cyan-800/40 rounded space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tag Architecture:</span>
                      <span className="text-cyan-300">Zebra UWB Transceiver</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Placement:</span>
                      <span className="text-slate-200">L/R Shoulder Pads</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">RF Signal Strength:</span>
                      <span className="text-emerald-400">{selectedPlayer.rfidSignalDb} dBm (Strong)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Packet Transmission:</span>
                      <span className="text-slate-200">20 pings / sec (50ms)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">TDOA Accuracy:</span>
                      <span className="text-cyan-300">± 11.4 cm</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    RFID tags embedded in shoulder pads bypass line-of-sight occlusion, maintaining continuous player coordinates even under heavy line-of-scrimmage pile-ups.
                  </p>
                </div>
              )}

              {activeMode === 'weather_fusion' && (
                <div className="space-y-2.5 text-xs font-mono-code">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Optical CV Confidence:</span>
                      <span className={`font-bold ${
                        selectedPlayer.detectionConfidence > 0.8 ? 'text-emerald-400' :
                        selectedPlayer.detectionConfidence > 0.6 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {(selectedPlayer.detectionConfidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">RFID Tag Availability:</span>
                      <span className="text-cyan-400">100% (Immune to rain)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fused State Uncertainty:</span>
                      <span className="text-slate-200">σ = 0.08 m (Kalman Filter)</span>
                    </div>
                  </div>

                  <div className="p-2 bg-amber-950/30 border border-amber-800/40 rounded text-[11px] text-amber-200 leading-relaxed">
                    <strong>Sensor Fusion Benefit:</strong> If rain droplets blur the camera lens, the system seamlessly anchors the bounding box to the RFID RF chirp coordinates without dropping track ID.
                  </div>
                </div>
              )}

              {activeMode === 'coaching_pipeline' && (
                <div className="space-y-2.5 text-xs font-mono-code">
                  <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/40 rounded space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">YOLO Model:</span>
                      <span className="text-emerald-300">YOLOv10-X Tactical</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Separation Delta:</span>
                      <span className="text-slate-200 font-bold">
                        {selectedPlayer.role === 'WR' || selectedPlayer.role === 'TE' ? '3.8 yards (Open)' : '1.2 yards (Contested)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Historical Success Rate:</span>
                      <span className="text-emerald-400">68.4% vs Cover 3</span>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300">
                    <strong className="text-emerald-400 block mb-0.5">AI Coaching Tip:</strong>
                    Exploiting weak seam leverage between #32 Bolton and #6 Cook. Throw window is open for 1.2s.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 font-mono-code text-xs">
              Select any player on the field to inspect real-time sensor metrics and AI intelligence.
            </div>
          )}

          {/* Bottom Action Button */}
          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={() => onOpenDocTopic(activeDocId)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explore Technical Architecture</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
