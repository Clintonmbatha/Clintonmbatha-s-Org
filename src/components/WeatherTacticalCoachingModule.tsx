/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CloudRain, Wind, Thermometer, AlertTriangle, BrainCircuit, 
  ArrowRight, ShieldAlert, Zap, Compass, RefreshCw, CheckCircle2,
  TrendingDown, TrendingUp, Sparkles, Layers, Sliders
} from 'lucide-react';

export interface WeatherScenario {
  name: string;
  location: string;
  rainMmPerHour: number;
  windMph: number;
  windDirection: 'headwind' | 'crosswind' | 'tailwind' | 'swirling';
  tempF: number;
  humidityPct: number;
  surface: 'Natural Grass' | 'FieldTurf Synthetic';
}

const PRESET_SCENARIOS: WeatherScenario[] = [
  {
    name: "Arrowhead Gale & Cold Rain",
    location: "GEHA Field at Arrowhead (Kansas City)",
    rainMmPerHour: 22,
    windMph: 24,
    windDirection: 'crosswind',
    tempF: 39,
    humidityPct: 88,
    surface: 'Natural Grass'
  },
  {
    name: "Lambeau Sub-Zero Freeze",
    location: "Lambeau Field (Green Bay)",
    rainMmPerHour: 4, // snow/flurries
    windMph: 18,
    windDirection: 'headwind',
    tempF: 14,
    humidityPct: 65,
    surface: 'Natural Grass'
  },
  {
    name: "Miami Heat Dome",
    location: "Hard Rock Stadium (Miami)",
    rainMmPerHour: 0,
    windMph: 7,
    windDirection: 'tailwind',
    tempF: 92,
    humidityPct: 84,
    surface: 'FieldTurf Synthetic'
  },
  {
    name: "Standard Controlled Baseline",
    location: "Indoor / Temperate Dome",
    rainMmPerHour: 0,
    windMph: 0,
    windDirection: 'tailwind',
    tempF: 72,
    humidityPct: 45,
    surface: 'FieldTurf Synthetic'
  }
];

export const WeatherTacticalCoachingModule: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  
  // Weather Parameters
  const [rainMm, setRainMm] = useState<number>(PRESET_SCENARIOS[0].rainMmPerHour);
  const [windSpeed, setWindSpeed] = useState<number>(PRESET_SCENARIOS[0].windMph);
  const [windDir, setWindDir] = useState<'headwind' | 'crosswind' | 'tailwind' | 'swirling'>(PRESET_SCENARIOS[0].windDirection);
  const [tempF, setTempF] = useState<number>(PRESET_SCENARIOS[0].tempF);
  const [humidity, setHumidity] = useState<number>(PRESET_SCENARIOS[0].humidityPct);
  const [surface, setSurface] = useState<'Natural Grass' | 'FieldTurf Synthetic'>(PRESET_SCENARIOS[0].surface);

  const applyPreset = (idx: number) => {
    const s = PRESET_SCENARIOS[idx];
    setSelectedScenarioIndex(idx);
    setRainMm(s.rainMmPerHour);
    setWindSpeed(s.windMph);
    setWindDir(s.windDirection);
    setTempF(s.tempF);
    setHumidity(s.humidityPct);
    setSurface(s.surface);
  };

  // Physics & Biomechanical calculations
  // 1. Friction coefficient (mu)
  const baseMu = surface === 'Natural Grass' ? 0.82 : 0.78;
  const rainPenalty = (rainMm / 40) * 0.32;
  const freezePenalty = tempF <= 32 ? 0.14 : 0;
  const turfFriction = Math.max(0.42, Number((baseMu - rainPenalty - freezePenalty).toFixed(2)));

  // 2. Ball aerodynamics & passing degradation
  const windDeflectionYards = Number(((windSpeed / 10) * (windDir === 'crosswind' ? 1.4 : windDir === 'swirling' ? 1.0 : 0.4)).toFixed(1));
  const deepPassCompletionPenaltyPct = Math.min(48, Math.round((windSpeed * 0.9) + (rainMm * 0.5) + (tempF < 32 ? 14 : 0)));
  const fumbleRiskMultiplier = Number((1.0 + (rainMm > 5 ? 0.8 + (rainMm/25) : 0) + (tempF < 32 ? 0.6 : 0)).toFixed(1));

  // 3. Muscle Viscosity & Injury Hazards
  let muscleViscosityLabel = 'Normal Elasticity';
  let softTissueRiskMultiplier = 1.0;
  if (tempF < 28) {
    muscleViscosityLabel = 'Severe Viscosity (Cold Stiffening)';
    softTissueRiskMultiplier = 2.4;
  } else if (tempF < 45) {
    muscleViscosityLabel = 'Elevated Viscosity (Delayed Activation)';
    softTissueRiskMultiplier = 1.6;
  } else if (tempF > 88 && humidity > 70) {
    muscleViscosityLabel = 'Thermal Fatigue & Cramp Vulnerability';
    softTissueRiskMultiplier = 1.9;
  }

  // 4. Tactical Recommendations derivation
  const runPassRatio = windSpeed > 18 || rainMm > 15 || tempF < 25
    ? { run: 68, pass: 32 }
    : windSpeed > 12 || rainMm > 5
    ? { run: 58, pass: 42 }
    : { run: 46, pass: 54 };

  const maxFgRangeYards = windDir === 'headwind'
    ? Math.max(38, Math.round(54 - windSpeed * 0.6))
    : windDir === 'tailwind'
    ? Math.min(62, Math.round(54 + windSpeed * 0.3))
    : 52;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#0b161f] border border-cyan-900/60 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-cyan-400">AI COACHING ASSISTANT · WEATHER & KINETIC ENGINE</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-wide">
              Real-Time Environmental & Performance Risk Analyzer
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Analyzes dynamic stadium atmospheric parameters (precipitation rate, wind vectors, temperature, and turf micro-climate) to quantify player deceleration penalties, soft-tissue injury probabilities, and deliver automated tactical play-calling audibles.
            </p>
          </div>

          <div className="bg-[#071118] border border-cyan-800/60 p-3 rounded-lg text-right font-mono-code text-xs">
            <div className="text-slate-400">WEATHER-ADAPTIVE AI:</div>
            <div className="text-emerald-400 font-semibold">Active & Live Audibles</div>
          </div>
        </div>
      </div>

      {/* Preset Weather Conditions Selector */}
      <div className="space-y-2">
        <span className="text-xs font-mono-code text-slate-400">BENCHMARK NFL STADIUM PRESETS:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_SCENARIOS.map((preset, idx) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(idx)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedScenarioIndex === idx
                  ? 'bg-[#102434] border-cyan-400 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-[#081017] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-display font-bold text-slate-100 mb-0.5 truncate">
                {preset.name}
              </div>
              <div className="text-[11px] font-mono-code text-slate-400 truncate mb-2">
                {preset.location}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono-code text-cyan-300">
                <span>{preset.tempF}°F</span>
                <span>·</span>
                <span>{preset.windMph} mph {preset.windDirection}</span>
                <span>·</span>
                <span>{preset.rainMmPerHour > 0 ? `${preset.rainMmPerHour}mm/h` : 'Dry'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Atmospheric Condition Sliders */}
      <div className="bg-[#0a121a] border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-white text-base">
              Atmospheric & Stadium Boundary Controls
            </h3>
          </div>
          <span className="text-xs font-mono-code text-slate-400">Edge Sensors & Weather Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Temperature & Humidity */}
          <div className="space-y-4 bg-[#070d13] p-4 rounded border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono-code text-amber-400 font-semibold">
              <Thermometer className="w-4 h-4" />
              <span>THERMAL MICROCLIMATE</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-slate-300">Air Temperature</span>
                <span className={`font-bold ${tempF < 32 ? 'text-blue-400' : tempF > 85 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {tempF}°F ({(((tempF - 32) * 5) / 9).toFixed(1)}°C)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="102"
                value={tempF}
                onChange={(e) => {
                  setTempF(Number(e.target.value));
                  setSelectedScenarioIndex(-1);
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono-code text-slate-500">
                <span>5°F (Sub-Zero)</span>
                <span>55°F (Cool)</span>
                <span>100°F (Sweltering)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-slate-300">Relative Humidity</span>
                <span className="text-cyan-400 font-bold">{humidity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={humidity}
                onChange={(e) => {
                  setHumidity(Number(e.target.value));
                  setSelectedScenarioIndex(-1);
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-[11px] font-mono-code text-slate-400 block mb-1">SURFACE TURF TYPE:</span>
              <div className="flex gap-2">
                {(['Natural Grass', 'FieldTurf Synthetic'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSurface(s);
                      setSelectedScenarioIndex(-1);
                    }}
                    className={`flex-1 py-1 px-2 rounded text-[11px] font-mono-code border transition-colors ${
                      surface === s
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                        : 'bg-[#0a121a] text-slate-400 border-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Wind Vectors */}
          <div className="space-y-4 bg-[#070d13] p-4 rounded border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 font-semibold">
              <Wind className="w-4 h-4" />
              <span>AERODYNAMIC VECTORS</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-slate-300">Wind Velocity</span>
                <span className={`font-bold ${windSpeed > 20 ? 'text-rose-400' : windSpeed > 12 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {windSpeed} mph ({(windSpeed * 1.609).toFixed(0)} km/h)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                value={windSpeed}
                onChange={(e) => {
                  setWindSpeed(Number(e.target.value));
                  setSelectedScenarioIndex(-1);
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono-code text-slate-500">
                <span>0 mph (Calm)</span>
                <span>20 mph (Breezy)</span>
                <span>45 mph (Gale)</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono-code text-slate-300 block mb-1.5">WIND DIRECTION & ORIENTATION:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['headwind', 'crosswind', 'tailwind', 'swirling'] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => {
                      setWindDir(dir);
                      setSelectedScenarioIndex(-1);
                    }}
                    className={`py-1.5 px-2 text-[11px] font-mono-code rounded capitalize border transition-colors ${
                      windDir === dir
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-600 font-bold'
                        : 'bg-[#0a121a] text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono-code text-slate-400 pt-1">
              Deep ball lateral drift: <strong className="text-cyan-300">{windDeflectionYards} yards</strong> on 40-yd pass.
            </div>
          </div>

          {/* Column 3: Precipitation & Water Ingress */}
          <div className="space-y-4 bg-[#070d13] p-4 rounded border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono-code text-blue-400 font-semibold">
              <CloudRain className="w-4 h-4" />
              <span>PRECIPITATION & MOISTURE</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-slate-300">Rainfall Rate</span>
                <span className={`font-bold ${rainMm > 20 ? 'text-rose-400' : rainMm > 8 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {rainMm} mm/hr ({rainMm === 0 ? 'Dry' : rainMm < 8 ? 'Drizzle' : rainMm < 20 ? 'Moderate' : 'Heavy Downpour'})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={rainMm}
                onChange={(e) => {
                  setRainMm(Number(e.target.value));
                  setSelectedScenarioIndex(-1);
                }}
                className="w-full accent-blue-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono-code text-slate-500">
                <span>0 mm/h (Dry)</span>
                <span>15 mm/h (Soaked)</span>
                <span>40 mm/h (Deluge)</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-2 text-xs font-mono-code">
              <div className="flex justify-between p-2 bg-[#0a121a] rounded border border-slate-800">
                <span className="text-slate-400">Turf Grip Coefficient ($\mu$):</span>
                <span className={`font-bold ${turfFriction < 0.55 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {turfFriction} (Norm 0.82)
                </span>
              </div>
              <div className="flex justify-between p-2 bg-[#0a121a] rounded border border-slate-800">
                <span className="text-slate-400">Ball Fumble Multiplier:</span>
                <span className={`font-bold ${fumbleRiskMultiplier > 2.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {fumbleRiskMultiplier}x Baseline
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Critical Split Panes: 
          Pane 1: Biomechanical Injury Risk & Physical Impact Analysis
          Pane 2: AI Adaptive Tactical Recommendations & Training Adjustments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pane 1: Environmental Impact on Player Biomechanics & Injury Risk */}
        <div className="bg-[#0b121c] border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="font-display font-bold text-white text-base">
                  Environmental Biomechanical Risk Analysis
                </h3>
              </div>
              <span className="text-xs font-mono-code text-rose-400 font-bold">
                {softTissueRiskMultiplier}x Tissue Strain Hazard
              </span>
            </div>

            {/* Key Risk Indicators */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono-code">
              <div className="p-3 bg-[#070c14] rounded border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">MUSCLE TISSUE VISCOSITY:</span>
                <span className={`font-bold text-sm ${tempF < 35 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {muscleViscosityLabel}
                </span>
                <p className="text-[10px] text-slate-500 leading-tight pt-1">
                  {tempF < 35 
                    ? 'Sub-freezing temperatures drop sarcomere contractile speed by 18%, causing eccentric hamstring shear on maximal sprints.'
                    : 'Optimal cross-bridge cycling in muscle fibers; standard neuromuscular responsiveness.'}
                </p>
              </div>

              <div className="p-3 bg-[#070c14] rounded border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">FOOTING SLIP & GROIN RISK:</span>
                <span className={`font-bold text-sm ${turfFriction < 0.58 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {turfFriction < 0.58 ? 'Critical Slip Hazard' : 'Secure Traction'}
                </span>
                <p className="text-[10px] text-slate-500 leading-tight pt-1">
                  {turfFriction < 0.58 
                    ? 'Low surface friction triggers involuntary hip abduction slips, sharply elevating adductor longus and high ankle syndesmosis sprains.'
                    : 'Adequate cleat bite allows plant-and-cut forces within safe mechanical tolerances.'}
                </p>
              </div>
            </div>

            {/* Detailed Tissue Vulnerability Table */}
            <div className="p-4 bg-[#070c14] border border-rose-950/80 rounded-lg space-y-2.5">
              <span className="text-xs font-mono-code text-rose-400 block font-semibold">
                ANATOMICAL STRUCTURE RISK PROFILE UNDER CURRENT WEATHER:
              </span>

              <div className="space-y-2 text-xs font-mono-code">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-300">Hamstrings (Biceps Femoris)</span>
                  <span className={`font-bold ${tempF < 35 || rainMm > 15 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {tempF < 32 ? 'HIGH (Cold Stiffening + Sudden Decel)' : rainMm > 15 ? 'ELEVATED (Turf Slip Shear)' : 'NORMAL'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-300">Knee Ligaments (ACL / MCL)</span>
                  <span className={`font-bold ${turfFriction < 0.52 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {turfFriction < 0.52 ? 'ELEVATED (Valgus drift on un-cleated plant)' : 'NORMAL'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-300">Groin / Hip Adductors</span>
                  <span className={`font-bold ${rainMm > 10 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {rainMm > 10 ? 'ELEVATED (Lateral foot slippage on cuts)' : 'NORMAL'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Neuromuscular Fatigue & Cramps</span>
                  <span className={`font-bold ${tempF > 85 && humidity > 70 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {tempF > 85 && humidity > 70 ? 'CRITICAL (Electrolyte Loss > 1.8L/hr)' : 'LOW'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Biomechanical Weather Intervention */}
          <div className="p-3 bg-[#070c14] border border-slate-800 rounded text-xs font-mono-code text-slate-300">
            <span className="text-cyan-400 font-semibold block mb-1">DIGITAL ATHLETE MITIGATION:</span>
            Rotate skill positions (WRs and RBs) every 6 plays instead of 9. Monitor wearable insole ground reaction force for lateral asymmetry exceeding 10%.
          </div>
        </div>

        {/* Pane 2: Adaptive Tactical Recommendations & Training Adjustments */}
        <div className="bg-[#0b121c] border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-base">
                  Adaptive Tactical & Playbook Recommendations
                </h3>
              </div>
              <span className="text-xs font-mono-code text-emerald-400 font-bold">
                Playbook Re-weighted
              </span>
            </div>

            {/* Run vs Pass Optimal Distribution Gauge */}
            <div className="p-4 bg-[#070c14] border border-emerald-950/80 rounded-lg space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-300">AI RECOMMENDED RUN / PASS MIX:</span>
                <span className="text-emerald-300 font-bold">
                  {runPassRatio.run}% RUN / {runPassRatio.pass}% PASS
                </span>
              </div>

              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${runPassRatio.run}%` }}
                  title="Run Ratio"
                />
                <div 
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${runPassRatio.pass}%` }}
                  title="Pass Ratio"
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono-code text-slate-400">
                <span>Run Concepts (Duo / Power / Outside Zone)</span>
                <span>Pass Concepts (Quick Slant / Mesh)</span>
              </div>
            </div>

            {/* Tactical Directives */}
            <div className="space-y-2.5 text-xs font-mono-code">
              <div className="p-3 bg-[#070c14] rounded border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-semibold block text-[11px]">PASSING SCHEME AUDIBLES:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {windSpeed > 20 || rainMm > 15
                    ? '🚫 Eliminate 7-step drop deep post & corner routes. Defensive backfield can predict ball wobble. Shift 70% of targets to under-center play-action bootlegs, shallow drags, and tight end option seams under 10 air yards.'
                    : 'Pass protection and downfield ball trajectory are stable. Maintain standard route depth and vertical stretch concepts.'}
                </p>
              </div>

              <div className="p-3 bg-[#070c14] rounded border border-slate-800 space-y-1">
                <span className="text-amber-400 font-semibold block text-[11px]">SPECIAL TEAMS & 4TH DOWN THRESHOLD:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Cap field goal attempts at <strong className="text-white">{maxFgRangeYards} yards</strong> {windDir === 'headwind' ? 'into the headwind' : 'with current wind drift'}. On 4th &amp; 3 or less inside the opponent 45-yard line, recommendation is to <strong className="text-emerald-300">GO FOR IT</strong> rather than risking wind-drifted long kicks.
                </p>
              </div>

              {/* Weather-Adaptive Training Adjustments */}
              <div className="p-3 bg-[#070c14] rounded border border-cyan-900/60 space-y-1">
                <span className="text-cyan-400 font-semibold block text-[11px]">WEATHER-ADAPTIVE TRAINING & GEAR ADJUSTMENTS:</span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">›</span>
                    <span>
                      {tempF < 35 
                        ? 'Warm-up: Extend mandatory dynamic neuromuscular warm-up by 12 mins to reach 38.5°C muscle core temperature before kickoff.'
                        : tempF > 85 
                        ? 'Hydration: Prescribe 250ml electrolyte/sodium beverage every 15 minutes of live game play.'
                        : 'Standard 20-minute dynamic neuromuscular prep.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">›</span>
                    <span>
                      Cleats: {surface === 'Natural Grass' && rainMm > 8 
                        ? 'Mandate 7-stud detachable 1/2-inch nylon studs to penetrate muddy sub-base.'
                        : 'Standard molded TPU multi-stud cleat plates.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">›</span>
                    <span>
                      Ball Security: Apply hydrophobic chalk to running back forearms and swap game balls every 2 offensive possessions.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono-code text-slate-500 pt-2 border-t border-slate-800">
            Real-time feed integrated with sideline Motorola coach headsets and Surface tablets.
          </div>
        </div>
      </div>
    </div>
  );
};
