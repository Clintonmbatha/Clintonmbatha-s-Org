/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Search, Download, Copy, Check, ExternalLink, 
  ChevronRight, Sparkles, SlidersHorizontal, BookOpen 
} from 'lucide-react';
import { SPORTS_AI_DOCUMENTS, SportsAiDoc } from '../data/sportsAiKnowledge';

interface TechnicalDocReaderProps {
  initialTopicId?: string;
  onOpenLab: (docId: string) => void;
}

export const TechnicalDocReader: React.FC<TechnicalDocReaderProps> = ({
  initialTopicId,
  onOpenLab
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', 'Sports Analytics / Predictive AI', 'Hardware / Sensor Technology', 'Computer Vision / Sensor Fusion', 'Computer Vision / Tactical Analytics'];

  const filteredDocs = SPORTS_AI_DOCUMENTS.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = 
      doc.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.system_components.some(c => 
        c.component_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const handleCopyJson = (doc: SportsAiDoc) => {
    const jsonStr = JSON.stringify(doc, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAllJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SPORTS_AI_DOCUMENTS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "nfl_sports_ai_specification.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Ribbon */}
      <div className="bg-[#0e1320] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics, components (e.g. YOLO, Pose Estimation, RFID, De-raining)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080c14] border border-slate-800 rounded pl-9 pr-4 py-2 text-xs font-mono-code text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-code text-slate-400">CATEGORY:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#080c14] border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono-code text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Domains (4 Documents)</option>
            <option value="Sports Analytics / Predictive AI">Sports Analytics / Predictive AI</option>
            <option value="Hardware / Sensor Technology">Hardware / Sensor Technology</option>
            <option value="Computer Vision / Sensor Fusion">Computer Vision / Sensor Fusion</option>
            <option value="Computer Vision / Tactical Analytics">Computer Vision / Tactical Analytics</option>
          </select>
        </div>

        {/* Export All Button */}
        <button
          onClick={handleExportAllJson}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs font-mono-code transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export All JSON</span>
        </button>
      </div>

      {/* Document Cards List */}
      <div className="space-y-6">
        {filteredDocs.map((doc, docIndex) => (
          <div
            key={doc.id}
            id={doc.id}
            className="bg-[#0b0f1a] border border-slate-800 rounded-lg p-6 space-y-4 hover:border-slate-700 transition-all"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400 mb-1">
                  <span className="text-cyan-400 font-bold">{doc.id.toUpperCase()}</span>
                  <span>·</span>
                  <span>{doc.category}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white tracking-wide">
                  {doc.topic}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyJson(doc)}
                  className="flex items-center gap-1 bg-[#121829] hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1.5 rounded text-xs font-mono-code transition-colors"
                  title="Copy Document JSON to clipboard"
                >
                  {copiedId === doc.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onOpenLab(doc.id)}
                  className="flex items-center gap-1.5 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800 text-cyan-300 px-3 py-1.5 rounded text-xs font-mono-code transition-colors"
                >
                  <span>Launch Interactive Lab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Summary */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {doc.summary}
            </p>

            {/* Technical Parameters Sub-Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#080c14] border border-slate-800/60 p-3 rounded font-mono-code text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">HARDWARE LAYER</span>
                <span className="text-slate-300 text-[11px]">{doc.hardware_layer}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ALGORITHMIC CORE</span>
                <span className="text-slate-300 text-[11px]">{doc.algorithmic_core}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">IMPACT / METRIC</span>
                <span className="text-emerald-400 text-[11px] font-semibold">{doc.impact_metric}</span>
              </div>
            </div>

            {/* System Components Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
                <span className="text-cyan-400 font-bold">SYSTEM COMPONENTS ({doc.system_components.length}):</span>
                <span>Click to inspect technical metrics</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {doc.system_components.map((comp, cIdx) => (
                  <div
                    key={comp.component_name}
                    className="p-3.5 bg-[#090d16] border border-slate-800/80 rounded space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-display font-bold text-slate-100 flex items-center gap-2">
                        <span className="text-xs font-mono-code text-slate-500">0{cIdx + 1}</span>
                        <span>{comp.component_name}</span>
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {comp.description}
                    </p>

                    {comp.technical_specs && (
                      <div className="text-[11px] font-mono-code text-slate-400 border-t border-slate-800/60 pt-2 flex flex-wrap gap-x-6 gap-y-1">
                        <div>
                          <span className="text-slate-500">Specs: </span>
                          <span className="text-slate-300">{comp.technical_specs}</span>
                        </div>
                      </div>
                    )}

                    {comp.metrics && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] font-mono-code text-slate-500">METRICS:</span>
                        {comp.metrics.map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="text-[11px] font-mono-code text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="text-center py-12 bg-[#0b0f1a] border border-slate-800 rounded-lg font-mono-code text-slate-500 text-xs">
            No technical documents match your filter: "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
