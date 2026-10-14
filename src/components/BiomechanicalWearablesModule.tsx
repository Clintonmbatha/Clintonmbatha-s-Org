/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Activity, ShieldAlert, Zap, TrendingUp, Sliders, 
  RotateCcw, Sparkles, AlertTriangle, CheckCircle2, ChevronRight,
  Info, Compass, Clock, Dumbbell
} from 'lucide-react';
import { INITIAL_FIELD_PLAYERS } from '../data/sportsAiKnowledge';

interface SnapDataPoint {
  snap: number;
  valgusDeg: number;
  flexionDeg: number;
  grfBW: number;
  decelImpulse: number;
  romDeficitPct: number;
  aclRiskPct: number;
  hamstringRiskPct: number;
  compositeRiskPct: number;
  riskLevel: 'low' | 'moderate' | 'critical';
  fatigueIndex: number;
}

export const BiomechanicalWearablesModule: React.FC = () => {
  // Preset athletes
  const telemetryPlayers = INITIAL_FIELD_PLAYERS.filter(p => p.biomechanics !== undefined);
  const [selectedAthleteId, setSelectedAthleteId] = useState<number>(4); // Default to WR #4 Rashee Rice

  // Base Sensor Inputs
  // 1. Joint Angles
  const [kneeValgus, setKneeValgus] = useState<number>(14.8); // degrees (optimal < 10°)
  const [kneeFlexion, setKneeFlexion] = useState<number>(28); // degrees (landing plant)
  const [ankleDorsiflexion, setAnkleDorsiflexion] = useState<number>(15); // degrees
  const [hipRotation, setHipRotation] = useState<number>(22); // degrees

  // 2. Impact Forces
  const [grfBW, setGrfBW] = useState<number>(5.4); // Multiples of Body Weight (BW)
  const [decelImpulse, setDecelImpulse] = useState<number>(980); // N*s
  const [collisionG, setCollisionG] = useState<number>(24.2); // G-force
  const [limbAsymmetry, setLimbAsymmetry] = useState<number>(14.6); // % difference L vs R

  // 3. Range-of-Motion (ROM)
  const [kneeFlexionArc, setKneeFlexionArc] = useState<number>(124); // degrees (norm 135-145°)
  const [hipRomDeficit, setHipRomDeficit] = useState<number>(-14.2); // % deficit
  const [thoracicRotation, setThoracicRotation] = useState<number>(36); // degrees

  // Fatigue compounding toggle
  const [fatigueCompounding, setFatigueCompounding] = useState<boolean>(true);
  const [hoveredSnap, setHoveredSnap] = useState<number | null>(null);
  const [activeSnapView, setActiveSnapView] = useState<number>(7); // Snap 7 selected

  // When athlete is changed, update baseline sensor inputs
  const handleSelectAthlete = (id: number) => {
    setSelectedAthleteId(id);
    const p = telemetryPlayers.find(pl => pl.id === id);
    if (p && p.biomechanics) {
      setKneeValgus(p.biomechanics.jointAngles.kneeValgusDeg);
      setKneeFlexion(p.biomechanics.jointAngles.kneeFlexionDeg);
      setAnkleDorsiflexion(p.biomechanics.jointAngles.ankleDorsiflexionDeg);
      setGrfBW(p.biomechanics.impactForces.peakGroundReactionForceBW);
      setDecelImpulse(p.biomechanics.impactForces.decelerationImpulseNs);
      setCollisionG(p.biomechanics.impactForces.impactCollisionG);
      setLimbAsymmetry(p.biomechanics.impactForces.limbAsymmetryPct);
      setKneeFlexionArc(p.biomechanics.rangeOfMotion.activeKneeFlexionArc);
      setHipRomDeficit(p.biomechanics.rangeOfMotion.hipExtensionDeficitPct);
      setThoracicRotation(p.biomechanics.rangeOfMotion.thoracicRotationDeg);
    }
  };

  // Generate simulated 10-snap trend series based on sensor inputs
  const trendSeries: SnapDataPoint[] = useMemo(() => {
    const series: SnapDataPoint[] = [];

    for (let snap = 1; snap <= 10; snap++) {
      // Fatigue factor accumulates progressively if compounding is ON
      const fatigueFactor = fatigueCompounding ? (snap - 1) * 0.08 : 0;
      
      // Valgus drifts wider as neuromuscular glute medius fatigues
      const curValgus = Number((kneeValgus * (1 + fatigueFactor * 0.65) + Math.sin(snap) * 0.6).toFixed(1));
      
      // Knee flexion plant stiffens (less knee bend on deceleration when tired)
      const curFlexion = Math.max(16, Number((kneeFlexion * (1 - fatigueFactor * 0.35) - Math.cos(snap) * 1.2).toFixed(1)));
      
      // GRF impact increases as landing compliance decreases
      const curGrf = Number((grfBW * (1 + fatigueFactor * 0.3) + (snap % 2 === 0 ? 0.3 : -0.2)).toFixed(1));
      
      // Deceleration impulse
      const curDecel = Math.round(decelImpulse * (1 + fatigueFactor * 0.25) + (snap * 15));
      
      // ROM deficit deepens as hamstrings tighten
      const curRomDeficit = Number((hipRomDeficit * (1 + fatigueFactor * 0.5) - (snap * 0.4)).toFixed(1));

      // Calculate ACL and Hamstring risk probabilities (0 - 100%)
      const aclRisk = Math.min(98, Math.max(4, Math.round(
        (curValgus / 16) * 45 +
        (curGrf / 6.0) * 35 +
        (curFlexion < 28 ? 15 : 0) +
        (limbAsymmetry / 20) * 10
      )));

      const hamstringRisk = Math.min(96, Math.max(6, Math.round(
        (Math.abs(curRomDeficit) / 16) * 42 +
        (curDecel / 1100) * 38 +
        (fatigueFactor * 30)
      )));

      const composite = Math.round((aclRisk * 0.55) + (hamstringRisk * 0.45));
      const riskLevel: 'low' | 'moderate' | 'critical' = 
        composite >= 70 ? 'critical' : composite >= 45 ? 'moderate' : 'low';

      series.push({
        snap,
        valgusDeg: curValgus,
        flexionDeg: curFlexion,
        grfBW: curGrf,
        decelImpulse: curDecel,
        romDeficitPct: curRomDeficit,
        aclRiskPct: aclRisk,
        hamstringRiskPct: hamstringRisk,
        compositeRiskPct: composite,
        riskLevel,
        fatigueIndex: Math.min(100, Math.round(30 + fatigueFactor * 90 + snap * 4)),
      });
    }

    return series;
  }, [kneeValgus, kneeFlexion, grfBW, decelImpulse, hipRomDeficit, limbAsymmetry, fatigueCompounding]);

  // Selected snap data point
  const currentSnapData = trendSeries.find(s => s.snap === activeSnapView) || trendSeries[6];

  // SVG Chart bounds
  const chartWidth = 640;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 20;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;

  // Coordinate mapper for Snap (1..10) to SVG X
  const getX = (snap: number) => paddingX + ((snap - 1) / 9) * plotWidth;

  // Coordinate mapper for percentage (0..100) to SVG Y
  const getY = (val: number, maxVal = 100) => paddingY + plotHeight - (val / maxVal) * plotHeight;

  // SVG Path generator for trend lines
  const createSvgPath = (points: { snap: number; val: number }[], maxVal = 100) => {
    return points.reduce((path, pt, idx) => {
      const x = getX(pt.snap);
      const y = getY(pt.val, maxVal);
      return idx === 0 ? `M ${x} ${y}` : `${path} L ${x} ${y}`;
    }, '');
  };

  const aclRiskPath = createSvgPath(trendSeries.map(s => ({ snap: s.snap, val: s.aclRiskPct })));
  const hamstringRiskPath = createSvgPath(trendSeries.map(s => ({ snap: s.snap, val: s.hamstringRiskPct })));
  const compositeRiskPath = createSvgPath(trendSeries.map(s => ({ snap: s.snap, val: s.compositeRiskPct })));

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-[#121622] border border-rose-900/50 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-rose-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                DIGITAL ATHLETE · BIOMECHANICAL WEARABLES SENSOR LAB
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-wide">
              Wearable Sensor Telemetry &amp; Cumulative Risk Trend Analyzer
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Accepts real-time input streams for multi-axis joint angles, ground reaction impact forces, and range-of-motion (ROM) deficits. Models fatigue accumulation across consecutive game snaps to forecast acute soft-tissue failure thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 bg-[#0a0d16] border border-slate-800 px-3 py-1.5 rounded cursor-pointer font-mono-code text-xs">
              <input
                type="checkbox"
                checked={fatigueCompounding}
                onChange={(e) => setFatigueCompounding(e.target.checked)}
                className="accent-rose-500"
              />
              <span className="text-slate-300">Fatigue Compounding</span>
            </label>
          </div>
        </div>
      </div>

      {/* Athlete Baseline Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono-code text-slate-400 shrink-0">SELECT ATHLETE PROFILE:</span>
        {telemetryPlayers.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectAthlete(p.id)}
            className={`px-3 py-1.5 text-xs font-mono-code rounded border shrink-0 transition-colors ${
              selectedAthleteId === p.id
                ? 'bg-rose-950 text-rose-200 border-rose-500 font-bold shadow-sm'
                : 'bg-[#0b0f1a] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            #{p.jersey} {p.name} ({p.role})
          </button>
        ))}
      </div>

      {/* 3 Sensor Input Columns: Joint Angles, Impact Forces, Range of Motion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Joint Angle Sensors */}
        <div className="bg-[#0c121e] border border-slate-800 rounded-lg p-4 space-y-4 font-mono-code text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-rose-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              1. JOINT ANGLE SENSORS
            </span>
            <span className="text-[10px] text-slate-500">100Hz IMU</span>
          </div>

          {/* Knee Valgus Slider */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Frontal Knee Valgus Angle</span>
              <span className={`font-bold ${kneeValgus > 12 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {kneeValgus.toFixed(1)}° ({kneeValgus > 12 ? 'High Collapse' : 'Optimal <10°'})
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              step="0.2"
              value={kneeValgus}
              onChange={(e) => setKneeValgus(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>2° (Rigid)</span>
              <span>10° (Safe limit)</span>
              <span>24° (Tear Danger)</span>
            </div>
          </div>

          {/* Knee Flexion Slider */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Knee Flexion (Cut Plant)</span>
              <span className={`font-bold ${kneeFlexion < 30 ? 'text-amber-400' : 'text-slate-200'}`}>
                {kneeFlexion}° ({kneeFlexion < 30 ? 'Stiff Absorption' : 'Compliant'})
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="65"
              value={kneeFlexion}
              onChange={(e) => setKneeFlexion(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Ankle Dorsiflexion Slider */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Ankle Dorsiflexion Mobility</span>
              <span className={`font-bold ${ankleDorsiflexion < 18 ? 'text-amber-400' : 'text-slate-200'}`}>
                {ankleDorsiflexion}° ({ankleDorsiflexion < 18 ? 'Restricted' : 'Normal'})
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              value={ankleDorsiflexion}
              onChange={(e) => setAnkleDorsiflexion(Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Column 2: Impact Force Sensors */}
        <div className="bg-[#0c121e] border border-slate-800 rounded-lg p-4 space-y-4 font-mono-code text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              2. IMPACT FORCE SENSORS
            </span>
            <span className="text-[10px] text-slate-500">Insole Load Cells</span>
          </div>

          {/* Peak Ground Reaction Force */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Peak Ground Reaction Force</span>
              <span className={`font-bold ${grfBW > 4.8 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {grfBW.toFixed(1)}x BW ({Math.round(grfBW * 90 * 9.81)} N)
              </span>
            </div>
            <input
              type="range"
              min="2.0"
              max="6.5"
              step="0.1"
              value={grfBW}
              onChange={(e) => setGrfBW(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>2.0x (Jog)</span>
              <span>4.0x (Normal sprint)</span>
              <span>6.5x (Peak plant)</span>
            </div>
          </div>

          {/* Deceleration Impulse */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Deceleration Impulse ($J$)</span>
              <span className={`font-bold ${decelImpulse > 850 ? 'text-rose-400' : 'text-slate-200'}`}>
                {decelImpulse} N·s
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="1200"
              step="20"
              value={decelImpulse}
              onChange={(e) => setDecelImpulse(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Limb Asymmetry */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Limb Loading Asymmetry</span>
              <span className={`font-bold ${limbAsymmetry > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {limbAsymmetry.toFixed(1)}% ({limbAsymmetry > 10 ? 'Unbalanced' : 'Symmetrical'})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={limbAsymmetry}
              onChange={(e) => setLimbAsymmetry(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Column 3: Range-of-Motion (ROM) Sensors */}
        <div className="bg-[#0c121e] border border-slate-800 rounded-lg p-4 space-y-4 font-mono-code text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-cyan-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              3. RANGE-OF-MOTION (ROM)
            </span>
            <span className="text-[10px] text-slate-500">Dynamic Goniometer</span>
          </div>

          {/* Hip Extension Deficit */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Hip Extension Deficit</span>
              <span className={`font-bold ${Math.abs(hipRomDeficit) > 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                {hipRomDeficit.toFixed(1)}% ({Math.abs(hipRomDeficit) > 10 ? 'Tight Hip Flexor' : 'Normal'})
              </span>
            </div>
            <input
              type="range"
              min="-25"
              max="0"
              step="0.5"
              value={hipRomDeficit}
              onChange={(e) => setHipRomDeficit(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-25% (Severe Deficit)</span>
              <span>-10%</span>
              <span>0% (Full ROM)</span>
            </div>
          </div>

          {/* Knee Flexion Arc */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Active Knee Flexion Arc</span>
              <span className={`font-bold ${kneeFlexionArc < 130 ? 'text-amber-400' : 'text-slate-200'}`}>
                {kneeFlexionArc}° (Norm 135-145°)
              </span>
            </div>
            <input
              type="range"
              min="110"
              max="150"
              value={kneeFlexionArc}
              onChange={(e) => setKneeFlexionArc(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Collision G */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-300">Smart Mouthguard Collision Force</span>
              <span className={`font-bold ${collisionG > 25 ? 'text-rose-400' : 'text-slate-200'}`}>
                {collisionG} g ({collisionG > 25 ? 'Heavy Hit' : 'Moderate'})
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              step="1"
              value={collisionG}
              onChange={(e) => setCollisionG(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Simulated Cumulative Risk Trend Charts (10 Game Snaps) */}
      <div className="bg-[#0b101a] border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              <h3 className="font-display font-bold text-white text-base">
                Simulated Biomechanical Risk Trend (10 Consecutive Snaps)
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-0.5">
              Click or hover any snap point on the timeline to inspect instantaneous kinematic vectors.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-mono-code">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              ACL / MCL Shear Hazard %
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              Hamstring Eccentric Risk %
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
              Composite Risk %
            </span>
          </div>
        </div>

        {/* SVG Multi-Line Trend Chart */}
        <div className="relative w-full aspect-[640/180] min-h-[220px] bg-[#070b12] rounded border border-slate-800/80 p-2 overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full block"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Grid Lines (Every 25%) */}
            {[25, 50, 75].map((gridVal) => {
              const y = getY(gridVal);
              return (
                <g key={gridVal}>
                  <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <text x={paddingX - 6} y={y + 3} fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">
                    {gridVal}%
                  </text>
                </g>
              );
            })}

            {/* Critical Danger Threshold Zone Highlight (y > 70%) */}
            <rect
              x={paddingX}
              y={getY(100)}
              width={plotWidth}
              height={getY(70) - getY(100)}
              fill="rgba(244, 63, 94, 0.08)"
            />
            <line
              x1={paddingX}
              y1={getY(70)}
              x2={chartWidth - paddingX}
              y2={getY(70)}
              stroke="#f43f5e"
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.6"
            />
            <text x={chartWidth - paddingX - 4} y={getY(70) - 4} fill="#f43f5e" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">
              CRITICAL STRAIN THRESHOLD (70%)
            </text>

            {/* Vertical grid lines & Snap labels */}
            {trendSeries.map((s) => {
              const x = getX(s.snap);
              const isSelected = activeSnapView === s.snap;
              return (
                <g key={`vgrid-${s.snap}`} className="cursor-pointer" onClick={() => setActiveSnapView(s.snap)}>
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={chartHeight - paddingY}
                    stroke={isSelected ? '#38bdf8' : 'rgba(255,255,255,0.05)'}
                    strokeWidth={isSelected ? '1.5' : '1'}
                  />
                  <text
                    x={x}
                    y={chartHeight - paddingY + 12}
                    fill={isSelected ? '#38bdf8' : 'rgba(255,255,255,0.4)'}
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    S{s.snap}
                  </text>
                </g>
              );
            })}

            {/* Trend Curves */}
            {/* 1. ACL Risk Path */}
            <path
              d={aclRiskPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 2. Hamstring Risk Path */}
            <path
              d={hamstringRiskPath}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 3. Composite Risk Path */}
            <path
              d={compositeRiskPath}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeDasharray="5 2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Point Nodes */}
            {trendSeries.map((s) => {
              const x = getX(s.snap);
              const yAcl = getY(s.aclRiskPct);
              const yComp = getY(s.compositeRiskPct);
              const isSelected = activeSnapView === s.snap;

              return (
                <g
                  key={`pts-${s.snap}`}
                  className="cursor-pointer"
                  onClick={() => setActiveSnapView(s.snap)}
                  onMouseEnter={() => setHoveredSnap(s.snap)}
                  onMouseLeave={() => setHoveredSnap(null)}
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle cx={x} cy={yComp} r="9" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                  )}

                  <circle cx={x} cy={yAcl} r={isSelected ? '4.5' : '3'} fill="#f43f5e" stroke="#000" strokeWidth="1" />
                  <circle cx={x} cy={yComp} r={isSelected ? '5' : '3.5'} fill="#22d3ee" stroke="#000" strokeWidth="1.2" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Snap Deep-Dive Card */}
        <div className="p-4 bg-[#080d16] border border-slate-800 rounded-lg space-y-3 font-mono-code text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded font-bold">
                SNAP {currentSnapData.snap} OF 10
              </span>
              <span className="text-slate-300 font-display font-semibold text-sm">
                Instantaneous Wearable Telemetry &amp; Kinematic State
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Fatigue Accumulation:</span>
              <span className="text-white font-bold">{currentSnapData.fatigueIndex}%</span>
              <span className="text-slate-600">|</span>
              <span className={`font-bold uppercase ${
                currentSnapData.riskLevel === 'critical' ? 'text-rose-400' :
                currentSnapData.riskLevel === 'moderate' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {currentSnapData.riskLevel} Hazard
              </span>
            </div>
          </div>

          {/* 4 Sensor Values at this Snap */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 bg-[#050810] rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">KNEE VALGUS:</span>
              <span className={`text-sm font-bold ${currentSnapData.valgusDeg > 12 ? 'text-rose-400' : 'text-slate-200'}`}>
                {currentSnapData.valgusDeg}°
              </span>
              <span className="text-[10px] text-slate-500 block">Cut angle</span>
            </div>

            <div className="p-2.5 bg-[#050810] rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">GROUND FORCE:</span>
              <span className={`text-sm font-bold ${currentSnapData.grfBW > 4.8 ? 'text-rose-400' : 'text-slate-200'}`}>
                {currentSnapData.grfBW}x BW
              </span>
              <span className="text-[10px] text-slate-500 block">{currentSnapData.decelImpulse} N·s impulse</span>
            </div>

            <div className="p-2.5 bg-[#050810] rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">HAMSTRING ROM DEFICIT:</span>
              <span className="text-sm font-bold text-amber-400">
                {currentSnapData.romDeficitPct}%
              </span>
              <span className="text-[10px] text-slate-500 block">Tightening curve</span>
            </div>

            <div className="p-2.5 bg-[#050810] rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">COMPOSITE FAILURE RISK:</span>
              <span className={`text-sm font-bold ${currentSnapData.compositeRiskPct > 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentSnapData.compositeRiskPct}%
              </span>
              <span className="text-[10px] text-slate-500 block">ACL ({currentSnapData.aclRiskPct}%) / Ham ({currentSnapData.hamstringRiskPct}%)</span>
            </div>
          </div>

          {/* Prescriptive Action Alert */}
          <div className={`p-3 rounded border text-xs leading-relaxed ${
            currentSnapData.compositeRiskPct >= 70
              ? 'bg-rose-950/40 border-rose-800 text-rose-200'
              : currentSnapData.compositeRiskPct >= 45
              ? 'bg-amber-950/40 border-amber-800 text-amber-200'
              : 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>DIGITAL ATHLETE CLINICAL RECOMMENDATION FOR SNAP {currentSnapData.snap}:</span>
            </div>
            {currentSnapData.compositeRiskPct >= 70 ? (
              <span>
                <strong>CRITICAL INTERVENTION:</strong> Athlete has crossed the safe kinematic threshold. Fatigue-induced knee valgus drift ({currentSnapData.valgusDeg}°) combined with peak impact forces ({currentSnapData.grfBW}x BW) creates severe non-contact ACL strain risk. <strong>Recommend immediate substitution for minimum 3 snaps.</strong>
              </span>
            ) : currentSnapData.compositeRiskPct >= 45 ? (
              <span>
                <strong>MODERATE CAUTION:</strong> Workload compounding observed. Hamstring extension deficit is tightening to {currentSnapData.romDeficitPct}%. Limit deep vertical routes; prioritize underneath catch-and-run plays.
              </span>
            ) : (
              <span>
                <strong>FULL CLEARANCE:</strong> Kinematic joint alignment and deceleration absorption are within safe physiological limits. Cleared for maximum sprint efforts.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
