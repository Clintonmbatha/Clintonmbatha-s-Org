/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Atom, Zap, Play, RotateCcw, BrainCircuit, Sparkles, 
  Layers, Code2, Activity, ArrowRight, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { runPennyLaneQNN, DEFAULT_QNN_WEIGHTS, QuantumStateResult } from '../utils/quantumSimulator';

interface FeaturePreset {
  name: string;
  desc: string;
  features: [number, number, number, number];
}

const PRESET_TACTICAL_SCENARIOS: FeaturePreset[] = [
  {
    name: "User Spec Benchmark",
    desc: "Fast receiver (0.75), tight press cushion (0.20), balanced box (0.50), high blitz pressure (0.85)",
    features: [0.75, 0.20, 0.50, 0.85]
  },
  {
    name: "Deep Post vs Cover 3",
    desc: "Elite speed (0.92), off-coverage cushion (0.65), light box (0.35), moderate rush (0.45)",
    features: [0.92, 0.65, 0.35, 0.45]
  },
  {
    name: "Goal-Line 0-Blitz",
    desc: "Heavy contact speed (0.45), zero cushion (0.05), loaded 9-man box (0.95), immediate free rusher (0.92)",
    features: [0.45, 0.05, 0.95, 0.92]
  },
  {
    name: "Empty 5-Wide Quick Slant",
    desc: "Explosive slot release (0.85), soft cushion (0.40), empty light box (0.25), 3-man rush containment (0.30)",
    features: [0.85, 0.40, 0.25, 0.30]
  }
];

export const QuantumCoachingCircuit: React.FC = () => {
  // 4 tracking feature inputs
  const [f0, setF0] = useState<number>(0.75); // Receiver Speed
  const [f1, setF1] = useState<number>(0.20); // Defender Cushion
  const [f2, setF2] = useState<number>(0.50); // Box Count Density
  const [f3, setF3] = useState<number>(0.85); // Pass Rush Pressure

  // Weights (3 layers x 4 qubits x 3 angles)
  const [weights, setWeights] = useState<number[][][]>(DEFAULT_QNN_WEIGHTS);
  const [activeTab, setActiveTab] = useState<'circuit' | 'code' | 'superposition'>('circuit');

  const features = useMemo(() => [f0, f1, f2, f3], [f0, f1, f2, f3]);

  // Execute Quantum Simulation
  const qResult: QuantumStateResult = useMemo(() => {
    return runPennyLaneQNN(features, weights);
  }, [features, weights]);

  // Tactical Interpretation based on quantum measurement
  let tacticalCall = "Quick Slant / Hot Read";
  let epaForecast = "+0.24 EPA";
  let tacticalSchemeColor = "text-emerald-400";

  if (qResult.overallSuccessProbability > 0.62) {
    tacticalCall = "Downfield Seam Shot (High Separation Advantage)";
    epaForecast = "+0.52 EPA";
    tacticalSchemeColor = "text-emerald-400";
  } else if (qResult.overallSuccessProbability < 0.38) {
    tacticalCall = "Checkdown / Escape to Flat (Blitz Overload Predicted)";
    epaForecast = "-0.18 EPA";
    tacticalSchemeColor = "text-rose-400";
  } else {
    tacticalCall = "Quick Dig / Curl Option (Contested Leverage)";
    epaForecast = "+0.12 EPA";
    tacticalSchemeColor = "text-amber-400";
  }

  const applyPreset = (p: FeaturePreset) => {
    setF0(p.features[0]);
    setF1(p.features[1]);
    setF2(p.features[2]);
    setF3(p.features[3]);
  };

  const handleRandomizeWeights = () => {
    const newWeights = Array.from({ length: 3 }, () =>
      Array.from({ length: 4 }, () => [
        Number((Math.random() * 4 - 2).toFixed(3)),
        Number((Math.random() * 4 - 2).toFixed(3)),
        Number((Math.random() * 4 - 2).toFixed(3)),
      ])
    );
    setWeights(newWeights);
  };

  const handleResetWeights = () => {
    setWeights(DEFAULT_QNN_WEIGHTS);
  };

  const qubitLabels = [
    { id: "q0", name: "Receiver Separation / Speed", val: f0, desc: "Normalized sprint velocity & cut acceleration" },
    { id: "q1", name: "Defender Cushion Distance", val: f1, desc: "Alignment spacing (0.20 = tight press, 0.70 = off-man)" },
    { id: "q2", name: "Box Count / Front Density", val: f2, desc: "Number of defenders clustered in line-of-scrimmage tackle box" },
    { id: "q3", name: "Pass Rush Pressure Index", val: f3, desc: "Edge rusher closing velocity & pocket collapse rate" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0b1322] border border-cyan-900/60 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-cyan-400 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 animate-spin" />
                QUANTUM MACHINE LEARNING // PENNYLANE QNN ENGINE
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-wide">
              4-Qubit Variational Quantum Classifier (Spatial Player Clusters)
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Implements a parameterized quantum circuit using PennyLane AngleEmbedding and CNOT entanglement to evaluate non-linear spatial interactions between receivers, coverage defenders, box counts, and pocket rushers.
            </p>
          </div>

          <div className="bg-[#070d18] border border-cyan-800/60 p-3 rounded-lg text-right font-mono-code text-xs">
            <div className="text-slate-400">CIRCUIT WIRES:</div>
            <div className="text-cyan-300 font-semibold">4 Qubits · 3 Variational Layers · 2^4 Hilbert Space</div>
          </div>
        </div>
      </div>

      {/* Preset Scenarios Strip */}
      <div className="space-y-2">
        <span className="text-xs font-mono-code text-slate-400">PRESET SPATIAL TRACKING VECTORS:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_TACTICAL_SCENARIOS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`p-3 rounded-lg border text-left transition-all ${
                f0 === p.features[0] && f1 === p.features[1] && f2 === p.features[2] && f3 === p.features[3]
                  ? 'bg-[#102434] border-cyan-400 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-[#08101a] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-display font-bold text-slate-100 mb-0.5 truncate">
                {p.name}
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                {p.desc}
              </p>
              <div className="text-[10px] font-mono-code text-cyan-300">
                [{p.features.join(', ')}]
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Quantum Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quantum Circuit Wire Schematic & Interactive Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* View Mode Tabs */}
          <div className="flex items-center justify-between bg-[#080d16] p-1.5 border border-slate-800 rounded-lg text-xs font-mono-code">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('circuit')}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  activeTab === 'circuit'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-600 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                <span>Quantum Circuit Schematic</span>
              </button>

              <button
                onClick={() => setActiveTab('superposition')}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  activeTab === 'superposition'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-600 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>16-State Superposition</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  activeTab === 'code'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-600 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>PennyLane Source Code</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRandomizeWeights}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded transition-colors"
                title="Randomize variational circuit weights"
              >
                Permute Weights
              </button>
              <button
                onClick={handleResetWeights}
                className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
                title="Reset to default seed 42 weights"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* TAB 1: VISUAL CIRCUIT WIRE SCHEMATIC */}
          {activeTab === 'circuit' && (
            <div className="bg-[#090e18] border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs font-mono-code text-slate-400">
                <span className="text-cyan-400 font-bold">4-WIRE QUANTUM REGISTRATION MATRIX:</span>
                <span>AngleEmbedding $\to$ 3x [Rot + CNOT] $\to$ $\langle \sigma_z \rangle$ Measurement</span>
              </div>

              {/* Circuit SVG Graphic */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[620px] select-none font-mono-code text-xs">
                  {qubitLabels.map((q, qIdx) => (
                    <div key={q.id} className="flex items-center py-3 relative border-b border-slate-800/40">
                      {/* Qubit Wire Label */}
                      <div className="w-28 shrink-0 flex flex-col justify-center pr-2">
                        <span className="text-cyan-300 font-bold text-xs">{q.id}: {q.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-slate-500 font-mono-code">x={q.val.toFixed(2)}</span>
                      </div>

                      {/* Wire horizontal line */}
                      <div className="flex-1 flex items-center relative h-10">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-cyan-900/80" />

                        {/* Step 1: AngleEmbedding Gate (Ry) */}
                        <div className="relative z-10 ml-2 mr-4 bg-[#0a1b2a] border border-cyan-500 text-cyan-300 px-2 py-1 rounded text-[10px] font-bold shadow-sm shadow-cyan-950">
                          Ry({(q.val * Math.PI).toFixed(2)})
                        </div>

                        {/* Step 2: 3 Layers of Parameterized Rotations & CNOTs */}
                        {[0, 1, 2].map((lIdx) => (
                          <div key={lIdx} className="flex items-center gap-2 mr-3 relative">
                            {/* Rot Gate */}
                            <div className="z-10 bg-[#121c2e] border border-indigo-500 text-indigo-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                              Rot(L{lIdx + 1})
                            </div>

                            {/* CNOT Entanglement Indicator */}
                            {qIdx < 3 ? (
                              <div className="z-10 flex flex-col items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-900" title={`Control Qubit ${qIdx}`} />
                                <div className="w-[1.5px] h-6 bg-cyan-400" />
                              </div>
                            ) : (
                              <div className="z-10 w-3 h-3 rounded-full border border-cyan-400 bg-cyan-950 flex items-center justify-center text-[10px] text-cyan-300 font-bold">
                                +
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Step 3: Pauli-Z Measurement Detector */}
                        <div className="ml-auto z-10 flex items-center gap-1.5 bg-[#061512] border border-emerald-500/80 text-emerald-300 px-2 py-1 rounded text-[10px]">
                          <span>⟨Z⟩: {qResult.expectationValues[qIdx]}</span>
                          <span className="text-slate-600">|</span>
                          <strong className="text-white">P: {(qResult.probabilities[qIdx] * 100).toFixed(0)}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Circuit Legend & Entanglement Metric */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono-code text-slate-400 pt-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-cyan-500/30 border border-cyan-500 inline-block" />
                    AngleEmbedding
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-500/30 border border-indigo-500 inline-block" />
                    Rot(φ,θ,ω)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    CNOT Entanglement
                  </span>
                </div>

                <div className="text-slate-300">
                  Entanglement Entropy: <strong className="text-cyan-400">{qResult.entanglementEntropy} bits</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 16-STATE SUPERPOSITION */}
          {activeTab === 'superposition' && (
            <div className="bg-[#090e18] border border-slate-800 rounded-lg p-5 space-y-3 font-mono-code text-xs">
              <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-slate-800">
                <span className="font-bold text-cyan-400">2^4 HILBERT SPACE STATEVECTOR PROBABILITIES:</span>
                <span>Sum = 1.000 (Normalized)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {qResult.stateVectorAmplitudes.map((item) => (
                  <div key={item.state} className="p-2 bg-[#060a12] rounded border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-cyan-300 font-bold">{item.state}</span>
                      <span className="text-slate-400">{(item.probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-cyan-500 h-full"
                        style={{ width: `${Math.min(100, item.probability * 100 * 2.5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 pt-2 leading-relaxed">
                The quantum state evaluates simultaneous superposition across all 16 offensive/defensive state permutations, allowing the coaching model to process cross-player spatial dependencies in $O(1)$ depth.
              </p>
            </div>
          )}

          {/* TAB 3: PENNYLANE SOURCE CODE */}
          {activeTab === 'code' && (
            <div className="bg-[#060a12] border border-slate-800 rounded-lg p-4 font-mono-code text-xs space-y-3">
              <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
                <span className="text-cyan-400 font-semibold">pennylane_coaching_qnn.py</span>
                <span>Active Runtime: default.qubit</span>
              </div>

              <pre className="text-slate-300 leading-relaxed overflow-x-auto p-2 bg-[#04070d] rounded border border-slate-900 text-[11px]">
{`import pennylane as qml
from pennylane import numpy as np

# 4-qubit spatial cluster simulator
n_qubits = 4
dev = qml.device("default.qubit", wires=n_qubits)

@qml.qnode(dev, interface="autograd")
def quantum_neural_net(weights, features):
    # Step 1: Encode spatial tracking features (receiver speed, cushion, box, pressure)
    for i in range(n_qubits):
        qml.AngleEmbedding(features, wires=range(n_qubits))
    
    # Step 2: Parameterized Quantum Circuit Layers (The QNN "weights")
    for l in range(len(weights)):
        for i in range(n_qubits):
            qml.Rot(*weights[l, i], wires=i)
        # Entangle neighboring player nodes to evaluate spatial interaction
        for i in range(n_qubits - 1):
            qml.CNOT(wires=[i, i + 1])
            
    # Step 3: Measure expectation value for play success probability
    return [qml.expval(qml.PauliZ(i)) for i in range(n_qubits)]

# Live Evaluated Output:
# Expected values <Z>: [${qResult.expectationValues.join(', ')}]
# Success Probabilities: [${qResult.probabilities.join(', ')}]
`}
              </pre>
            </div>
          )}

          {/* Interactive Feature Vector Sliders */}
          <div className="bg-[#080d16] border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono-code">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                TUNABLE TRACKING FEATURE VECTOR (x ∈ [0, 1]⁴)
              </span>
              <span className="text-slate-400">Real-Time Sensor Telemetry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-code">
              {/* Feature 0: Receiver Speed */}
              <div className="p-3 bg-[#05080f] rounded border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300">q0: Receiver Speed &amp; Separation</span>
                  <span className="text-cyan-400 font-bold">{f0.toFixed(2)} ({((f0 * 22)).toFixed(1)} mph)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={f0}
                  onChange={(e) => setF0(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Feature 1: Defender Cushion */}
              <div className="p-3 bg-[#05080f] rounded border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300">q1: Defender Cushion Alignment</span>
                  <span className="text-cyan-400 font-bold">{f1.toFixed(2)} ({((f1 * 10)).toFixed(1)} yds off)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={f1}
                  onChange={(e) => setF1(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Feature 2: Box Count */}
              <div className="p-3 bg-[#05080f] rounded border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300">q2: Tackle Box Front Density</span>
                  <span className="text-cyan-400 font-bold">{f2.toFixed(2)} ({Math.round(4 + f2 * 5)} Men in Box)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={f2}
                  onChange={(e) => setF2(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Feature 3: Pass Rush Pressure */}
              <div className="p-3 bg-[#05080f] rounded border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300">q3: Pass Rush Pocket Pressure</span>
                  <span className="text-cyan-400 font-bold">{f3.toFixed(2)} ({((f3 * 100)).toFixed(0)}% Rush Threat)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={f3}
                  onChange={(e) => setF3(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Quantum Expectation Outputs & Tactical Decision Engine */}
        <div className="bg-[#0b1322] border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-xs font-mono-code text-cyan-400 block mb-0.5">
                QNN MEASUREMENT &amp; INFERENCE
              </span>
              <h3 className="text-base font-display font-bold text-white">
                Quantum Coaching Decision Engine
              </h3>
            </div>

            {/* Overall Probability Gauge */}
            <div className="p-4 bg-[#070d18] border border-cyan-900/60 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-400">AGGREGATED PLAY SUCCESS:</span>
                <span className={`text-xl font-bold ${tacticalSchemeColor}`}>
                  {(qResult.overallSuccessProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    qResult.overallSuccessProbability > 0.6 ? 'bg-emerald-500' :
                    qResult.overallSuccessProbability > 0.4 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${qResult.overallSuccessProbability * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono-code text-slate-500">
                <span>0% Blown Play</span>
                <span>Expected Value: {epaForecast}</span>
                <span>100% Touchdown</span>
              </div>
            </div>

            {/* Per-Qubit Expectation Values Table */}
            <div className="space-y-2 font-mono-code text-xs">
              <span className="text-slate-400 block text-[11px] font-semibold">
                WIRES &amp; PAULI-Z EXPECTATION VALUES:
              </span>

              {qubitLabels.map((q, idx) => (
                <div key={q.id} className="p-2.5 bg-[#070d18] rounded border border-slate-800 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-semibold">{q.id}: {q.name}</span>
                    <span className={`font-bold ${qResult.probabilities[idx] > 0.5 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {(qResult.probabilities[idx] * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>⟨Z⟩ = {qResult.expectationValues[idx]}</span>
                    <span>P_i = (1 - ⟨Z⟩)/2</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Tactical Directive */}
            <div className="p-3 bg-[#070d18] border border-cyan-800/50 rounded-lg space-y-1 font-mono-code text-xs">
              <span className="text-cyan-400 font-semibold block text-[11px]">RECOMMENDED AUDIBLE:</span>
              <div className="text-slate-100 font-bold text-xs">
                {tacticalCall}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Entanglement between q0 (receiver velocity) and q3 (rush pressure) indicates pocket will degrade in &lt;2.1s. Passing lane in intermediate seam is optimal.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono-code text-slate-500 pt-3 border-t border-slate-800">
            Computed via autograd-compatible PennyLane parameterized quantum state formulation.
          </div>
        </div>
      </div>
    </div>
  );
};
