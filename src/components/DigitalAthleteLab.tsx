/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Activity, ShieldAlert, Cpu, HeartPulse, Sparkles, 
  AlertTriangle, CheckCircle, Info, ChevronRight, Zap,
  Sliders, User, Dumbbell, Compass, RefreshCw
} from 'lucide-react';
import { SPORTS_AI_DOCUMENTS, INITIAL_FIELD_PLAYERS, TacticalPlayer, BiomechanicalWearableData } from '../data/sportsAiKnowledge';
import { BiomechanicalWearablesModule } from './BiomechanicalWearablesModule';

export const DigitalAthleteLab: React.FC = () => {
  const doc = SPORTS_AI_DOCUMENTS.find(d => d.id === 'doc_001')!;

  const [activeLabSubView, setActiveLabSubView] = useState<'wearables_trends' | 'architecture_acwr'>('wearables_trends');

  // Players with rich wearable sensor telemetry
  const telemetryPlayers = INITIAL_FIELD_PLAYERS.filter(p => p.biomechanics !== undefined);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(4); // Default to WR #4 Rashee Rice (high risk valgus)

  const activePlayer = telemetryPlayers.find(p => p.id === selectedPlayerId) || telemetryPlayers[0];

  // Editable/Interactive wearable metrics based on active player
  const [kneeValgus, setKneeValgus] = useState<number>(activePlayer.biomechanics?.jointAngles.kneeValgusDeg || 14.8);
  const [kneeFlexion, setKneeFlexion] = useState<number>(activePlayer.biomechanics?.jointAngles.kneeFlexionDeg || 28);
  const [hipExtension, setHipExtension] = useState<number>(activePlayer.biomechanics?.jointAngles.hipExtensionDeg || 12);
  const [ankleDorsiflexion, setAnkleDorsiflexion] = useState<number>(activePlayer.biomechanics?.jointAngles.ankleDorsiflexionDeg || 15);
  const [grfBW, setGrfBW] = useState<number>(activePlayer.biomechanics?.impactForces.peakGroundReactionForceBW || 5.4);
  const [decelImpulse, setDecelImpulse] = useState<number>(activePlayer.biomechanics?.impactForces.decelerationImpulseNs || 980);
  const [collisionG, setCollisionG] = useState<number>(activePlayer.biomechanics?.impactForces.impactCollisionG || 18.2);
  const [limbAsymmetry, setLimbAsymmetry] = useState<number>(activePlayer.biomechanics?.impactForces.limbAsymmetryPct || 14.6);
  const [hipRomDeficit, setHipRomDeficit] = useState<number>(activePlayer.biomechanics?.rangeOfMotion.hipExtensionDeficitPct || -14.2);

  // ACWR State
  const [acuteLoad, setAcuteLoad] = useState<number>(4400); // 7-day load (AU)
  const [chronicLoad, setChronicLoad] = useState<number>(2950); // 28-day weekly average (AU)
  const [selectedComponent, setSelectedComponent] = useState<number>(0);

  // When player changes, update state
  const handleSelectPlayer = (id: number) => {
    setSelectedPlayerId(id);
    const p = telemetryPlayers.find(pl => pl.id === id);
    if (p && p.biomechanics) {
      setKneeValgus(p.biomechanics.jointAngles.kneeValgusDeg);
      setKneeFlexion(p.biomechanics.jointAngles.kneeFlexionDeg);
      setHipExtension(p.biomechanics.jointAngles.hipExtensionDeg);
      setAnkleDorsiflexion(p.biomechanics.jointAngles.ankleDorsiflexionDeg);
      setGrfBW(p.biomechanics.impactForces.peakGroundReactionForceBW);
      setDecelImpulse(p.biomechanics.impactForces.decelerationImpulseNs);
      setCollisionG(p.biomechanics.impactForces.impactCollisionG);
      setLimbAsymmetry(p.biomechanics.impactForces.limbAsymmetryPct);
      setHipRomDeficit(p.biomechanics.rangeOfMotion.hipExtensionDeficitPct);
    }
  };

  // Dynamic calculations based on live sliders
  const acwr = (acuteLoad / (chronicLoad || 1)).toFixed(2);
  const numAcwr = parseFloat(acwr);

  // Computed Detailed Injury Probabilities
  const computedAclRisk = Math.min(96, Math.max(5, Math.round(
    (kneeValgus / 16) * 45 + 
    (grfBW / 6.0) * 35 + 
    (limbAsymmetry / 15) * 15 +
    (kneeFlexion < 30 ? 15 : 0)
  )));

  const computedHamstringRisk = Math.min(94, Math.max(8, Math.round(
    (Math.abs(hipRomDeficit) / 15) * 40 +
    (decelImpulse / 1000) * 35 +
    (numAcwr > 1.3 ? 20 : 0)
  )));

  let patellarTendonStatus: 'low' | 'moderate' | 'critical' = 'low';
  if (grfBW > 4.8 || decelImpulse > 850) {
    patellarTendonStatus = grfBW > 5.2 && decelImpulse > 900 ? 'critical' : 'moderate';
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#0e1320] border border-slate-800 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-rose-400">DOC_001 · SPORTS ANALYTICS / PREDICTIVE AI</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-wide">
              {doc.topic} · Wearable Biomechanics Integration
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Integrates high-frequency IMU joint angle tracking, smart-insole ground reaction forces ($GRF$), and range of motion (ROM) sensors directly into the NFL Digital Athlete predictive injury platform.
            </p>
          </div>

          <div className="bg-[#090d16] border border-slate-800 p-3 rounded-lg text-right font-mono-code text-xs">
            <div className="text-slate-400">CLINICAL IMPACT:</div>
            <div className="text-emerald-400 font-semibold">{doc.impact_metric}</div>
          </div>
        </div>
      </div>

      {/* Sub-view switcher within Digital Athlete Lab */}
      <div className="flex flex-wrap items-center gap-2 bg-[#090e18] p-1.5 border border-slate-800 rounded-lg font-mono-code text-xs">
        <button
          onClick={() => setActiveLabSubView('wearables_trends')}
          className={`flex-1 min-w-[240px] flex items-center justify-center gap-2 py-2 px-3 rounded transition-all ${
            activeLabSubView === 'wearables_trends'
              ? 'bg-rose-950 text-rose-200 border border-rose-500 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-rose-400" />
          <span>Biomechanical Wearables &amp; Risk Trend Charts</span>
        </button>

        <button
          onClick={() => setActiveLabSubView('architecture_acwr')}
          className={`flex-1 min-w-[240px] flex items-center justify-center gap-2 py-2 px-3 rounded transition-all ${
            activeLabSubView === 'architecture_acwr'
              ? 'bg-[#121c2e] text-cyan-200 border border-cyan-500 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Digital Athlete Architecture &amp; ACWR Engine</span>
        </button>
      </div>

      {activeLabSubView === 'wearables_trends' ? (
        <BiomechanicalWearablesModule />
      ) : (
        <>
          {/* 3 Core System Components Interactive Switcher */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doc.system_components.map((comp, idx) => (
          <div
            key={comp.component_name}
            onClick={() => setSelectedComponent(idx)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedComponent === idx
                ? 'bg-[#121829] border-rose-500/70 shadow-lg'
                : 'bg-[#0b0f1a] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-code text-rose-400">MODULE 0{idx + 1}</span>
              {selectedComponent === idx && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
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

      {/* Component Specs strip */}
      <div className="bg-[#0c111e] border border-slate-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-rose-400" />
          <h3 className="font-display font-bold text-slate-100 text-base">
            System Component Deep Dive: {doc.system_components[selectedComponent].component_name}
          </h3>
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          {doc.system_components[selectedComponent].description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-code">
          <div className="p-3 bg-[#080c14] border border-slate-800/80 rounded">
            <span className="text-rose-400 block mb-1 font-semibold">TECHNICAL SPECIFICATIONS</span>
            <p className="text-slate-300 leading-relaxed">
              {doc.system_components[selectedComponent].technical_specs}
            </p>
          </div>

          <div className="p-3 bg-[#080c14] border border-slate-800/80 rounded">
            <span className="text-rose-400 block mb-1 font-semibold">KEY METRICS & SENSORS</span>
            <ul className="space-y-1 text-slate-300">
              {doc.system_components[selectedComponent].metrics?.map((m, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-rose-500">›</span> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* NEW: Wearable Sensor Player Telemetry Suite */}
      <div className="bg-[#0c1322] border border-rose-900/60 rounded-lg p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-400" />
            <h3 className="font-display font-bold text-white text-base">
              Live Wearable Biomechanical Telemetry Suite
            </h3>
          </div>

          {/* Player Selection Ribbon */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono-code text-slate-400 mr-1">ATHLETE:</span>
            {telemetryPlayers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPlayer(p.id)}
                className={`px-2.5 py-1 text-xs font-mono-code rounded border transition-colors ${
                  selectedPlayerId === p.id
                    ? 'bg-rose-950 text-rose-300 border-rose-600 font-bold'
                    : 'bg-[#080d16] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                #{p.jersey} {p.name.split(' ')[1]} ({p.role})
              </button>
            ))}
          </div>
        </div>

        {/* 3 Biomechanical Metrics Pillars: Joint Angles, Impact Forces, Range of Motion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-code">
          {/* Pillar 1: Joint Angles */}
          <div className="bg-[#080e19] p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-rose-400 font-bold pb-1 border-b border-slate-800/80">
              <span>01 · JOINT KINEMATIC ANGLES</span>
              <span className="text-[10px] text-slate-400">100Hz Tri-Axial IMUs</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Knee Valgus (Frontal Plane):</span>
                  <span className={`font-bold ${kneeValgus > 12 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {kneeValgus.toFixed(1)}° ({kneeValgus > 12 ? 'High Collapse' : 'Safe <10°'})
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="22"
                  step="0.2"
                  value={kneeValgus}
                  onChange={(e) => setKneeValgus(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Knee Flexion (Plant Angle):</span>
                  <span className={`font-bold ${kneeFlexion < 32 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {kneeFlexion}° ({kneeFlexion < 32 ? 'Stiff Knee Drop' : 'Good Absorption'})
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={kneeFlexion}
                  onChange={(e) => setKneeFlexion(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Ankle Dorsiflexion:</span>
                  <span className={`font-bold ${ankleDorsiflexion < 18 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {ankleDorsiflexion}° ({ankleDorsiflexion < 18 ? 'Stiff / Achilles Strain' : 'Mobile'})
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  value={ankleDorsiflexion}
                  onChange={(e) => setAnkleDorsiflexion(Number(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Pillar 2: Impact Forces */}
          <div className="bg-[#080e19] p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold pb-1 border-b border-slate-800/80">
              <span>02 · IMPACT FORCES & IMPULSE</span>
              <span className="text-[10px] text-slate-400">Smart Insole Sensors</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Peak Ground Reaction Force:</span>
                  <span className={`font-bold ${grfBW > 4.8 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {grfBW.toFixed(1)}x BW ({Math.round(grfBW * 92 * 9.81)} N)
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
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Deceleration Impulse ($J$):</span>
                  <span className={`font-bold ${decelImpulse > 800 ? 'text-rose-400' : 'text-slate-200'}`}>
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

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Limb Asymmetry Index:</span>
                  <span className={`font-bold ${limbAsymmetry > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {limbAsymmetry.toFixed(1)}% ({limbAsymmetry > 10 ? 'Unbalanced' : 'Symmetrical'})
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.5"
                  value={limbAsymmetry}
                  onChange={(e) => setLimbAsymmetry(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Pillar 3: Range of Motion (ROM) */}
          <div className="bg-[#080e19] p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-bold pb-1 border-b border-slate-800/80">
              <span>03 · RANGE OF MOTION (ROM)</span>
              <span className="text-[10px] text-slate-400">Dynamic Girth & Flex</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Hip Extension Deficit:</span>
                  <span className={`font-bold ${Math.abs(hipRomDeficit) > 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {hipRomDeficit.toFixed(1)}%
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
              </div>

              <div className="p-2.5 bg-[#0b1424] rounded border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Knee Flexion Arc:</span>
                  <span className="text-slate-100 font-bold">{activePlayer.biomechanics?.rangeOfMotion.activeKneeFlexionArc || 135}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thoracic Spine Rotation:</span>
                  <span className="text-slate-100 font-bold">{activePlayer.biomechanics?.rangeOfMotion.thoracicRotationDeg || 45}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Collision Force (Mouthguard):</span>
                  <span className="text-amber-400 font-bold">{collisionG} g</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed">
                Hip extension deficits force the hamstring into excessive eccentric elongation during terminal sprint swing phase.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Injury Risk Assessment & Performance Recommendations Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Detailed Risk Breakdown */}
          <div className="p-4 bg-[#080d16] border border-rose-900/50 rounded-lg space-y-3 font-mono-code text-xs">
            <span className="text-rose-400 font-semibold block pb-1 border-b border-slate-800">
              DETAILED INJURY RISK ASSESSMENT MATRIX:
            </span>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">ACL / MCL Shear Strain Probability:</span>
                  <span className={`font-bold ${computedAclRisk > 60 ? 'text-rose-400' : computedAclRisk > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {computedAclRisk}% ({computedAclRisk > 60 ? 'HIGH COLLAPSE DANGER' : 'EVALUATED OK'})
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${computedAclRisk > 60 ? 'bg-rose-500' : computedAclRisk > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${computedAclRisk}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Hamstring Eccentric Tear Risk:</span>
                  <span className={`font-bold ${computedHamstringRisk > 60 ? 'text-rose-400' : computedHamstringRisk > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {computedHamstringRisk}% ({computedHamstringRisk > 60 ? 'CRITICAL ECCENTRIC STRAIN' : 'SAFE'})
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${computedHamstringRisk > 60 ? 'bg-rose-500' : computedHamstringRisk > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${computedHamstringRisk}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-2 bg-[#0c1424] rounded border border-slate-800">
                <span className="text-slate-400">Patellar Tendon Stress:</span>
                <span className={`font-bold uppercase ${
                  patellarTendonStatus === 'critical' ? 'text-rose-400' :
                  patellarTendonStatus === 'moderate' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {patellarTendonStatus} Stress ({grfBW.toFixed(1)}x BW)
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 bg-rose-950/20 p-2.5 rounded border border-rose-900/40">
              <strong className="text-rose-400 block mb-0.5">PRIMARY BIOMECHANICAL FACTOR:</strong>
              {activePlayer.biomechanics?.detailedRiskAssessment.primaryRiskFactor || "Dynamic kinetic chain monitored in real time."}
            </div>
          </div>

          {/* Actionable Performance Recommendations */}
          <div className="p-4 bg-[#080d16] border border-cyan-900/50 rounded-lg space-y-3 font-mono-code text-xs">
            <span className="text-cyan-400 font-semibold block pb-1 border-b border-slate-800">
              TARGETED BIOMECHANICAL & PERFORMANCE RECOMMENDATIONS:
            </span>

            <div className="space-y-2">
              <div className="p-2.5 bg-[#0b1320] rounded border border-slate-800">
                <span className="text-emerald-400 block text-[11px] font-semibold mb-0.5">TRAINING ADJUSTMENT:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activePlayer.biomechanics?.performanceRecommendations.trainingAdjustment || "Prescribe eccentric loading and posterior chain strength balance."}
                </p>
              </div>

              <div className="p-2.5 bg-[#0b1320] rounded border border-slate-800">
                <span className="text-rose-400 block text-[11px] font-semibold mb-0.5">IN-GAME ACTION DIRECTIVE:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activePlayer.biomechanics?.performanceRecommendations.inGameAction || "Standard game volume clearance."}
                </p>
              </div>

              <div className="p-2.5 bg-[#0b1320] rounded border border-slate-800">
                <span className="text-cyan-400 block text-[11px] font-semibold mb-0.5">SIDELINE KINETIC INTERVENTION:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activePlayer.biomechanics?.performanceRecommendations.kineticIntervention || "Sideline resistance band activations before next offensive series."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACWR Simulator Card */}
      <div className="bg-[#0c111e] border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <h3 className="font-display font-bold text-white text-base">
              Workload Progression & ACWR Fatigue Engine
            </h3>
          </div>
          <span className="text-xs font-mono-code text-slate-400">Chronic vs Acute Workload (AU)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-slate-300">Acute Workload (Last 7 Days)</span>
                <span className="text-cyan-400 font-bold">{acuteLoad} AU</span>
              </div>
              <input
                type="range"
                min="1500"
                max="6500"
                step="50"
                value={acuteLoad}
                onChange={(e) => setAcuteLoad(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono-code mb-1">
                <span className="text-slate-300">Chronic Workload (Last 28 Days Avg)</span>
                <span className="text-indigo-400 font-bold">{chronicLoad} AU</span>
              </div>
              <input
                type="range"
                min="2000"
                max="5500"
                step="50"
                value={chronicLoad}
                onChange={(e) => setChronicLoad(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 bg-[#080d16] rounded border border-slate-800 flex flex-col justify-between font-mono-code text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Calculated ACWR:</span>
              <span className={`text-2xl font-bold ${numAcwr > 1.5 ? 'text-rose-400' : numAcwr > 1.3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {acwr}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed pt-2">
              {numAcwr > 1.5
                ? '⚠️ Danger Zone (>1.5): Acute spike significantly outpaces chronic conditioning. Correlated with 2.8x increase in non-contact soft tissue strains.'
                : numAcwr < 0.8
                ? 'Under-preparedness Zone (<0.8): Detraining detected. Sudden exposure to maximal match intensity poses shock risk.'
                : 'Optimal Sweet Spot (0.8 - 1.3): Athlete has adapted to physical demands; soft tissue injury hazard is minimized.'}
            </p>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
  );
};
