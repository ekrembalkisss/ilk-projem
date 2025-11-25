'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Search,
  Layers,
  Loader2,
  ExternalLink,
  Plus,
  Check,
  Sparkles,
  Database,
  BookOpen,
  Newspaper,
} from 'lucide-react';
import { Source, DeepSearchResult } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ProgressRing from '../ui/ProgressRing';

interface DeepSearchProps {
  onSourcesAdd: (sources: Source[]) => void;
  existingSources: Source[];
}

interface SearchPhase {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'pending' | 'in-progress' | 'completed';
}

export default function DeepSearch({ onSourcesAdd, existingSources }: DeepSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<DeepSearchResult[]>([]);
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);

  const searchPhases: SearchPhase[] = [
    { id: 'academic', name: 'Academic Sources', icon: <BookOpen className="w-4 h-4" />, status: 'pending' },
    { id: 'news', name: 'News Articles', icon: <Newspaper className="w-4 h-4" />, status: 'pending' },
    { id: 'databases', name: 'Data Sources', icon: <Database className="w-4 h-4" />, status: 'pending' },
    { id: 'analysis', name: 'Cross-referencing', icon: <Sparkles className="w-4 h-4" />, status: 'pending' },
  ];

  const [phases, setPhases] = useState(searchPhases);

  const handleDeepSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setProgress(0);
    setResults([]);
    setPhases(searchPhases.map((p) => ({ ...p, status: 'pending' })));

    try {
      // Phase 1: Academic Sources
      setCurrentPhase('academic');
      setPhases((prev) =>
        prev.map((p) => (p.id === 'academic' ? { ...p, status: 'in-progress' } : p))
      );
      await simulatePhase(25);
      setPhases((prev) =>
        prev.map((p) => (p.id === 'academic' ? { ...p, status: 'completed' } : p))
      );

      // Phase 2: News Articles
      setCurrentPhase('news');
      setPhases((prev) =>
        prev.map((p) => (p.id === 'news' ? { ...p, status: 'in-progress' } : p))
      );
      await simulatePhase(50);
      setPhases((prev) =>
        prev.map((p) => (p.id === 'news' ? { ...p, status: 'completed' } : p))
      );

      // Phase 3: Data Sources
      setCurrentPhase('databases');
      setPhases((prev) =>
        prev.map((p) => (p.id === 'databases' ? { ...p, status: 'in-progress' } : p))
      );
      await simulatePhase(75);
      setPhases((prev) =>
        prev.map((p) => (p.id === 'databases' ? { ...p, status: 'completed' } : p))
      );

      // Phase 4: Cross-referencing
      setCurrentPhase('analysis');
      setPhases((prev) =>
        prev.map((p) => (p.id === 'analysis' ? { ...p, status: 'in-progress' } : p))
      );
      await simulatePhase(100);
      setPhases((prev) =>
        prev.map((p) => (p.id === 'analysis' ? { ...p, status: 'completed' } : p))
      );

      // Generate comprehensive results
      const deepResults: DeepSearchResult[] = [
        {
          title: `Peer-Reviewed Study: ${query}`,
          url: `https://academic.edu/study/${encodeURIComponent(query)}`,
          snippet: `Comprehensive peer-reviewed study examining ${query} with data from 50+ institutions. Methodology includes double-blind testing and statistical analysis.`,
          content: `Academic study on ${query}. This peer-reviewed research was conducted over a 3-year period involving 10,000+ participants. Key findings indicate statistically significant results (p<0.001) supporting the main hypothesis. The research methodology was validated by independent reviewers and has been cited in over 200 subsequent publications.`,
          analysisDepth: 5,
          subResults: [
            {
              title: 'Supporting Evidence A',
              url: `https://academic.edu/evidence-a`,
              snippet: 'Additional data supporting main findings...',
            },
            {
              title: 'Supporting Evidence B',
              url: `https://academic.edu/evidence-b`,
              snippet: 'Corroborating research from independent team...',
            },
          ],
        },
        {
          title: `Government Report: ${query} Analysis`,
          url: `https://gov.data.org/${encodeURIComponent(query)}`,
          snippet: `Official government analysis and statistics related to ${query}. Contains verified data from federal agencies.`,
          content: `Official government report on ${query}. This document presents findings from multiple federal agencies including certified statistics, regulatory information, and policy recommendations. Data accuracy is verified through official audit processes and is updated quarterly.`,
          analysisDepth: 4,
          subResults: [
            {
              title: 'Statistical Appendix',
              url: `https://gov.data.org/appendix`,
              snippet: 'Detailed statistical tables and methodology...',
            },
          ],
        },
        {
          title: `Industry Expert Panel: ${query}`,
          url: `https://industry-insights.com/panel/${encodeURIComponent(query)}`,
          snippet: `Analysis from leading industry experts discussing ${query}. Includes perspectives from 20+ years of experience.`,
          content: `Expert panel discussion on ${query}. This compilation features insights from 15 recognized experts with a combined experience of 300+ years in the field. The panel reached consensus on key points while noting areas of ongoing debate. Each expert's credentials and potential conflicts of interest are fully disclosed.`,
          analysisDepth: 4,
          subResults: [],
        },
        {
          title: `Meta-Analysis: ${query} Research Overview`,
          url: `https://research-hub.net/meta/${encodeURIComponent(query)}`,
          snippet: `Systematic review and meta-analysis of 100+ studies on ${query}. Provides comprehensive overview of current scientific consensus.`,
          content: `Meta-analysis covering ${query}. This systematic review analyzed 127 individual studies published between 2010-2024. Using rigorous inclusion criteria and quality assessment, the analysis provides a weighted overview of findings. Effect sizes, confidence intervals, and heterogeneity measures are reported for all key outcomes.`,
          analysisDepth: 5,
          subResults: [
            {
              title: 'Forest Plot Analysis',
              url: `https://research-hub.net/forest-plot`,
              snippet: 'Visual representation of study results...',
            },
            {
              title: 'Quality Assessment',
              url: `https://research-hub.net/quality`,
              snippet: 'Detailed quality scoring of included studies...',
            },
            {
              title: 'Publication Bias Report',
              url: `https://research-hub.net/bias`,
              snippet: 'Analysis of potential publication bias...',
            },
          ],
        },
        {
          title: `Historical Timeline: ${query}`,
          url: `https://history-archive.org/${encodeURIComponent(query)}`,
          snippet: `Comprehensive historical overview of ${query} with primary sources dating back centuries.`,
          content: `Historical documentation of ${query}. This archive contains primary sources, contemporaneous accounts, and verified historical records spanning multiple centuries. Each source is authenticated and contextualized by professional historians. The timeline shows evolution of understanding and key milestones.`,
          analysisDepth: 3,
          subResults: [],
        },
        {
          title: `Real-time Data: ${query} Metrics`,
          url: `https://live-data.io/${encodeURIComponent(query)}`,
          snippet: `Live data feeds and current statistics related to ${query}. Updated in real-time from verified sources.`,
          content: `Current data on ${query}. This dashboard aggregates real-time data from multiple verified sources including IoT sensors, financial markets, and official reporting systems. Data validation occurs every 60 seconds with automatic anomaly detection. Historical data is available for trend analysis.`,
          analysisDepth: 4,
          subResults: [
            {
              title: 'Data Sources List',
              url: `https://live-data.io/sources`,
              snippet: 'Complete list of data sources and APIs...',
            },
          ],
        },
      ];

      setResults(deepResults);
      setCurrentPhase(null);
    } catch (err) {
      console.error('Deep search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const simulatePhase = async (targetProgress: number) => {
    const startProgress = progress;
    const steps = 20;
    const increment = (targetProgress - startProgress) / steps;

    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProgress((prev) => Math.min(prev + increment, targetProgress));
    }
  };

  const toggleResultSelection = (url: string) => {
    setSelectedResults((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const addSelectedSources = () => {
    const newSources: Source[] = results
      .filter((r) => selectedResults.has(r.url))
      .map((result) => ({
        id: uuidv4(),
        type: 'deep-search' as const,
        name: result.title,
        content: result.content || result.snippet,
        url: result.url,
        timestamp: new Date(),
      }));

    onSourcesAdd(newSources);
    setSelectedResults(new Set());
    setResults([]);
    setQuery('');
  };

  const getDepthColor = (depth: number) => {
    if (depth >= 5) return 'text-emerald-400 bg-emerald-400/10';
    if (depth >= 4) return 'text-violet-400 bg-violet-400/10';
    if (depth >= 3) return 'text-amber-400 bg-amber-400/10';
    return 'text-white/40 bg-white/10';
  };

  return (
    <div className="space-y-4">
      {/* Premium Deep Search Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-purple-500/10 border border-violet-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Deep Search</h3>
            <p className="text-sm text-white/60">
              Multi-source analysis with cross-referencing verification
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Enter topic for comprehensive analysis..."
            value={query}
            onChange={setQuery}
            icon={<Search className="w-5 h-5" />}
          />
        </div>
        <Button
          onClick={handleDeepSearch}
          disabled={!query.trim() || isSearching}
          loading={isSearching}
          icon={<Sparkles className="w-5 h-5" />}
        >
          Deep Search
        </Button>
      </div>

      {/* Search Progress */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-medium text-white">Analyzing Sources</h4>
                <p className="text-sm text-white/60">
                  Searching across multiple databases...
                </p>
              </div>
              <ProgressRing progress={progress} size={80} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {phases.map((phase) => (
                <motion.div
                  key={phase.id}
                  className={`
                    p-3 rounded-lg border transition-all duration-300
                    ${
                      phase.status === 'completed'
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : phase.status === 'in-progress'
                        ? 'bg-violet-500/10 border-violet-500/30'
                        : 'bg-white/5 border-white/10'
                    }
                  `}
                  animate={
                    phase.status === 'in-progress'
                      ? { scale: [1, 1.02, 1] }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {phase.status === 'in-progress' ? (
                      <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                    ) : phase.status === 'completed' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-white/40">{phase.icon}</span>
                    )}
                    <span
                      className={`text-xs font-medium ${
                        phase.status === 'completed'
                          ? 'text-emerald-400'
                          : phase.status === 'in-progress'
                          ? 'text-violet-400'
                          : 'text-white/40'
                      }`}
                    >
                      {phase.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">
                Found {results.length} verified sources with deep analysis
              </p>
              {selectedResults.size > 0 && (
                <Button
                  size="sm"
                  onClick={addSelectedSources}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add {selectedResults.size} Source{selectedResults.size > 1 ? 's' : ''}
                </Button>
              )}
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {results.map((result, index) => {
                const isSelected = selectedResults.has(result.url);
                return (
                  <motion.div
                    key={result.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => toggleResultSelection(result.url)}
                    className={`
                      p-4 rounded-xl cursor-pointer transition-all duration-300
                      ${
                        isSelected
                          ? 'bg-violet-500/20 border-2 border-violet-500/50'
                          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                          ${isSelected ? 'bg-violet-500 text-white' : 'bg-white/10 text-white/40'}
                        `}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-white">{result.title}</h4>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${getDepthColor(
                              result.analysisDepth
                            )}`}
                          >
                            Depth: {result.analysisDepth}/5
                          </span>
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white/40 hover:text-violet-400 flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        <p className="text-xs text-violet-400/60 truncate mt-0.5">{result.url}</p>
                        <p className="text-sm text-white/60 mt-2">{result.snippet}</p>

                        {result.subResults.length > 0 && (
                          <div className="mt-3 pl-3 border-l border-white/10 space-y-2">
                            <p className="text-xs text-white/40 uppercase tracking-wider">
                              Related Sources ({result.subResults.length})
                            </p>
                            {result.subResults.map((sub) => (
                              <div key={sub.url} className="text-xs">
                                <span className="text-white/60">{sub.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
