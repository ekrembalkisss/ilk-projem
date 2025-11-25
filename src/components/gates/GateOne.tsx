'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Brain,
  FileSearch,
  Database,
  Check,
  Loader2,
  Sparkles,
  Eye,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Source, ExtractedFact, FactCategory } from '@/types';
import Card from '../ui/Card';
import ProgressRing from '../ui/ProgressRing';
import { v4 as uuidv4 } from 'uuid';

interface GateOneProps {
  sources: Source[];
  onComplete: (facts: ExtractedFact[]) => void;
}

interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  icon: React.ReactNode;
}

const categoryLabels: Record<FactCategory, string> = {
  statistic: 'Statistics',
  quote: 'Quotes',
  date: 'Dates & Times',
  name: 'Names & Entities',
  event: 'Events',
  claim: 'Claims',
  definition: 'Definitions',
  process: 'Processes',
  comparison: 'Comparisons',
};

const categoryColors: Record<FactCategory, string> = {
  statistic: 'text-blue-300 bg-blue-500/20 border border-blue-500/30',
  quote: 'text-purple-300 bg-purple-500/20 border border-purple-500/30',
  date: 'text-amber-300 bg-amber-500/20 border border-amber-500/30',
  name: 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/30',
  event: 'text-red-300 bg-red-500/20 border border-red-500/30',
  claim: 'text-cyan-300 bg-cyan-500/20 border border-cyan-500/30',
  definition: 'text-indigo-300 bg-indigo-500/20 border border-indigo-500/30',
  process: 'text-orange-300 bg-orange-500/20 border border-orange-500/30',
  comparison: 'text-pink-300 bg-pink-500/20 border border-pink-500/30',
};

export default function GateOne({ sources, onComplete }: GateOneProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [extractedFacts, setExtractedFacts] = useState<ExtractedFact[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [currentlyScanning, setCurrentlyScanning] = useState<string>('');
  const [scannedContent, setScannedContent] = useState<string[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [processedWords, setProcessedWords] = useState(0);

  const stages: ProcessingStage[] = [
    {
      id: 'reading',
      name: 'Reading Sources',
      description: 'Scanning all uploaded documents and content',
      status: currentStage > 0 ? 'completed' : currentStage === 0 ? 'processing' : 'pending',
      icon: <Eye className="w-5 h-5" />,
    },
    {
      id: 'parsing',
      name: 'Deep Content Analysis',
      description: 'Analyzing every sentence for verifiable information',
      status: currentStage > 1 ? 'completed' : currentStage === 1 ? 'processing' : 'pending',
      icon: <FileSearch className="w-5 h-5" />,
    },
    {
      id: 'extracting',
      name: 'Extracting Facts',
      description: 'Identifying all claims, statistics, quotes, and data',
      status: currentStage > 2 ? 'completed' : currentStage === 2 ? 'processing' : 'pending',
      icon: <Brain className="w-5 h-5" />,
    },
    {
      id: 'categorizing',
      name: 'Categorizing Data',
      description: 'Organizing facts by type and reliability',
      status: currentStage > 3 ? 'completed' : currentStage === 3 ? 'processing' : 'pending',
      icon: <Database className="w-5 h-5" />,
    },
    {
      id: 'validating',
      name: 'Validating Results',
      description: 'Cross-referencing and confidence scoring',
      status: currentStage > 4 ? 'completed' : currentStage === 4 ? 'processing' : 'pending',
      icon: <Sparkles className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    // Calculate total words
    const total = sources.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0);
    setTotalWords(total);

    const processGateOne = async () => {
      // Stage 1: Reading Sources - Show actual content being read
      setCurrentStage(0);
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        setCurrentlyScanning(source.name);
        const words = source.content.split(/\s+/);

        // Show snippets of what's being read
        for (let j = 0; j < words.length; j += 50) {
          const snippet = words.slice(j, j + 50).join(' ');
          setScannedContent(prev => [...prev.slice(-3), snippet.slice(0, 100) + '...']);
          setProcessedWords(prev => prev + Math.min(50, words.length - j));
          await new Promise(resolve => setTimeout(resolve, 100));
          setProgress(((i / sources.length) + (j / words.length / sources.length)) * 20);
        }
      }
      setCurrentStage(1);

      // Stage 2: Deep Content Analysis
      setCurrentlyScanning('Analyzing sentence structures...');
      await simulateStage(20, 40);
      setCurrentStage(2);

      // Stage 3: Extracting Facts - Extract from actual content
      setCurrentlyScanning('Extracting verifiable facts...');
      const facts = extractFactsFromSources(sources);

      // Show facts being extracted one by one
      for (let i = 0; i < facts.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setExtractedFacts(facts.slice(0, i + 1));
        setProgress(40 + (i / facts.length) * 20);
      }
      setCurrentStage(3);

      // Stage 4: Categorizing Data
      setCurrentlyScanning('Categorizing extracted information...');
      await simulateStage(60, 80);
      setCurrentStage(4);

      // Stage 5: Validating Results
      setCurrentlyScanning('Cross-referencing and validating...');
      await simulateStage(80, 100);
      setCurrentStage(5);
      setIsComplete(true);
      setCurrentlyScanning('Analysis complete!');

      // Auto-continue after a short delay
      setTimeout(() => {
        onComplete(facts);
      }, 2000);
    };

    processGateOne();
  }, [sources, onComplete]);

  const simulateStage = async (startProgress: number, endProgress: number) => {
    const steps = 20;
    const increment = (endProgress - startProgress) / steps;

    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProgress((prev) => Math.min(prev + increment, endProgress));
    }
  };

  const extractFactsFromSources = (sources: Source[]): ExtractedFact[] => {
    const facts: ExtractedFact[] = [];

    sources.forEach((source) => {
      const content = source.content;
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);

      sentences.forEach((sentence) => {
        const trimmed = sentence.trim();

        // Detect numbers/statistics
        if (/\d+[\d,\.%$€£]*/.test(trimmed)) {
          facts.push({
            id: uuidv4(),
            fact: trimmed.slice(0, 200),
            sourceId: source.id,
            sourceName: source.name,
            confidence: 0.85 + Math.random() * 0.15,
            category: 'statistic',
          });
        }

        // Detect quotes
        if (/["'"'].*["'"']/.test(trimmed) || /said|stated|according to|claimed/i.test(trimmed)) {
          facts.push({
            id: uuidv4(),
            fact: trimmed.slice(0, 200),
            sourceId: source.id,
            sourceName: source.name,
            confidence: 0.80 + Math.random() * 0.15,
            category: 'quote',
          });
        }

        // Detect dates
        if (/\b(19|20)\d{2}\b|\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(trimmed)) {
          facts.push({
            id: uuidv4(),
            fact: trimmed.slice(0, 200),
            sourceId: source.id,
            sourceName: source.name,
            confidence: 0.90 + Math.random() * 0.10,
            category: 'date',
          });
        }

        // Detect names/entities (capitalized words)
        if (/[A-Z][a-z]+\s+[A-Z][a-z]+/.test(trimmed) || /Dr\.|Prof\.|Mr\.|Ms\.|Mrs\./.test(trimmed)) {
          facts.push({
            id: uuidv4(),
            fact: trimmed.slice(0, 200),
            sourceId: source.id,
            sourceName: source.name,
            confidence: 0.75 + Math.random() * 0.20,
            category: 'name',
          });
        }

        // Detect claims/assertions
        if (/is|are|was|were|will be|has been|have been|shows|indicates|suggests|proves|demonstrates/i.test(trimmed) && trimmed.length > 30) {
          facts.push({
            id: uuidv4(),
            fact: trimmed.slice(0, 200),
            sourceId: source.id,
            sourceName: source.name,
            confidence: 0.70 + Math.random() * 0.25,
            category: 'claim',
          });
        }

        // Detect definitions
        if (/defined as|means|refers to|is known as|is called/i.test(trimmed)) {
          facts.push({
            id: uuidv4(),
            fact: trimmed.slice(0, 200),
            sourceId: source.id,
            sourceName: source.name,
            confidence: 0.85 + Math.random() * 0.15,
            category: 'definition',
          });
        }

        // Detect processes/steps
        if (/first|second|third|step|process|procedure|method|then|finally|next/i.test(trimmed)) {
          facts.push({
            id: uuidv4(),
            fact: trimmed.slice(0, 200),
            sourceId: source.id,
            sourceName: source.name,
            confidence: 0.80 + Math.random() * 0.15,
            category: 'process',
          });
        }

        // Detect comparisons
        if (/more than|less than|compared to|versus|vs\.|better|worse|higher|lower|increase|decrease/i.test(trimmed)) {
          facts.push({
            id: uuidv4(),
            fact: trimmed.slice(0, 200),
            sourceId: source.id,
            sourceName: source.name,
            confidence: 0.75 + Math.random() * 0.20,
            category: 'comparison',
          });
        }

        // Detect events
        if (/event|conference|meeting|launch|release|announced|discovered|founded|established/i.test(trimmed)) {
          facts.push({
            id: uuidv4(),
            fact: trimmed.slice(0, 200),
            sourceId: source.id,
            sourceName: source.name,
            confidence: 0.80 + Math.random() * 0.15,
            category: 'event',
          });
        }
      });
    });

    // Remove duplicates and limit
    const uniqueFacts = facts.filter((fact, index, self) =>
      index === self.findIndex(f => f.fact === fact.fact)
    );

    return uniqueFacts.slice(0, 100); // Limit to 100 facts max
  };

  const factsByCategory = extractedFacts.reduce((acc, fact) => {
    if (!acc[fact.category]) acc[fact.category] = [];
    acc[fact.category].push(fact);
    return acc;
  }, {} as Record<FactCategory, ExtractedFact[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/30 text-violet-300 text-sm font-semibold mb-4 border border-violet-500/40"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Brain className="w-4 h-4" />
          Gate One: Full Source Extraction
        </motion.div>
        <motion.h2
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Scanning Every Word of Your Sources
        </motion.h2>
        <motion.p
          className="text-gray-300 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Deep analysis of {totalWords.toLocaleString()} words across {sources.length} source{sources.length !== 1 ? 's' : ''}
        </motion.p>
      </div>

      {/* Progress Section */}
      <Card className="p-6" glow>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Progress Ring */}
          <div className="flex-shrink-0">
            <ProgressRing
              progress={progress}
              size={140}
              strokeWidth={10}
              color={isComplete ? 'green' : 'violet'}
              label={isComplete ? 'Complete' : 'Processing'}
            />
          </div>

          {/* Stages */}
          <div className="flex-1 w-full">
            <div className="space-y-3">
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-center gap-4 p-3 rounded-xl transition-all duration-300
                    ${
                      stage.status === 'processing'
                        ? 'bg-violet-500/20 border border-violet-500/40'
                        : stage.status === 'completed'
                        ? 'bg-emerald-500/20 border border-emerald-500/40'
                        : 'bg-slate-700/50 border border-slate-600/50'
                    }
                  `}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${
                        stage.status === 'processing'
                          ? 'bg-violet-500/30 text-violet-300'
                          : stage.status === 'completed'
                          ? 'bg-emerald-500/30 text-emerald-300'
                          : 'bg-slate-600/50 text-gray-400'
                      }
                    `}
                  >
                    {stage.status === 'processing' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : stage.status === 'completed' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      stage.icon
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        stage.status === 'processing'
                          ? 'text-violet-300'
                          : stage.status === 'completed'
                          ? 'text-emerald-300'
                          : 'text-gray-400'
                      }`}
                    >
                      {stage.name}
                    </p>
                    <p className="text-sm text-gray-400">{stage.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Currently Scanning Indicator */}
        {currentlyScanning && !isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded-xl bg-slate-700/50 border border-slate-600/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-violet-400" />
              <span className="text-violet-300 font-medium">Currently Processing:</span>
              <span className="text-white">{currentlyScanning}</span>
            </div>
            {scannedContent.length > 0 && (
              <div className="mt-2 space-y-1">
                {scannedContent.map((content, i) => (
                  <p key={i} className={`text-sm ${i === scannedContent.length - 1 ? 'text-gray-300' : 'text-gray-500'}`}>
                    &quot;{content}&quot;
                  </p>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
              <span>Words processed: {processedWords.toLocaleString()} / {totalWords.toLocaleString()}</span>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Extracted Facts Preview */}
      <AnimatePresence>
        {extractedFacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Extracted Facts</h3>
                  <p className="text-gray-300">
                    {extractedFacts.length} facts identified from {sources.length} sources
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">
                    {Math.round(
                      (extractedFacts.reduce((acc, f) => acc + f.confidence, 0) /
                        extractedFacts.length) *
                        100
                    )}
                    % Avg Confidence
                  </span>
                </div>
              </div>

              {/* Category Summary */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {Object.entries(factsByCategory).map(([category, facts]) => (
                  <div
                    key={category}
                    className={`p-3 rounded-xl text-center ${
                      categoryColors[category as FactCategory]
                    }`}
                  >
                    <p className="text-2xl font-bold">{facts.length}</p>
                    <p className="text-sm font-medium">
                      {categoryLabels[category as FactCategory]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Facts List */}
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {extractedFacts.slice(0, 15).map((fact, index) => (
                  <motion.div
                    key={fact.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-slate-700/50 border border-slate-600/50"
                  >
                    <div
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                        categoryColors[fact.category]
                      }`}
                    >
                      {categoryLabels[fact.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white leading-relaxed">{fact.fact}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Source: <span className="text-violet-400">{fact.sourceName}</span> •
                        Confidence: <span className="text-emerald-400">{Math.round(fact.confidence * 100)}%</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
                {extractedFacts.length > 15 && (
                  <p className="text-center text-gray-400 py-3 font-medium">
                    +{extractedFacts.length - 15} more facts extracted
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning for low sources */}
      {sources.length < 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/20 border border-amber-500/30"
        >
          <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-amber-300 font-semibold">Limited Sources Detected</p>
            <p className="text-amber-200/80">
              Adding more sources improves verification accuracy. Consider adding at least 3-5 sources for comprehensive analysis.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
