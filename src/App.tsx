/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Activity, Radio, CloudRain, BrainCircuit, Network, 
  FileText, Shield, Cpu, Sparkles, Terminal, Download, 
  Layers, ExternalLink, HelpCircle, Eye, ChevronRight, Atom
} from 'lucide-react';
import { TacticalFieldVisualizer, VisualizerMode } from './components/TacticalFieldVisualizer';
import { DigitalAthleteLab } from './components/DigitalAthleteLab';
import { RfidArchitectureLab } from './components/RfidArchitectureLab';
import { WeatherSensorFusionLab } from './components/WeatherSensorFusionLab';
import { CoachingPipelineLab } from './components/CoachingPipelineLab';
import { WeatherTacticalCoachingModule } from './components/WeatherTacticalCoachingModule';
import { QuantumCoachingCircuit } from './components/QuantumCoachingCircuit';
import { SystemArchitectureMap } from './components/SystemArchitectureMap';
import { TechnicalDocReader } from './components/TechnicalDocReader';
import { TechnicalBriefingModal } from './components/TechnicalBriefingModal';

type AppTab = 'field_command' | 'deep_dive' | 'weather_tactics' | 'quantum_qnn' | 'architecture_flow' | 'documents';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('field_command');
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('digital_athlete');
  const [selectedLabDocId, setSelectedLabDocId] = useState<string>('doc_001');
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(false);

  // When jumping from visualizer to deep dive
  const handleOpenDocTopic = (docId: string) => {
    setSelectedLabDocId(docId);
    setActiveTab('deep_dive');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Mission Control Header */}
      <header className="border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-display font-black text-slate-950 text-lg shadow-md shadow-cyan-500/20">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-base tracking-wider text-white">
                  KINETIC<span className="text-cyan-400">GRID</span>
                </h1>
                <span className="text-[10px] font-mono-code bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                  NFL NEXTGEN // AI
                </span>
              </div>
              <p className="text-[11px] font-mono-code text-slate-400 hidden sm:block">
                Digital Athlete · Stadium RFID Mesh · Sensor Fusion · Tactical Vision
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-[#05070c] p-1 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('field_command')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code transition-all ${
                activeTab === 'field_command'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Field Command</span>
              <span className="md:hidden">Field</span>
            </button>

            <button
              onClick={() => setActiveTab('deep_dive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code transition-all ${
                activeTab === 'deep_dive'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Component Labs</span>
              <span className="md:hidden">Labs</span>
            </button>

            <button
              onClick={() => setActiveTab('weather_tactics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code transition-all ${
                activeTab === 'weather_tactics'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-600/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Weather Tactical AI</span>
              <span className="md:hidden">Weather</span>
            </button>

            <button
              onClick={() => setActiveTab('quantum_qnn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code transition-all ${
                activeTab === 'quantum_qnn'
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-600/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Atom className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Quantum QNN</span>
              <span className="md:hidden">QNN</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture_flow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code transition-all ${
                activeTab === 'architecture_flow'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Architecture Map</span>
              <span className="md:hidden">Flow</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code transition-all ${
                activeTab === 'documents'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Spec Docs (4)</span>
              <span className="md:hidden">Docs</span>
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBriefingOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold px-3 py-1.5 rounded text-xs font-mono-code transition-all shadow-md shadow-cyan-950"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Briefing</span>
            </button>
          </div>
        </div>

        {/* Global Live Stadium Telemetry Status Bar */}
        <div className="bg-[#05070c] border-t border-slate-800/80 px-4 sm:px-6 py-1.5 text-[11px] font-mono-code text-slate-400 flex flex-wrap items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              RFID 20Hz UWB SYNC
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-300">
              CV ENGINE: <strong className="text-cyan-300">YOLOv10 @ 60 FPS</strong>
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-300">
              WEATHER FUSION: <strong className="text-emerald-400">KALMAN UNCERTAINTY &lt; 0.08m</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-slate-400">
            <span>STADIUM: <strong>Arrowhead Stadium / Catwalk Array</strong></span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">ACTIVE PLAYERS: <strong className="text-cyan-400">22 / 22 TRACKED</strong></span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* VIEW 1: FIELD COMMAND (Interactive Canvas & 4-Lens Visualizer) */}
        {activeTab === 'field_command' && (
          <div className="space-y-4">
            <TacticalFieldVisualizer
              activeMode={visualizerMode}
              onSelectMode={(mode) => setVisualizerMode(mode)}
              onOpenDocTopic={handleOpenDocTopic}
            />
          </div>
        )}

        {/* VIEW 2: COMPONENT LABS (Deep Dive Sandboxes) */}
        {activeTab === 'deep_dive' && (
          <div className="space-y-6">
            {/* Sub-Tabs for the 4 Documents */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {[
                { id: 'doc_001', title: '01 · Digital Athlete & Injury Prevention', icon: Activity, color: 'text-rose-400' },
                { id: 'doc_002', title: '02 · Radio Frequency Identification (RFID)', icon: Radio, color: 'text-cyan-400' },
                { id: 'doc_003', title: '03 · Adverse Weather & Sensor Fusion', icon: CloudRain, color: 'text-amber-400' },
                { id: 'doc_004', title: '04 · AI Coaching Assistant Pipeline', icon: BrainCircuit, color: 'text-emerald-400' },
              ].map((lab) => {
                const Icon = lab.icon;
                const isSelected = selectedLabDocId === lab.id;
                return (
                  <button
                    key={lab.id}
                    onClick={() => setSelectedLabDocId(lab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono-code rounded border transition-all ${
                      isSelected
                        ? 'bg-[#121829] border-cyan-500 text-white shadow-sm font-semibold'
                        : 'bg-[#090d16] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${lab.color}`} />
                    <span>{lab.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Lab Component */}
            {selectedLabDocId === 'doc_001' && <DigitalAthleteLab />}
            {selectedLabDocId === 'doc_002' && <RfidArchitectureLab />}
            {selectedLabDocId === 'doc_003' && <WeatherSensorFusionLab />}
            {selectedLabDocId === 'doc_004' && <CoachingPipelineLab />}
          </div>
        )}

        {/* VIEW: WEATHER TACTICAL AI COACHING MODULE */}
        {activeTab === 'weather_tactics' && (
          <WeatherTacticalCoachingModule />
        )}

        {/* VIEW: QUANTUM SPATIAL QNN (PENNYLANE) */}
        {activeTab === 'quantum_qnn' && (
          <QuantumCoachingCircuit />
        )}

        {/* VIEW: SYSTEM ARCHITECTURE FLOW */}
        {activeTab === 'architecture_flow' && (
          <SystemArchitectureMap onSelectTopic={handleOpenDocTopic} />
        )}

        {/* VIEW 4: SPECIFICATION DOCUMENTS */}
        {activeTab === 'documents' && (
          <TechnicalDocReader
            onOpenLab={(docId) => {
              setSelectedLabDocId(docId);
              setActiveTab('deep_dive');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07090e] py-6 px-4 text-xs font-mono-code text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-display font-bold text-slate-200">KINETIC GRID</span>
            <span>·</span>
            <span>NFL Digital Athlete & NextGen Sensor Intelligence Platform</span>
          </div>
          <div>
            Built with React 19 · Vite · Tailwind CSS · Zebra RFID Architecture · YOLOv10 CV
          </div>
        </div>
      </footer>

      {/* Technical Briefing Modal */}
      <TechnicalBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
      />
    </div>
  );
}
