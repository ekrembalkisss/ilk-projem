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
  statistic: 'text-blue-400 bg-blue-400/10',
  quote: 'text-purple-400 bg-purple-400/10',
  date: 'text-amber-400 bg-amber-400/10',
  name: 'text-emerald-400 bg-emerald-400/10',
  event: 'text-red-400 bg-red-400/10',
  claim: 'text-cyan-400 bg-cyan-400/10',
  definition: 'text-indigo-400 bg-indigo-400/10',
  process: 'text-orange-400 bg-orange-400/10',
  comparison: 'text-pink-400 bg-pink-400/10',
};

export default function GateOne({ sources, onComplete }: GateOneProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [extractedFacts, setExtractedFacts] = useState<ExtractedFact[]>([]);
  const [isComplete, setIsComplete] = useState(false);

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
      name: 'Parsing Content',
      description: 'Breaking down text into analyzable segments',
      status: currentStage > 1 ? 'completed' : currentStage === 1 ? 'processing' : 'pending',
      icon: <FileSearch className="w-5 h-5" />,
    },
    {
      id: 'extracting',
      name: 'Extracting Facts',
      description: 'Identifying verifiable facts and claims',
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
    const processGateOne = async () => {
      // Stage 1: Reading Sources
      await simulateStage(0, 20);
      setCurrentStage(1);

      // Stage 2: Parsing Content
      await simulateStage(20, 40);
      setCurrentStage(2);

      // Stage 3: Extracting Facts
      await simulateStage(40, 60);
      const facts = extractFactsFromSources(sources);
      setExtractedFacts(facts.slice(0, Math.floor(facts.length / 2)));
      setCurrentStage(3);

      // Stage 4: Categorizing Data
      await simulateStage(60, 80);
      setExtractedFacts(facts.slice(0, Math.floor((facts.length * 3) / 4)));
      setCurrentStage(4);

      // Stage 5: Validating Results
      await simulateStage(80, 100);
      setExtractedFacts(facts);
      setCurrentStage(5);
      setIsComplete(true);

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
    // In production, this would use NLP/AI to extract actual facts
    // For demo, we generate realistic fact extractions
    const factTemplates: Array<{ fact: string; category: FactCategory }> = [
      { fact: 'According to the 2023 report, the global market size reached $4.2 billion', category: 'statistic' },
      { fact: 'Research indicates a 47% increase in adoption rates since 2020', category: 'statistic' },
      { fact: 'Dr. Smith stated: "This represents a paradigm shift in our understanding"', category: 'quote' },
      { fact: 'The initial discovery was made in March 2019', category: 'date' },
      { fact: 'Key contributor: Dr. Jane Wilson, MIT Research Lab', category: 'name' },
      { fact: 'The landmark conference held in Geneva attracted 2,500 participants', category: 'event' },
      { fact: 'Studies suggest correlation between variables X and Y with r=0.78', category: 'claim' },
      { fact: 'Defined as: "The systematic approach to analyzing complex data patterns"', category: 'definition' },
      { fact: 'The process involves three distinct phases: collection, analysis, and validation', category: 'process' },
      { fact: 'Compared to previous methods, efficiency improved by 35%', category: 'comparison' },
      { fact: 'Sample size of 10,000 participants across 15 countries', category: 'statistic' },
      { fact: 'Peer-reviewed and published in Nature Scientific Reports', category: 'claim' },
      { fact: 'The team at Stanford University led the breakthrough research', category: 'name' },
      { fact: 'Annual growth rate projected at 12.5% through 2027', category: 'statistic' },
      { fact: 'The methodology was first introduced in the 1990s', category: 'date' },
    ];

    const facts: ExtractedFact[] = [];

    sources.forEach((source) => {
      // Extract word count to determine number of facts
      const wordCount = source.content.split(/\s+/).length;
      const factCount = Math.min(Math.floor(wordCount / 50) + 2, 8);

      for (let i = 0; i < factCount; i++) {
        const template = factTemplates[Math.floor(Math.random() * factTemplates.length)];
        facts.push({
          id: uuidv4(),
          fact: template.fact,
          sourceId: source.id,
          sourceName: source.name,
          confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
          category: template.category,
        });
      }
    });

    return facts;
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-400 text-sm font-medium mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Brain className="w-4 h-4" />
          Gate One: Fact Extraction
        </motion.div>
        <motion.h2
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Analyzing Your Sources
        </motion.h2>
        <motion.p
          className="text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Extracting verifiable facts and information without context bias
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
                        ? 'bg-violet-500/10 border border-violet-500/30'
                        : stage.status === 'completed'
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : 'bg-white/5 border border-white/10'
                    }
                  `}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${
                        stage.status === 'processing'
                          ? 'bg-violet-500/20 text-violet-400'
                          : stage.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/10 text-white/40'
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
                      className={`font-medium ${
                        stage.status === 'processing'
                          ? 'text-violet-400'
                          : stage.status === 'completed'
                          ? 'text-emerald-400'
                          : 'text-white/60'
                      }`}
                    >
                      {stage.name}
                    </p>
                    <p className="text-xs text-white/40">{stage.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
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
                  <h3 className="text-lg font-semibold text-white">Extracted Facts</h3>
                  <p className="text-sm text-white/60">
                    {extractedFacts.length} facts identified from {sources.length} sources
                  </p>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
                {Object.entries(factsByCategory).map(([category, facts]) => (
                  <div
                    key={category}
                    className={`p-2 rounded-lg text-center ${
                      categoryColors[category as FactCategory]
                    }`}
                  >
                    <p className="text-lg font-bold">{facts.length}</p>
                    <p className="text-xs opacity-80">
                      {categoryLabels[category as FactCategory]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Facts List */}
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {extractedFacts.slice(0, 10).map((fact, index) => (
                  <motion.div
                    key={fact.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
                  >
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        categoryColors[fact.category]
                      }`}
                    >
                      {categoryLabels[fact.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{fact.fact}</p>
                      <p className="text-xs text-white/40 mt-1">
                        Source: {fact.sourceName} • {Math.round(fact.confidence * 100)}% confidence
                      </p>
                    </div>
                  </motion.div>
                ))}
                {extractedFacts.length > 10 && (
                  <p className="text-center text-sm text-white/40 py-2">
                    +{extractedFacts.length - 10} more facts extracted
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
          className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-amber-400 font-medium">Limited Sources Detected</p>
            <p className="text-xs text-amber-400/60">
              Adding more sources improves verification accuracy. Consider adding at least 3-5 sources.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
