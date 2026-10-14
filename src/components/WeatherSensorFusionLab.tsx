/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CloudRain, Cpu, Eye, Sliders, Layers, Sparkles, 
  ShieldCheck, AlertTriangle, Check, RefreshCw 
} from 'lucide-react';
import { SPORTS_AI_DOCUMENTS } from '../data/sportsAiKnowledge';

export const WeatherSensorFusionLab: React.FC = () => {
  const doc = SPORTS_AI_DOCUMENTS.find(d => d.id === 'doc_003')!;

  const [rainIntensity, setRainIntensity] = useState<number>(75); // 0 to 100%
  const [lensMoisture, setLensMoisture] = useState<number>(50); // 0 to 100%
  const [deRainActive, setDeRainActive] = useState<boolean>(true);
  const [fusionEnabled, setFusionEnabled] = useState<boolean>(true);
  const [activeViewMode, setActiveViewMode] = useState<'composite' | 'raw' | 'residual' | 'derained'>('composite');
  const [selectedComponent, setSelectedComponent] = useState<number>(0);

  // Computed optical performance metrics
  const opticalConfidence = Math.max(
    0.35, 
    0.98 - (rainIntensity * 0.004) - (lensMoisture * 0.003) + (deRainActive ? 0.28 : 0)
  );

  const psnrValue = (24.5 + (deRainActive ? 8.4 : 0) - (rainIntensity * 0.06)).toFixed(1);
  const ssimValue = (0.72 + (deRainActive ? 0.22 : 0) - (rainIntensity * 0.002)).toFixed(3);
  const trackLossRate = fusionEnabled 
    ? '0.04%' 
    : deRainActive 
      ? `${(1.2 + rainIntensity * 0.04).toFixed(1)}%` 
      : `${(5.8 + rainIntensity * 0.18).toFixed(1)}% (Severe)`;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#18140c] border border-amber-900/50 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-amber-400">DOC_003 · COMPUTER VISION / SENSOR FUSION</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-wide">
              {doc.topic}
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {doc.summary}
            </p>
          </div>

          <div className="bg-[#120f09] border border-amber-800/60 p-3 rounded-lg text-right font-mono-code text-xs">
            <div className="text-slate-400">FUSION CONTINUITY:</div>
            <div className="text-amber-300 font-semibold">{doc.impact_metric}</div>
          </div>
        </div>
      </div>

      {/* 4 Core Components of doc_003 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {doc.system_components.map((comp, idx) => (
          <div
            key={comp.component_name}
            onClick={() => setSelectedComponent(idx)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedComponent === idx
                ? 'bg-[#221a0d] border-amber-500/70 shadow-lg'
                : 'bg-[#0f0c08] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-code text-amber-400">0{idx + 1} // FUSION LAYER</span>
              {selectedComponent === idx && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </div>
            <h3 className="font-display font-semibold text-slate-100 text-sm mb-1.5">
              {comp.component_name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
              {comp.description}
            </p>
          </div>
        ))}
      </div>

      {/* Component Details Card */}
      <div className="bg-[#120f0a] border border-slate-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <CloudRain className="w-4 h-4 text-amber-400" />
          <h3 className="font-display font-bold text-slate-100 text-base">
            System Component Deep Dive: {doc.system_components[selectedComponent].component_name}
          </h3>
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          {doc.system_components[selectedComponent].description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-code">
          <div className="p-3 bg-[#080705] border border-slate-800/80 rounded">
            <span className="text-amber-400 block mb-1 font-semibold">NEURAL & KALMAN ARCHITECTURE</span>
            <p className="text-slate-300 leading-relaxed">
              {doc.system_components[selectedComponent].technical_specs}
            </p>
          </div>

          <div className="p-3 bg-[#080705] border border-slate-800/80 rounded">
            <span className="text-amber-400 block mb-1 font-semibold">BENCHMARK METRICS</span>
            <ul className="space-y-1 text-slate-300">
              {doc.system_components[selectedComponent].metrics?.map((m, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-amber-500">›</span> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Neural De-raining & Kalman Sensor Fusion Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Inspection Screen */}
        <div className="bg-[#0e0c08] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-bold text-white text-base">
                  De-raining CNN Decomposition ($I = B + R$)
                </h3>
              </div>
              <span className="text-xs font-mono-code text-slate-400">PReNet Neural Filter</span>
            </div>

            {/* Decomposition View Tabs */}
            <div className="flex gap-1.5 mb-3 bg-[#16120c] p-1 rounded border border-slate-800 text-xs font-mono-code">
              {[
                { id: 'composite', label: 'Fused Output' },
                { id: 'raw', label: 'Raw Degraded (I)' },
                { id: 'residual', label: 'Rain Residual (R)' },
                { id: 'derained', label: 'Cleaned Background (B)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveViewMode(tab.id as any)}
                  className={`flex-1 py-1 rounded transition-colors ${
                    activeViewMode === tab.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-600/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Simulated Visual Frame Canvas */}
            <div className="relative aspect-[16/9] w-full rounded border border-slate-800 bg-[#080d0b] overflow-hidden flex items-center justify-center">
              {/* Football field turf background */}
              <div className="absolute inset-0 bg-[#0c1a14] opacity-90" />
              
              {/* Field lines */}
              <div className="absolute inset-0 flex justify-around pointer-events-none opacity-20">
                <div className="w-[1px] h-full bg-white" />
                <div className="w-[1px] h-full bg-white" />
                <div className="w-[1px] h-full bg-white" />
              </div>

              {/* Simulated Player Silhouette with Keypoint Skeleton */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Skeletal stick figure */}
                <svg width="120" height="150" viewBox="0 0 120 150" className="overflow-visible">
                  {/* Spine & Limbs */}
                  <line x1="60" y1="35" x2="60" y2="85" stroke="#38bdf8" strokeWidth="3" />
                  <line x1="30" y1="50" x2="90" y2="50" stroke="#38bdf8" strokeWidth="3" />
                  <line x1="30" y1="50" x2="20" y2="80" stroke="#38bdf8" strokeWidth="2.5" />
                  <line x1="90" y1="50" x2="100" y2="80" stroke="#38bdf8" strokeWidth="2.5" />
                  <line x1="60" y1="85" x2="40" y2="135" stroke="#38bdf8" strokeWidth="3" />
                  <line x1="60" y1="85" x2="80" y2="135" stroke="#38bdf8" strokeWidth="3" />

                  {/* Joint Nodes */}
                  <circle cx="60" cy="25" r="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="60" cy="85" r="4" fill="#38bdf8" />
                  <circle cx="40" cy="135" r="4" fill="#38bdf8" />
                  <circle cx="80" cy="135" r="4" fill="#38bdf8" />
                  <circle cx="20" cy="80" r="3.5" fill="#38bdf8" />
                  <circle cx="100" cy="80" r="3.5" fill="#38bdf8" />
                </svg>

                {/* YOLO Bounding Box */}
                {(activeViewMode === 'composite' || activeViewMode === 'derained' || (activeViewMode === 'raw' && opticalConfidence > 0.6)) && (
                  <div className="absolute -inset-4 border-2 border-emerald-400 bg-emerald-500/10 rounded flex flex-col justify-between p-1">
                    <span className="text-[10px] font-mono-code bg-emerald-950 text-emerald-300 px-1 w-max rounded">
                      #15 WR · Conf: {(opticalConfidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-[9px] font-mono-code text-cyan-300 bg-cyan-950/80 px-1 w-max rounded">
                      RFID LOCKED (20Hz)
                    </span>
                  </div>
                )}
              </div>

              {/* Rain Streaks Overlay (shown in 'composite', 'raw', and 'residual') */}
              {(activeViewMode === 'raw' || activeViewMode === 'composite' || activeViewMode === 'residual') && (
                <div 
                  className={`absolute inset-0 pointer-events-none ${activeViewMode === 'residual' ? 'bg-black opacity-90' : 'opacity-60'}`}
                  style={{
                    backgroundImage: `repeating-linear-gradient(110deg, rgba(255,255,255,${rainIntensity * 0.0035}) 0, rgba(255,255,255,${rainIntensity * 0.0035}) 1.5px, transparent 2px, transparent 12px)`,
                  }}
                />
              )}

              {/* Lens moisture blurring */}
              {activeViewMode === 'raw' && (
                <div 
                  className="absolute inset-0 pointer-events-none backdrop-blur-[2px] bg-slate-900/30"
                  style={{ opacity: lensMoisture * 0.01 }}
                />
              )}

              {/* Mode indicator badge */}
              <div className="absolute bottom-2 left-2 bg-black/80 border border-slate-700 text-xs font-mono-code px-2 py-0.5 rounded text-slate-300">
                {activeViewMode === 'composite' && 'SENSORS FUSED: VIDEO + RFID CO-REGISTERED'}
                {activeViewMode === 'raw' && 'RAW BROADCAST FRAME (DEGRADED BY RAIN STREAKS)'}
                {activeViewMode === 'residual' && 'AI EXTRACTED RAIN RESIDUAL MAP (NOISE LAYER)'}
                {activeViewMode === 'derained' && 'CLEANED BACKGROUND RECONSTRUCTION (DERAINNET)'}
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono-code text-slate-400 pt-3">
            Mathematical formulation: I = B + R, where B is the clean frame restored via Progressive Recurrent ResNet.
          </div>
        </div>

        {/* Controls & Sensor Fusion Kalman Benchmarking */}
        <div className="bg-[#0e0c08] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-bold text-white text-base">
                  Adverse Weather & Fusion Controls
                </h3>
              </div>
              <span className="text-xs font-mono-code text-slate-400">Kalman State Engine</span>
            </div>

            {/* Sliders */}
            <div className="space-y-4 mb-5">
              <div>
                <div className="flex justify-between text-xs font-mono-code mb-1">
                  <span className="text-slate-300">Precipitation Rate / Rain Density</span>
                  <span className="text-amber-400 font-bold">{rainIntensity}% ({((rainIntensity/100) * 45).toFixed(1)} mm/hr)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rainIntensity}
                  onChange={(e) => setRainIntensity(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono-code text-slate-500">
                  <span>0% (Dry)</span>
                  <span>40% (Drizzle)</span>
                  <span>100% (Tropical Storm)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-code mb-1">
                  <span className="text-slate-300">Camera Lens Spray & Fog Density</span>
                  <span className="text-amber-400 font-bold">{lensMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lensMoisture}
                  onChange={(e) => setLensMoisture(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 bg-[#16120c] border border-slate-800 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deRainActive}
                    onChange={(e) => setDeRainActive(e.target.checked)}
                    className="accent-amber-400"
                  />
                  <div className="text-xs">
                    <span className="font-mono-code text-slate-200 block font-semibold">DeRainNet CNN</span>
                    <span className="text-[10px] text-slate-400">Filters water spray</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-[#16120c] border border-slate-800 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fusionEnabled}
                    onChange={(e) => setFusionEnabled(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  <div className="text-xs">
                    <span className="font-mono-code text-slate-200 block font-semibold">RFID Fusion</span>
                    <span className="text-[10px] text-slate-400">Unscented Kalman Filter</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Performance Metric Comparison Matrix */}
            <div className="p-4 bg-[#14100a] border border-amber-900/60 rounded-lg space-y-2.5">
              <span className="text-xs font-mono-code text-amber-400 block font-semibold">
                SYSTEM RELIABILITY BENCHMARK (LIVE)
              </span>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono-code">
                <div className="p-2 bg-[#090805] rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Peak SNR:</span>
                  <span className="text-slate-100 font-bold">{psnrValue} dB</span>
                </div>
                <div className="p-2 bg-[#090805] rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">SSIM Fidelity:</span>
                  <span className="text-slate-100 font-bold">{ssimValue}</span>
                </div>
                <div className="p-2 bg-[#090805] rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Track Dropout:</span>
                  <span className={`font-bold ${fusionEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trackLossRate}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-[#090805] border border-slate-800 rounded text-xs font-mono-code text-slate-300">
                <span className="text-emerald-400 font-semibold block mb-0.5">FUSION ADVANTAGE:</span>
                {fusionEnabled
                  ? 'Sensor fusion is active. Even if rain droplets obscure the player’s jersey number or face, the radio frequency chirp maintains precise (X,Y) coordinates within ±10cm.'
                  : '⚠️ Pure optical mode active! Under heavy rain and lens glare, camera algorithms drop bounding boxes and confuse player identities.'}
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono-code text-slate-500 pt-3">
            Evaluated against NFL Lambeau Field and Buffalo Highmark Stadium cold weather telemetry.
          </div>
        </div>
      </div>
    </div>
  );
};
