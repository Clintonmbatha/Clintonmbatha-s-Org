/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Network, ArrowRight, Activity, Radio, CloudRain, 
  BrainCircuit, ShieldCheck, Zap, Layers, ChevronRight, Eye 
} from 'lucide-react';
import { SPORTS_AI_DOCUMENTS } from '../data/sportsAiKnowledge';

interface SystemArchitectureMapProps {
  onSelectTopic: (topicId: string) => void;
}

interface PipelineNode {
  id: string;
  docId: string;
  name: string;
  category: string;
  layer: 'sensing' | 'denoising' | 'fusion' | 'spatial' | 'intelligence';
  badgeColor: string;
  input: string;
  output: string;
  latency: string;
  tech: string;
}

export const SystemArchitectureMap: React.FC<SystemArchitectureMapProps> = ({ onSelectTopic }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('fusion_ukf');
  const [filterLayer, setFilterLayer] = useState<string>('all');

  const nodes: PipelineNode[] = [
    // Layer 1: Sensing
    {
      id: 'rfid_tag',
      docId: 'doc_002',
      name: 'The Tag (Shoulder Pad UWB)',
      category: 'Hardware / Sensor Technology',
      layer: 'sensing',
      badgeColor: 'text-cyan-400 border-cyan-800 bg-cyan-950/60',
      input: 'RF excitation waves & player kinetic movement',
      output: '20Hz UWB radio pulse bursts with 128-bit payload',
      latency: '50ms period (20Hz)',
      tech: 'Coin ASIC microchip + dual-patch antenna'
    },
    {
      id: 'rfid_reader',
      docId: 'doc_002',
      name: 'The Reader (Stadium Catwalk Array)',
      category: 'Hardware / Sensor Technology',
      layer: 'sensing',
      badgeColor: 'text-cyan-400 border-cyan-800 bg-cyan-950/60',
      input: 'Stadium ambient RF field',
      output: 'Picosecond-synchronized pulse timestamps',
      latency: '< 1ms capture',
      tech: '20-30 phased array antennas, IEEE 1588 PTP'
    },
    {
      id: 'camera_array',
      docId: 'doc_004',
      name: 'All-22 Multi-Camera Broadcast Array',
      category: 'Computer Vision',
      layer: 'sensing',
      badgeColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      input: 'Visual photons from field lighting / daylight',
      output: '4K raw video stream @ 60 FPS',
      latency: '16.6ms per frame',
      tech: 'Fixed 35mm/50mm high-mount stadium optics'
    },
    {
      id: 'wearable_sensors',
      docId: 'doc_001',
      name: 'Wearable Technology & Sensor Data',
      category: 'Sports Analytics',
      layer: 'sensing',
      badgeColor: 'text-rose-400 border-rose-800 bg-rose-950/60',
      input: 'Player physical impact & heart biomechanics',
      output: 'Tri-axial acceleration (up to 16g) & heart rate',
      latency: '100Hz IMU sampling',
      tech: 'Catapult / Zebra IMU + ECG/PPG telemetry'
    },

    // Layer 2: De-noising & Pre-processing
    {
      id: 'rf_communication',
      docId: 'doc_002',
      name: 'Communication & RF Modulation',
      category: 'Hardware / Sensor Technology',
      layer: 'denoising',
      badgeColor: 'text-cyan-400 border-cyan-800 bg-cyan-950/60',
      input: 'Raw RF bursts over 3.5 - 6.5 GHz channel',
      output: 'Demodulated bitstream free of multi-path stadium reflection',
      latency: '1.2ms',
      tech: 'Direct Sequence Spread Spectrum (DSSS)'
    },
    {
      id: 'image_deraining',
      docId: 'doc_003',
      name: 'Image De-raining Models',
      category: 'Computer Vision / Sensor Fusion',
      layer: 'denoising',
      badgeColor: 'text-amber-400 border-amber-800 bg-amber-950/60',
      input: 'Rain-streaked, spray-degraded 4K camera frames',
      output: 'Clean background image ($B$) + residual rain map ($R$)',
      latency: '14.0ms on TensorRT',
      tech: 'Progressive Recurrent Network (PReNet)'
    },

    // Layer 3: Vision & Sensor Fusion
    {
      id: 'yolo_detection',
      docId: 'doc_004',
      name: 'Data Acquisition & Player Detection',
      category: 'Computer Vision',
      layer: 'fusion',
      badgeColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      input: 'De-rained video frames',
      output: 'Player bounding boxes, jersey OCR numbers, referee IDs',
      latency: '8.4ms',
      tech: 'YOLOv10 Object Detector + CRNN Text OCR'
    },
    {
      id: 'fusion_ukf',
      docId: 'doc_003',
      name: 'Sensor Fusion (RFID & Video)',
      category: 'Computer Vision / Sensor Fusion',
      layer: 'fusion',
      badgeColor: 'text-amber-400 border-amber-800 bg-amber-950/60',
      input: 'RFID TDOA coordinates + Optical YOLO bounding boxes',
      output: 'Unified continuous state estimate (99.8% lock retention)',
      latency: '2.4ms',
      tech: 'Unscented Kalman Filter (UKF)'
    },
    {
      id: 'temporal_tracking',
      docId: 'doc_003',
      name: 'Temporal Tracking & Feature Extraction',
      category: 'Computer Vision / Sensor Fusion',
      layer: 'fusion',
      badgeColor: 'text-amber-400 border-amber-800 bg-amber-950/60',
      input: 'Multi-frame object embeddings',
      output: 'Continuous trajectory tracks bridging 45-frame dropouts',
      latency: '3.1ms',
      tech: 'ByteTrack / DeepSORT + Hungarian Matching'
    },
    {
      id: 'rfid_processing',
      docId: 'doc_002',
      name: 'Data Processing & Multilateration',
      category: 'Hardware / Sensor Technology',
      layer: 'fusion',
      badgeColor: 'text-cyan-400 border-cyan-800 bg-cyan-950/60',
      input: 'TDOA timestamps from 4+ catwalk receivers',
      output: 'Centimeter-precision (X, Y, Z) field coordinates',
      latency: '4.2ms',
      tech: 'Hyperbolic TDOA multilateration solver'
    },

    // Layer 4: Spatial & Kinematics
    {
      id: 'homography_mapping',
      docId: 'doc_004',
      name: 'Movement & Positional Mapping',
      category: 'Computer Vision',
      layer: 'spatial',
      badgeColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      input: 'Image plane coordinates (u, v)',
      output: 'Orthogonal field plane coordinates (x, y) in yards + velocity vectors',
      latency: '1.8ms',
      tech: 'Planar 4-point Homography Matrix Warping'
    },
    {
      id: 'pose_estimation',
      docId: 'doc_001',
      name: 'Computer Vision & Pose Estimation',
      category: 'Sports Analytics',
      layer: 'spatial',
      badgeColor: 'text-rose-400 border-rose-800 bg-rose-950/60',
      input: 'High-speed camera crops of individual players',
      output: '17 3D skeletal joint coordinates (valgus, trunk lean)',
      latency: '12.5ms',
      tech: 'HRNet 3D Pose + Inverse Kinematics'
    },

    // Layer 5: Actionable Intelligence
    {
      id: 'tactical_analytics',
      docId: 'doc_004',
      name: 'Tactical Analytics & Pattern Recognition',
      category: 'Computer Vision / Tactical Analytics',
      layer: 'intelligence',
      badgeColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      input: '22-player spatial trajectory graph + ball vector',
      output: 'Defensive coverage tag (Cover 3 Sky), separation delta, coaching headset audible',
      latency: '4.6ms',
      tech: 'Spatio-Temporal Graph Neural Network (ST-GNN)'
    },
    {
      id: 'predictive_analytics',
      docId: 'doc_001',
      name: 'Predictive Analytics & Digital Athlete',
      category: 'Sports Analytics / Predictive AI',
      layer: 'intelligence',
      badgeColor: 'text-rose-400 border-rose-800 bg-rose-950/60',
      input: 'Pose joint stress + ACWR workload + 10-year injury EHR',
      output: 'Individualized injury probability forecast & snap count limits',
      latency: 'Batch & real-time (< 500ms)',
      tech: 'Cox Proportional Hazards + XGBoost Survival Trees'
    },
    {
      id: 'quantum_spatial_qnn',
      docId: 'doc_004',
      name: 'Quantum Spatial QNN (PennyLane 4-Qubit Circuit)',
      category: 'Quantum ML / Tactical Analytics',
      layer: 'intelligence',
      badgeColor: 'text-indigo-400 border-indigo-800 bg-indigo-950/60',
      input: '4-dim normalized spatial feature vector [Speed, Cushion, Box, Pressure]',
      output: '4-wire Pauli-Z expectation values <Z_i> & aggregated play success probability',
      latency: '2.8ms simulation',
      tech: 'PennyLane autograd QNode + 3-Layer Parameterized Rotations & CNOT'
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const layerDefinitions = [
    { id: 'all', label: 'All Layers (14 Modules)' },
    { id: 'sensing', label: '1. Physical Hardware & Video Sensing' },
    { id: 'denoising', label: '2. De-noising & Signal Pre-processing' },
    { id: 'fusion', label: '3. Vision Detection & Sensor Fusion' },
    { id: 'spatial', label: '4. Spatial Homography & Biomechanics' },
    { id: 'intelligence', label: '5. Actionable AI Decision Engines' },
  ];

  const filteredNodes = filterLayer === 'all' 
    ? nodes 
    : nodes.filter(n => n.layer === filterLayer);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0e1320] border border-slate-800 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400">
              <Network className="w-4 h-4" />
              <span>UNIFIED SPORTS AI ARCHITECTURE & DATA PIPELINE</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-wide">
              Cross-System Dataflow: Hardware RFID to Digital Athlete
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              How the 4 technical modules (Digital Athlete, RFID Infrastructure, Adverse Weather Sensor Fusion, and AI Coaching Pipelines) interconnect in real-time stadium operations.
            </p>
          </div>

          {/* Layer Filter */}
          <div className="flex items-center gap-1.5 bg-[#080b12] p-1 border border-slate-800 rounded">
            <span className="text-[11px] font-mono-code text-slate-500 px-2">FILTER:</span>
            <select
              value={filterLayer}
              onChange={(e) => setFilterLayer(e.target.value)}
              className="bg-[#0e1320] text-xs font-mono-code text-slate-200 border-none outline-none py-1 px-2 rounded cursor-pointer"
            >
              {layerDefinitions.map(l => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Visual Flow Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Pipeline Canvas (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Layer Flow Columns */}
          <div className="space-y-4">
            {['sensing', 'denoising', 'fusion', 'spatial', 'intelligence'].map((layerKey, lIdx) => {
              const layerNodes = filteredNodes.filter(n => n.layer === layerKey);
              if (layerNodes.length === 0) return null;

              const layerTitle = 
                layerKey === 'sensing' ? 'LAYER 1 · PHYSICAL SENSING & SIGNAL CAPTURE' :
                layerKey === 'denoising' ? 'LAYER 2 · SIGNAL PRE-PROCESSING & DE-NOISING' :
                layerKey === 'fusion' ? 'LAYER 3 · DETECTION & SENSOR FUSION ENGINE' :
                layerKey === 'spatial' ? 'LAYER 4 · PLANAR HOMOGRAPHY & POSE KINEMATICS' :
                'LAYER 5 · PREDICTIVE ANALYTICS & COACHING DECISIONS';

              return (
                <div key={layerKey} className="bg-[#0a0e17] border border-slate-800 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 pb-1 border-b border-slate-800/80">
                    <span className="font-semibold text-slate-300">{layerTitle}</span>
                    <span>{layerNodes.length} NODES</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    {layerNodes.map(node => {
                      const isSelected = selectedNodeId === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`p-3 rounded border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#121c2e] border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                              : 'bg-[#080c14] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <span className="font-display font-semibold text-slate-100 text-xs">
                              {node.name}
                            </span>
                            <span className="text-[10px] font-mono-code text-slate-400 shrink-0">
                              {node.latency}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono-code">
                            <span className="text-slate-400 truncate">{node.tech}</span>
                            <span className={`px-1.5 py-0.2 rounded border text-[9px] uppercase ${node.badgeColor}`}>
                              {node.docId.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Detailed Inspector (1 col) */}
        <div className="bg-[#0c111e] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded border uppercase ${selectedNode.badgeColor}`}>
                  {selectedNode.docId}
                </span>
                <span className="text-xs font-mono-code text-slate-400 uppercase">
                  {selectedNode.layer} Layer
                </span>
              </div>
              <h3 className="text-base font-display font-bold text-white">
                {selectedNode.name}
              </h3>
              <div className="text-xs text-slate-400 font-mono-code mt-0.5">
                {selectedNode.category}
              </div>
            </div>

            {/* Input & Output Specifications */}
            <div className="space-y-3 font-mono-code text-xs">
              <div className="p-3 bg-[#080d16] border border-slate-800 rounded">
                <span className="text-slate-400 block mb-1 text-[11px] font-semibold">INPUT VECTOR:</span>
                <p className="text-cyan-300 leading-relaxed text-[11px]">
                  {selectedNode.input}
                </p>
              </div>

              <div className="p-3 bg-[#080d16] border border-slate-800 rounded">
                <span className="text-slate-400 block mb-1 text-[11px] font-semibold">OUTPUT TELEMETRY:</span>
                <p className="text-emerald-300 leading-relaxed text-[11px]">
                  {selectedNode.output}
                </p>
              </div>

              <div className="p-3 bg-[#080d16] border border-slate-800 rounded space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Processing Latency:</span>
                  <span className="text-slate-200 font-bold">{selectedNode.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Underlying Tech:</span>
                  <span className="text-slate-200">{selectedNode.tech}</span>
                </div>
              </div>
            </div>

            {/* Cross-Link Insight */}
            <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded text-xs font-mono-code text-slate-300">
              <span className="text-cyan-400 font-semibold block mb-1">INTEROPERABILITY ROLE:</span>
              Feeds directly into downstream consumers to ensure zero frame dropouts and accurate kinematic injury calculations even under adverse weather.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => onSelectTopic(selectedNode.docId)}
              className="w-full py-2 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/60 text-cyan-200 text-xs font-mono-code rounded flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Full Document Specifications</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
