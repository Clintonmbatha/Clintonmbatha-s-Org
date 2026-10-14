/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { SPORTS_AI_DOCUMENTS } from '../data/sportsAiKnowledge';

interface TechnicalBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalBriefingModal: React.FC<TechnicalBriefingModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const markdownContent = `# KINETIC GRID // NFL DIGITAL ATHLETE & VISION AI ARCHITECTURE SPECIFICATION
Generated: ${new Date().toISOString().split('T')[0]}
System Status: Production Grade · Ultra-Wideband 20Hz · All-22 60FPS

## EXECUTIVE SUMMARY
The modern professional football intelligence architecture integrates real-time hardware telemetry (Ultra-Wideband RFID), adverse weather image de-noising networks, real-time computer vision object detection (YOLOv10), and predictive injury modeling (Digital Athlete).

---

${SPORTS_AI_DOCUMENTS.map((doc, idx) => `
### [${doc.id.toUpperCase()}] ${doc.topic}
- **Category:** ${doc.category}
- **Hardware Layer:** ${doc.hardware_layer || 'N/A'}
- **Algorithmic Core:** ${doc.algorithmic_core || 'N/A'}
- **Clinical/Operational Impact:** ${doc.impact_metric || 'N/A'}

#### Overview
${doc.summary}

#### Architectural Sub-Components:
${doc.system_components.map((c, cIdx) => `
${cIdx + 1}. **${c.component_name}**
   - Description: ${c.description}
   - Technical Specifications: ${c.technical_specs || 'Embedded runtime module'}
   - Key Benchmark Metrics: ${c.metrics ? c.metrics.join(' | ') : 'N/A'}
`).join('')}
`).join('\n---\n')}

## CROSS-SYSTEM INTEGRATION MATRIX
1. **RFID to Sensor Fusion:** Reader catwalk antennas track tag emissions at 20Hz. If severe precipitation degrades optical confidence below 60%, the Unscented Kalman Filter automatically falls back to RF hyperbolic TDOA coordinates.
2. **Pose Estimation to Digital Athlete:** 17-point skeletal joint vectors detect dynamic knee valgus angles > 12° during deceleration cuts, correlating acute kinematic strain with 28-day chronic training loads.
3. **YOLO to AI Coaching Headset:** 4-point planar homography translates 4K stadium camera pixels into yardage coordinate graphs, providing tactical audible recommendations in under 2 seconds.
4. **Wearable Sensors to Digital Athlete:** 100Hz tri-axial IMUs, smart-insole load cells, and smart mouthguard accelerometers feed live joint kinematic angles (knee valgus, knee flexion), impact forces (Peak GRF in BW, deceleration impulse N·s, collision Gs), and range of motion (ROM) deficits to generate individualized soft-tissue injury risk profiles and corrective neuromuscular interventions.
5. **Atmospheric Weather to AI Coaching Assistant:** Micro-climate sensors track precipitation rate, wind vectors, temperature, and turf friction to dynamically re-weight offensive pass/run playcalling ratios, calculate deep pass trajectory drift, establish field goal distance caps, and mandate weather-adaptive warm-up and cleat configurations.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NFL_Sports_AI_Technical_Briefing_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-white text-base">
              System Specification Report (All 4 Modules)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono-code text-slate-200 rounded transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-xs font-mono-code text-slate-950 font-bold rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-1 font-mono-code text-xs text-slate-300 space-y-4">
          <pre className="whitespace-pre-wrap font-mono-code bg-[#060910] p-4 rounded border border-slate-800/80 leading-relaxed text-slate-300">
            {markdownContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
