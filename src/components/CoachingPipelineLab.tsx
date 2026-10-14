/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BrainCircuit, Eye, Compass, Cpu, TrendingUp, 
  ArrowRight, CheckCircle2, ChevronRight, Play, Sparkles, CloudRain, Wind, Atom
} from 'lucide-react';
import { SPORTS_AI_DOCUMENTS } from '../data/sportsAiKnowledge';
import { WeatherTacticalCoachingModule } from './WeatherTacticalCoachingModule';
import { QuantumCoachingCircuit } from './QuantumCoachingCircuit';

export const CoachingPipelineLab: React.FC = () => {
  const doc = SPORTS_AI_DOCUMENTS.find(d => d.id === 'doc_004')!;

  const [activeSubView, setActiveSubView] = useState<'vision' | 'weather' | 'quantum'>('vision');
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);
  const [selectedScheme, setSelectedScheme] = useState<string>('cover3');
  const [cameraTiltAngle, setCameraTiltAngle] = useState<number>(38); // degrees (All-22 stadium camera)
  const [selectedComponent, setSelectedComponent] = useState<number>(0);

  const pipelineStages = [
    {
      num: "01",
      title: "Data Acquisition & Player Detection",
      subtitle: "YOLOv10 / ByteTrack / CRNN",
      desc: "All-22 stadium broadcast cameras stream 4K 60fps video into edge TensorRT inference workers. Deep learning models segment foreground players, bounding boxes, and execute jersey OCR to attach persistent roster IDs.",
      latency: "8.4 ms",
      accuracy: "97.4% mAP@50"
    },
    {
      num: "02",
      title: "Movement & Positional Mapping",
      subtitle: "Planar 4-Point Homography",
      desc: "Distorted trapezoidal camera coordinates (u, v) are projected through a calibrated 3x3 homography matrix onto an orthogonal 100x53.3 yard field plane, calculating player velocity vectors, accelerations, and Voronoi spacing.",
      latency: "3.2 ms",
      accuracy: "±0.15 yard precision"
    },
    {
      num: "03",
      title: "Tactical Analytics & Pattern Recognition",
      subtitle: "Spatio-Temporal Graph Neural Net",
      desc: "Player trajectory graphs are evaluated against 10 seasons of defensive shell formations. The model identifies coverage structures (Cover 1, 2, 3, Quarters), computes open receiver separation windows, and generates actionable coach headset audibles.",
      latency: "4.6 ms",
      accuracy: "93.6% scheme classification"
    }
  ];

  const defensiveSchemes: Record<string, {
    name: string;
    coverageType: string;
    description: string;
    vulnerability: string;
    recommendedCounter: string;
    epaDelta: string;
    safetyCount: string;
  }> = {
    cover3: {
      name: "Cover 3 Sky / Cloud",
      coverageType: "Zone (3 Deep, 4 Under)",
      description: "Deep thirds defended by both outside cornerbacks and free safety. Strong safety drops into the flat/curl zone. 1-high safety look.",
      vulnerability: "Seam routes between hash marks, four-verticals stretching the single free safety, and quick flats if curl defender is slow to drift.",
      recommendedCounter: "Dagger Concept (Dig route behind clear-out streak) or Trips Seam Option to TE.",
      epaDelta: "+0.38 EPA / play",
      safetyCount: "1 High Safety"
    },
    cover2: {
      name: "Cover 2 Tampa",
      coverageType: "Zone (2 Deep Safeties, 5 Under)",
      description: "Two deep safeties split field halves (20+ yards deep). Middle linebacker drops deep into the Tampa hole between the safeties.",
      vulnerability: "Deep sideline honey hole between cornerback (5-7 yds) and safety (20 yds), and crossing routes underneath the dropping linebacker.",
      recommendedCounter: "Smash Concept (Hitch route + Corner route) to flood the outside cornerback.",
      epaDelta: "+0.42 EPA / play",
      safetyCount: "2 High Safeties"
    },
    cover0: {
      name: "Cover 0 Blitz",
      coverageType: "Pure Man-to-Man (No Deep Safety)",
      description: "All defensive backs play tight press-man with 0 deep safety help. 6 or 7 pass rushers blitz the pocket to force immediate throws.",
      vulnerability: "Any 1-on-1 separation results in an explosive touchdown. Quick slants, rub routes, and screens punish aggressive blitz paths.",
      recommendedCounter: "Slant-Flat combo, Quick Out, or Bubble Screen behind blocking receivers.",
      epaDelta: "+0.65 EPA / play",
      safetyCount: "0 Safeties (All Blitz)"
    },
    cover4: {
      name: "Cover 4 / Quarters",
      coverageType: "Match Zone (4 Deep Quarters)",
      description: "Both cornerbacks and both safeties each cover 1/4 of the deep field. Safeties trigger fast on run fits if tight end blocks.",
      vulnerability: "Intermediate play-action passes suck up safeties; bubble screens and outside zone runs exploit 4 deep defenders back-pedaling.",
      recommendedCounter: "Play-action post-wheel route or pin-pull outside toss.",
      epaDelta: "+0.31 EPA / play",
      safetyCount: "2 High Safeties (Match)"
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#0b1814] border border-emerald-900/50 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-emerald-400">DOC_004 · COMPUTER VISION / TACTICAL ANALYTICS</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-wide">
              {doc.topic}
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {doc.summary}
            </p>
          </div>

          <div className="bg-[#07110e] border border-emerald-800/60 p-3 rounded-lg text-right font-mono-code text-xs">
            <div className="text-slate-400">INFERENCE SPEED:</div>
            <div className="text-emerald-300 font-semibold">{doc.impact_metric}</div>
          </div>
        </div>
      </div>

      {/* Sub-view switcher between Vision Pipeline, Real-Time Weather Engine, and Quantum QNN */}
      <div className="flex flex-wrap items-center gap-2 bg-[#08120d] p-1.5 border border-slate-800 rounded-lg font-mono-code text-xs">
        <button
          onClick={() => setActiveSubView('vision')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2 px-3 rounded transition-all ${
            activeSubView === 'vision'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-emerald-400" />
          <span>Vision &amp; Defensive Coverage</span>
        </button>

        <button
          onClick={() => setActiveSubView('weather')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2 px-3 rounded transition-all ${
            activeSubView === 'weather'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-600 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CloudRain className="w-4 h-4 text-cyan-400" />
          <span>Weather &amp; Adaptive Tactics</span>
        </button>

        <button
          onClick={() => setActiveSubView('quantum')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2 px-3 rounded transition-all ${
            activeSubView === 'quantum'
              ? 'bg-indigo-950 text-indigo-300 border border-indigo-600 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Atom className="w-4 h-4 text-indigo-400" />
          <span>Quantum Spatial QNN (PennyLane)</span>
        </button>
      </div>

      {activeSubView === 'quantum' ? (
        <QuantumCoachingCircuit />
      ) : activeSubView === 'weather' ? (
        <WeatherTacticalCoachingModule />
      ) : (
        <>
          {/* 3 Core Components of doc_004 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doc.system_components.map((comp, idx) => (
          <div
            key={comp.component_name}
            onClick={() => setSelectedComponent(idx)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedComponent === idx
                ? 'bg-[#10241e] border-emerald-500/70 shadow-lg'
                : 'bg-[#091410] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-code text-emerald-400">0{idx + 1} // PIPELINE STAGE</span>
              {selectedComponent === idx && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
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
      <div className="bg-[#0a1612] border border-slate-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-4 h-4 text-emerald-400" />
          <h3 className="font-display font-bold text-slate-100 text-base">
            System Component Deep Dive: {doc.system_components[selectedComponent].component_name}
          </h3>
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          {doc.system_components[selectedComponent].description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-code">
          <div className="p-3 bg-[#060e0c] border border-slate-800/80 rounded">
            <span className="text-emerald-400 block mb-1 font-semibold">ALGORITHMIC ARCHITECTURE</span>
            <p className="text-slate-300 leading-relaxed">
              {doc.system_components[selectedComponent].technical_specs}
            </p>
          </div>

          <div className="p-3 bg-[#060e0c] border border-slate-800/80 rounded">
            <span className="text-emerald-400 block mb-1 font-semibold">BENCHMARK METRICS</span>
            <ul className="space-y-1 text-slate-300">
              {doc.system_components[selectedComponent].metrics?.map((m, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-emerald-500">›</span> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive 3-Stage Pipeline Walkthrough */}
      <div className="bg-[#0a1612] border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-white text-base">
              End-to-End AI Coaching Assistant Pipeline Architecture
            </h3>
          </div>
          <span className="text-xs font-mono-code text-slate-400">Total Latency: 16.2 ms (Real-Time)</span>
        </div>

        {/* 3 Pipeline Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage.num}
              onClick={() => setActivePipelineStage(idx)}
              className={`p-4 rounded-lg border cursor-pointer transition-all relative ${
                activePipelineStage === idx
                  ? 'bg-[#10241e] border-emerald-500 shadow-md'
                  : 'bg-[#07110e] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono-code text-emerald-400 font-bold">
                  STAGE {stage.num}
                </span>
                <span className="text-[10px] font-mono-code bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                  {stage.latency}
                </span>
              </div>
              <h4 className="font-display font-semibold text-slate-100 text-sm mb-1">
                {stage.title}
              </h4>
              <span className="text-[11px] font-mono-code text-slate-400 block mb-2">
                {stage.subtitle}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Active Stage Detailed Breakdown & Planar Homography Math */}
        <div className="p-4 bg-[#060f0c] border border-emerald-900/40 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono-code text-emerald-400 font-semibold">
              STAGE {pipelineStages[activePipelineStage].num} MATHEMATICAL & INFERENCE DETAILS:
            </span>
            <span className="text-xs font-mono-code text-slate-400">
              Benchmark: <strong className="text-emerald-300">{pipelineStages[activePipelineStage].accuracy}</strong>
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {pipelineStages[activePipelineStage].desc}
          </p>

          {activePipelineStage === 1 && (
            <div className="p-3 bg-[#0a1612] border border-slate-800 rounded font-mono-code text-xs text-slate-300 space-y-2">
              <span className="text-emerald-400 font-semibold block">PLANAR HOMOGRAPHY MATRIX FORMULATION:</span>
              <div className="bg-[#050b09] p-2 rounded text-cyan-300">
                s · [X_yard, Y_yard, 1]^T = H_3x3 · [u_pixel, v_pixel, 1]^T
              </div>
              <p className="text-[11px] text-slate-400">
                Transforms high-angle angled camera feed into an exact 2D Cartesian top-down diagram, eliminating perspective parallax so distance, separation, and speed represent true physical yards.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Defensive Scheme Recognizer & AI Playbook Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheme Selector */}
        <div className="bg-[#0a1612] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-base">
                  Tactical Pattern Recognition Engine
                </h3>
              </div>
              <span className="text-xs font-mono-code text-slate-400">Coverage Classifier</span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Select an opposing defensive shell to test how the AI Coaching Pipeline identifies formation tells, calculates Expected Points Added (EPA), and delivers real-time counter-strategies.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {Object.entries(defensiveSchemes).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setSelectedScheme(key)}
                  className={`p-3 rounded text-left border transition-all ${
                    selectedScheme === key
                      ? 'bg-[#10241e] border-emerald-500 text-emerald-200 shadow'
                      : 'bg-[#07110e] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-mono-code text-emerald-400">{item.safetyCount}</div>
                  <div className="text-xs font-display font-bold text-slate-100">{item.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{item.coverageType}</div>
                </button>
              ))}
            </div>

            {/* Scheme Details Card */}
            <div className="p-4 bg-[#07110e] border border-emerald-900/60 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-400">Coverage Type:</span>
                <span className="text-emerald-300 font-bold">{defensiveSchemes[selectedScheme].coverageType}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {defensiveSchemes[selectedScheme].description}
              </p>
              <div className="border-t border-slate-800/80 pt-2 text-xs font-mono-code">
                <span className="text-rose-400 font-semibold block mb-0.5">IDENTIFIED SCHEME VULNERABILITY:</span>
                <span className="text-slate-300 text-[11px] leading-relaxed">
                  {defensiveSchemes[selectedScheme].vulnerability}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono-code text-slate-500 pt-3">
            Inferred in 1.8 seconds post-huddle using Spatio-Temporal Graph Neural Networks.
          </div>
        </div>

        {/* Real-Time AI Coaching Audible & Playbook Recommendation */}
        <div className="bg-[#0a1612] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-base">
                  Real-Time Coach Headset Audio Prompt
                </h3>
              </div>
              <span className="text-xs font-mono-code text-emerald-400 font-bold">
                {defensiveSchemes[selectedScheme].epaDelta}
              </span>
            </div>

            {/* Simulated Coach Headset Transmission */}
            <div className="p-4 bg-[#050c09] border border-emerald-800/80 rounded-lg mb-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>TACTICAL HEADSET AUDIO FEED (OFFENSIVE COORDINATOR)</span>
              </div>

              <div className="text-sm font-display font-semibold text-white bg-[#0a1612] p-3 rounded border border-emerald-900/50">
                "Coach: Defense shows {defensiveSchemes[selectedScheme].name}. Safety leverage is compromised. Recommend audible to: <span className="text-emerald-300 underline">{defensiveSchemes[selectedScheme].recommendedCounter}</span>."
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
                <div className="p-2 bg-[#08130f] rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Expected Play Value:</span>
                  <span className="text-emerald-300 font-bold">{defensiveSchemes[selectedScheme].epaDelta}</span>
                </div>
                <div className="p-2 bg-[#08130f] rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Separation Probability:</span>
                  <span className="text-cyan-300 font-bold">81.4% (Open Window &gt; 1.0s)</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#07110e] border border-slate-800 rounded text-xs text-slate-300 leading-relaxed font-mono-code">
              <span className="text-cyan-400 font-semibold block mb-1">REAL-TIME TACTICAL PIPELINE FLOW:</span>
              YOLO detects alignment $\to$ Homography maps X/Y coordinates $\to$ GNN verifies coverage $\to$ Analytics queries 10-year success rate $\to$ Play recommendation delivered before play-clock reaches 15 seconds.
            </div>
          </div>

          <div className="text-[11px] font-mono-code text-slate-500 pt-3">
            Complies with NFL sideline tablet video and coaching communication rules.
          </div>
        </div>
      </div>
    </>
  )}
</div>
  );
};
