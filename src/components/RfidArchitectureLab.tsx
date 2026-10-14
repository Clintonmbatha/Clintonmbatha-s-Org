/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Radio, Cpu, Signal, ArrowRight, Zap, RefreshCw, 
  Wifi, ShieldCheck, Check, Layers, Sliders
} from 'lucide-react';
import { SPORTS_AI_DOCUMENTS } from '../data/sportsAiKnowledge';

export const RfidArchitectureLab: React.FC = () => {
  const doc = SPORTS_AI_DOCUMENTS.find(d => d.id === 'doc_002')!;

  // Interactive RF propagation parameters
  const [txPowerDbm, setTxPowerDbm] = useState<number>(24); // dBm (e.g. 250mW)
  const [distanceMeters, setDistanceMeters] = useState<number>(22); // meters (stadium bowl to field)
  const [frequencyGhz, setFrequencyGhz] = useState<number>(6.49); // GHz (Ultra-Wideband)
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedComponent, setSelectedComponent] = useState<number>(0);

  // Friis Path Loss formula calculation:
  // Path Loss (dB) = 20 * log10(d) + 20 * log10(f_Hz) - 147.55
  // Received Power Pr (dBm) = Pt + Gt + Gr - PathLoss
  const speedOfLight = 3e8;
  const fHz = frequencyGhz * 1e9;
  const lambda = speedOfLight / fHz;
  const pathLossDb = Math.max(0, 20 * Math.log10(distanceMeters) + 20 * Math.log10(fHz) - 147.55);
  const txGain = 6; // dBi patch antenna
  const rxGain = 1.5; // dBi tag antenna
  const receivedPowerDbm = (txPowerDbm + txGain + rxGain - pathLossDb).toFixed(1);
  const snr = Math.max(0, (parseFloat(receivedPowerDbm) - (-95))).toFixed(1); // Receiver noise floor -95 dBm

  // Protocol steps
  const protocolSteps = [
    {
      title: "1. Reader Radio Field Broadcast",
      sub: "Active RF Carrier Wave",
      detail: "Stadium catwalk antennas emit continuous radio frequency waves at synchronized picosecond time intervals, creating an omnipresent 3D electromagnetic tracking field covering the entire 120-yard stadium floor.",
      tech: "65° Directional Patch Antennas · IEEE 1588 PTP Synchronization"
    },
    {
      title: "2. Electromagnetic Coupling & Wake-Up",
      sub: "Tag Power Harvesting",
      detail: "As a player cuts across the field, the RF waves intercept the shoulder pad tag antenna. The miniaturized microchip harvests incident RF energy to power up its low-voltage logic core.",
      tech: "Ultra-low power ASIC · 3.8g Resin Enclosure"
    },
    {
      title: "3. Backscatter & UWB Chirp Return",
      sub: "20Hz Deterministic Telemetry",
      detail: "The tag modulates its antenna impedance to reflect an encoded 128-bit payload chirp containing player identifier (e.g. #15 Mahomes) and timestamp, transmitting at 20 pulses per second (50ms interval).",
      tech: "Direct-sequence UWB pulse · Multi-path immune"
    },
    {
      title: "4. Edge Multilateration & Data Ingestion",
      sub: "TDOA Coordinate Solving",
      detail: "A minimum of 4 perimeter readers receive the pulse at fractionally different nanosecond timestamps (Time Difference of Arrival). The stadium edge compute cluster executes multilateration to yield (X, Y, Z) coordinates with ±12 cm precision.",
      tech: "TDOA Solver · Extended Kalman Filter (EKF) · Kafka 440 pkts/s"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#0e1622] border border-cyan-900/50 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-cyan-400">DOC_002 · HARDWARE / SENSOR TECHNOLOGY</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-wide">
              {doc.topic}
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {doc.summary}
            </p>
          </div>

          <div className="bg-[#090f18] border border-cyan-800/60 p-3 rounded-lg text-right font-mono-code text-xs">
            <div className="text-slate-400">TRACKING PRECISION:</div>
            <div className="text-cyan-300 font-semibold">{doc.impact_metric}</div>
          </div>
        </div>
      </div>

      {/* 4 Core Components of doc_002 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {doc.system_components.map((comp, idx) => (
          <div
            key={comp.component_name}
            onClick={() => setSelectedComponent(idx)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedComponent === idx
                ? 'bg-[#102030] border-cyan-500/70 shadow-lg'
                : 'bg-[#0a121c] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-code text-cyan-400">0{idx + 1} // COMPONENT</span>
              {selectedComponent === idx && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
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
      <div className="bg-[#0c1420] border border-slate-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="font-display font-bold text-slate-100 text-base">
            System Component Deep Dive: {doc.system_components[selectedComponent].component_name}
          </h3>
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          {doc.system_components[selectedComponent].description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-code">
          <div className="p-3 bg-[#080d16] border border-slate-800/80 rounded">
            <span className="text-cyan-400 block mb-1 font-semibold">HARDWARE & PROTOCOL ARCHITECTURE</span>
            <p className="text-slate-300 leading-relaxed">
              {doc.system_components[selectedComponent].technical_specs}
            </p>
          </div>

          <div className="p-3 bg-[#080d16] border border-slate-800/80 rounded">
            <span className="text-cyan-400 block mb-1 font-semibold">BENCHMARK METRICS</span>
            <ul className="space-y-1 text-slate-300">
              {doc.system_components[selectedComponent].metrics?.map((m, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-cyan-500">›</span> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Communication Flow & Friis Equation Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step-by-Step Communication Protocol Walkthrough */}
        <div className="bg-[#0c1420] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-white text-base">
                  Interactive RFID Communication Loop
                </h3>
              </div>
              <span className="text-xs font-mono-code text-slate-400">Protocol Flow</span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Click through the 4-stage RF transmission loop that occurs 20 times every second for each player on the field:
            </p>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {protocolSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-2 rounded text-left transition-all border ${
                    activeStep === idx
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow'
                      : 'bg-[#080d16] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-mono-code">STAGE 0{idx + 1}</div>
                  <div className="text-xs font-semibold truncate">{step.sub}</div>
                </button>
              ))}
            </div>

            {/* Active Step Content */}
            <div className="p-4 bg-[#080d16] border border-cyan-900/60 rounded-lg space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-display font-bold text-cyan-300">
                  {protocolSteps[activeStep].title}
                </h4>
                <span className="text-[10px] font-mono-code bg-cyan-950 px-2 py-0.5 rounded text-cyan-400 border border-cyan-800">
                  LATENCY: ~{(activeStep * 3.1 + 1.2).toFixed(1)}ms
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {protocolSteps[activeStep].detail}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span>TECH STACK:</span>
                <span className="text-slate-200 font-semibold">{protocolSteps[activeStep].tech}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 3))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono-code rounded text-slate-300 transition-colors"
            >
              Previous Phase
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev < 3 ? prev + 1 : 0))}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-xs font-mono-code rounded text-slate-950 font-bold transition-colors"
            >
              Next Phase →
            </button>
          </div>
        </div>

        {/* Sandbox: Friis RF Signal Propagation & Link Budget Simulator */}
        <div className="bg-[#0c1420] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Signal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-base">
                  RF Link Budget & Free-Space Path Loss
                </h3>
              </div>
              <span className="text-xs font-mono-code text-slate-400">Friis Transmission Physics</span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Adjust stadium transmitter power and antenna distance to model signal attenuation across the field.
            </p>

            {/* Readout metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-[#080d16] p-2.5 rounded border border-slate-800">
                <span className="text-[11px] font-mono-code text-slate-400 block mb-0.5">Path Loss:</span>
                <span className="text-lg font-mono-code font-bold text-amber-400">
                  -{pathLossDb.toFixed(1)} dB
                </span>
              </div>

              <div className="bg-[#080d16] p-2.5 rounded border border-slate-800">
                <span className="text-[11px] font-mono-code text-slate-400 block mb-0.5">Tag Power:</span>
                <span className={`text-lg font-mono-code font-bold ${parseFloat(receivedPowerDbm) > -75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {receivedPowerDbm} dBm
                </span>
              </div>

              <div className="bg-[#080d16] p-2.5 rounded border border-slate-800">
                <span className="text-[11px] font-mono-code text-slate-400 block mb-0.5">SNR Margin:</span>
                <span className="text-lg font-mono-code font-bold text-cyan-400">
                  +{snr} dB
                </span>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 mb-4">
              <div>
                <div className="flex justify-between text-xs font-mono-code mb-1">
                  <span className="text-slate-300">Reader Transmission Power ($P_t$)</span>
                  <span className="text-cyan-400 font-bold">{txPowerDbm} dBm ({(Math.pow(10, txPowerDbm/10)).toFixed(0)} mW)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  value={txPowerDbm}
                  onChange={(e) => setTxPowerDbm(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-code mb-1">
                  <span className="text-slate-300">Catwalk to Tag Distance ($d$)</span>
                  <span className="text-cyan-400 font-bold">{distanceMeters} meters</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={distanceMeters}
                  onChange={(e) => setDistanceMeters(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-code mb-1">
                  <span className="text-slate-300">Carrier Frequency Band</span>
                  <span className="text-cyan-400 font-bold">{frequencyGhz} GHz</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFrequencyGhz(6.49)}
                    className={`flex-1 py-1 text-xs font-mono-code rounded border ${
                      frequencyGhz === 6.49
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                        : 'bg-[#080d16] text-slate-400 border-slate-800'
                    }`}
                  >
                    6.49 GHz (UWB Channel 5)
                  </button>
                  <button
                    onClick={() => setFrequencyGhz(0.915)}
                    className={`flex-1 py-1 text-xs font-mono-code rounded border ${
                      frequencyGhz === 0.915
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                        : 'bg-[#080d16] text-slate-400 border-slate-800'
                    }`}
                  >
                    915 MHz (UHF Gen2)
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#080d16] border border-slate-800 rounded text-xs font-mono-code text-slate-300">
              <span className="text-emerald-400 font-semibold block mb-0.5">PHYSICAL LINK STATUS:</span>
              {parseFloat(receivedPowerDbm) > -80
                ? 'Optimal link budget. SNR margin is sufficient to overcome rain droplet multi-path reflections and maintain sub-millisecond TDOA lock.'
                : 'Marginal link budget. Increased antenna beamforming gain recommended to sustain 20Hz continuous tracking.'}
            </div>
          </div>

          <div className="text-[11px] font-mono-code text-slate-500 pt-3">
            Zebra Sports RFID Architecture · Standard NFL Game Operations Spec
          </div>
        </div>
      </div>
    </div>
  );
};
