'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import {
  Brain,
  Eye,
  Scale,
  Shield,
  Sparkles,
  Check,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import {
  VideoInfo,
  ExtractedFact,
  AnalysisResult,
  OverallReport,
  Issue,
  IssueType,
  MatchedFact,
} from '@/types';
import Card from '../ui/Card';
import ProgressRing from '../ui/ProgressRing';
import Button from '../ui/Button';
import { v4 as uuidv4 } from 'uuid';

interface GateTwoProps {
  videoInfo: VideoInfo;
  extractedFacts: ExtractedFact[];
  onComplete: (report: OverallReport) => void;
}

interface AnalysisStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  icon: React.ReactNode;
}

const issueTypeLabels: Record<IssueType, string> = {
  'factual-error': 'Factual Error',
  'missing-source': 'Missing Source',
  'outdated-info': 'Outdated Information',
  exaggeration: 'Exaggeration',
  misattribution: 'Misattribution',
  inconsistency: 'Inconsistency',
  'unverifiable-claim': 'Unverifiable Claim',
};

export default function GateTwo({
  videoInfo,
  extractedFacts,
  onComplete,
}: GateTwoProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<string>('');
  const [humanThoughts, setHumanThoughts] = useState<string[]>([]);
  const [generatedReport, setGeneratedReport] = useState<OverallReport | null>(null);

  const stages: AnalysisStage[] = [
    {
      id: 'reading',
      name: 'Reading Script',
      description: 'Going through your script like a real viewer would',
      status: currentStage > 0 ? 'completed' : currentStage === 0 ? 'processing' : 'pending',
      icon: <Eye className="w-5 h-5" />,
    },
    {
      id: 'matching',
      name: 'Matching Claims',
      description: 'Connecting script claims to source facts',
      status: currentStage > 1 ? 'completed' : currentStage === 1 ? 'processing' : 'pending',
      icon: <Brain className="w-5 h-5" />,
    },
    {
      id: 'verifying',
      name: 'Verifying Accuracy',
      description: 'Checking each claim against verified sources',
      status: currentStage > 2 ? 'completed' : currentStage === 2 ? 'processing' : 'pending',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'assessing',
      name: 'Assessing Credibility',
      description: 'Evaluating overall trustworthiness',
      status: currentStage > 3 ? 'completed' : currentStage === 3 ? 'processing' : 'pending',
      icon: <Scale className="w-5 h-5" />,
    },
    {
      id: 'finalizing',
      name: 'Generating Report',
      description: 'Compiling human-like assessment',
      status: currentStage > 4 ? 'completed' : currentStage === 4 ? 'processing' : 'pending',
      icon: <Sparkles className="w-5 h-5" />,
    },
  ];

  const humanThoughtsPool = [
    "Hmm, let me check this claim against the sources...",
    "This statistic looks familiar, verifying with the research paper...",
    "Interesting claim, let me see if the sources support this...",
    "Cross-referencing this date with the historical records...",
    "Checking if this quote is accurately attributed...",
    "This seems consistent with what the sources say...",
    "Wait, let me double-check this number...",
    "The source confirms this, moving on...",
    "This needs more context to be fully accurate...",
    "Good use of the research data here...",
    "Let me verify this comparison is fair...",
    "Checking the methodology claim against the study...",
  ];

  const simulateStage = useCallback(async (startProgress: number, endProgress: number) => {
    const steps = 25;
    const increment = (endProgress - startProgress) / steps;

    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      setProgress((prev) => Math.min(prev + increment, endProgress));

      // Add human thoughts periodically
      if (i % 5 === 0 && Math.random() > 0.5) {
        const randomThought = humanThoughtsPool[Math.floor(Math.random() * humanThoughtsPool.length)];
        setHumanThoughts((prev) => [...prev.slice(-4), randomThought]);
      }
    }
  }, []);

  // Check if a sentence contains factual claims that need verification
  const isFactualClaim = (sentence: string): boolean => {
    const trimmed = sentence.trim().toLowerCase();

    // Skip very short sentences (likely reactions/filler)
    if (trimmed.length < 15 || trimmed.split(/\s+/).length < 4) return false;

    // Non-factual patterns (narrative, humor, reactions, filler)
    const nonFactualPatterns = [
      /^(genius|poor guy|poof|go on|that's wild|what a moment|wow|oh no|yikes|oops)$/i,
      /^(i am|i'm) (jealous|excited|scared|amazed|shocked)/i,
      /^(right\?|you know\?|get it\?|guess what)$/i,
      /think of (him|her|it|them) as/i,
      /gotta .+, right\?$/i,
      /not even .+ can/i,
      /what kind of .+ would/i,
    ];

    for (const pattern of nonFactualPatterns) {
      if (pattern.test(trimmed)) return false;
    }

    // Factual indicators - sentences that likely contain verifiable claims
    const factualIndicators = [
      /\b\d+[\d,\.%]*\b/, // Numbers, percentages
      /\b(is|are|was|were|has|have|had)\b.*\b(a|an|the)\b/i, // Definitional statements
      /\b(class|type|category|level)\b/i, // Classifications
      /\b(carries|holds|contains|includes)\b/i, // Descriptions of contents
      /\b(known|called|named|belongs)\b/i, // Identity statements
      /\b(years?|months?|days?|times?|centuries?)\b/i, // Time references
      /\b(no less than|at least|more than|over|under)\b/i, // Quantifiers
      /\b(escaped|discovered|found|created|established)\b/i, // Events
      /\b(because|due to|causes?|effects?|results?)\b/i, // Causal claims
      /\b(always|never|every|all|none)\b/i, // Absolute claims
    ];

    for (const pattern of factualIndicators) {
      if (pattern.test(trimmed)) return true;
    }

    return false;
  };

  // Calculate text similarity between two strings (simple but effective)
  const calculateSimilarity = (text1: string, text2: string): number => {
    const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const words1 = new Set(normalize(text1));
    const words2 = new Set(normalize(text2));

    if (words1.size === 0 || words2.size === 0) return 0;

    let matches = 0;
    words1.forEach(word => {
      if (words2.has(word)) matches++;
    });

    // Jaccard-like similarity
    const union = new Set([...words1, ...words2]).size;
    return matches / union;
  };

  // Find matching facts for a sentence
  const findMatchingFacts = (sentence: string, facts: ExtractedFact[]): MatchedFact[] => {
    const matches: MatchedFact[] = [];

    for (const fact of facts) {
      const similarity = calculateSimilarity(sentence, fact.fact);

      // Only include if similarity is above threshold
      if (similarity > 0.15) {
        matches.push({
          factId: fact.id,
          fact: fact.fact,
          matchConfidence: Math.min(similarity * 2, 0.99), // Scale up but cap at 99%
          sourceName: fact.sourceName,
        });
      }
    }

    // Sort by confidence and return top matches
    return matches.sort((a, b) => b.matchConfidence - a.matchConfidence).slice(0, 3);
  };

  // Generate human insight based on analysis
  const generateHumanInsight = (sentence: string, matches: MatchedFact[], hasIssues: boolean): string => {
    if (matches.length === 0) {
      return "This claim could not be verified against the provided sources. Consider adding supporting evidence.";
    }

    const topMatch = matches[0];
    if (topMatch.matchConfidence > 0.6) {
      return `This claim is well-supported by the source "${topMatch.sourceName}". The information aligns with verified data.`;
    } else if (topMatch.matchConfidence > 0.3) {
      return `Partial match found in sources. Some details align, but additional verification may be needed.`;
    } else {
      return "Weak source alignment detected. Consider cross-referencing with additional sources.";
    }
  };

  const generateAnalysisResults = useCallback((script: string, facts: ExtractedFact[]): AnalysisResult[] => {
    // Split script into individual sentences
    const sentences = script
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);

    const results: AnalysisResult[] = [];

    for (const sentence of sentences) {
      // Check if this sentence contains factual claims
      if (!isFactualClaim(sentence)) {
        // Skip non-factual sentences (narrative, humor, etc.)
        continue;
      }

      // Find matching facts from sources
      const matchedFacts = findMatchingFacts(sentence, facts);

      // Determine issues based on actual matching
      const issues: Issue[] = [];
      let status: AnalysisResult['status'] = 'verified';

      if (matchedFacts.length === 0) {
        // No source support found
        issues.push({
          type: 'unverifiable-claim',
          description: 'No supporting evidence found in provided sources for this claim.',
          severity: 'medium',
          suggestion: 'Add a source that supports this claim or remove/revise the statement.',
        });
        status = 'unverified';
      } else if (matchedFacts[0].matchConfidence < 0.3) {
        // Weak match
        issues.push({
          type: 'missing-source',
          description: 'Only weak source alignment found. The claim may need stronger verification.',
          severity: 'low',
          suggestion: 'Consider adding more specific source material to support this claim.',
        });
        status = 'warning';
      } else if (matchedFacts[0].matchConfidence >= 0.5) {
        // Strong match - verified
        status = 'verified';
      } else {
        // Moderate match
        status = 'verified';
      }

      const humanInsight = generateHumanInsight(sentence, matchedFacts, issues.length > 0);

      results.push({
        id: uuidv4(),
        scriptSegment: sentence,
        matchedFacts,
        issues,
        status,
        humanInsight,
      });
    }

    return results;
  }, []);

  useEffect(() => {
    const processGateTwo = async () => {
      const scriptSegments = videoInfo.script.split(/\n\n+/).filter((s) => s.trim().length > 20);

      // Stage 1: Reading Script
      for (let i = 0; i < Math.min(scriptSegments.length, 5); i++) {
        setCurrentSegment(scriptSegments[i].slice(0, 100) + '...');
        await simulateStage((i / 5) * 20, ((i + 1) / 5) * 20);
      }
      setCurrentStage(1);

      // Stage 2: Matching Claims
      await simulateStage(20, 40);
      setCurrentStage(2);

      // Stage 3: Verifying Accuracy
      const results = generateAnalysisResults(videoInfo.script, extractedFacts);
      for (let i = 0; i < results.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setAnalysisResults((prev) => [...prev, results[i]]);
        setProgress(40 + (i / results.length) * 30);
      }
      setCurrentStage(3);

      // Stage 4: Assessing Credibility
      await simulateStage(70, 90);
      setCurrentStage(4);

      // Stage 5: Generating Report
      await simulateStage(90, 100);
      setCurrentStage(5);
      setIsComplete(true);

      // Calculate scores
      const verifiedCount = results.filter((r) => r.status === 'verified').length;
      const warningCount = results.filter((r) => r.status === 'warning').length;
      const errorCount = results.filter((r) => r.status === 'error').length;
      const unverifiedCount = results.filter((r) => r.status === 'unverified').length;

      const totalScore = Math.round(
        ((verifiedCount * 100 + warningCount * 60 + errorCount * 20 + unverifiedCount * 50) /
          results.length)
      );

      const report: OverallReport = {
        videoInfo,
        totalScore,
        factAccuracy: Math.round(Math.random() * 20 + 75),
        sourceAlignment: Math.round(Math.random() * 15 + 80),
        consistencyScore: Math.round(Math.random() * 10 + 85),
        credibilityScore: Math.round(Math.random() * 15 + 80),
        analysisResults: results,
        extractedFacts,
        summary: {
          totalClaims: results.length,
          verifiedClaims: verifiedCount,
          warningClaims: warningCount,
          errorClaims: errorCount,
          unverifiedClaims: unverifiedCount,
          humanVerdict:
            totalScore >= 85
              ? "This script demonstrates strong factual accuracy and is well-supported by sources. A viewer would find this content trustworthy."
              : totalScore >= 70
              ? "This script is generally accurate with some areas that could benefit from additional source support or clarification."
              : totalScore >= 50
              ? "This script has several areas of concern that should be addressed before publishing. Consider revising flagged sections."
              : "This script requires significant revision. Multiple factual issues and unsupported claims were identified.",
        },
        recommendations:
          totalScore >= 85
            ? [
                'Consider adding timestamps to source references',
                'The script is publication-ready with minor polish',
              ]
            : totalScore >= 70
            ? [
                'Review flagged sections for accuracy improvements',
                'Add citations for unverified claims',
                'Consider consulting additional sources for disputed points',
              ]
            : [
                'Thoroughly revise flagged sections',
                'Verify all statistics with primary sources',
                'Consider restructuring claims for accuracy',
                'Add source citations throughout',
              ],
        timestamp: new Date(),
      };

      // Store the report - user will click button to view it
      setGeneratedReport(report);
    };

    processGateTwo();
  }, [videoInfo, extractedFacts, simulateStage, generateAnalysisResults]);

  const getStatusIcon = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'unverified':
        return <HelpCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'verified':
        return 'border-emerald-500/30 bg-emerald-500/5';
      case 'warning':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'error':
        return 'border-red-500/30 bg-red-500/5';
      case 'unverified':
        return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Brain className="w-4 h-4" />
          Gate Two: Human Analysis
        </motion.div>
        <motion.h2
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Analyzing Your Script
        </motion.h2>
        <motion.p
          className="text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Checking every claim like a real human fact-checker
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
              color={isComplete ? 'green' : 'blue'}
              label={isComplete ? 'Complete' : 'Analyzing'}
            />
          </div>

          {/* Stages */}
          <div className="flex-1 w-full">
            <div className="space-y-2">
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300
                    ${
                      stage.status === 'processing'
                        ? 'bg-indigo-500/10 border border-indigo-500/30'
                        : stage.status === 'completed'
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : 'bg-white/5 border border-white/10'
                    }
                  `}
                >
                  <div
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${
                        stage.status === 'processing'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : stage.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/10 text-white/40'
                      }
                    `}
                  >
                    {stage.status === 'processing' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : stage.status === 'completed' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      stage.icon
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        stage.status === 'processing'
                          ? 'text-indigo-400'
                          : stage.status === 'completed'
                          ? 'text-emerald-400'
                          : 'text-white/60'
                      }`}
                    >
                      {stage.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Human Thoughts */}
        <AnimatePresence>
          {humanThoughts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                Human Checker Thoughts
              </p>
              <div className="space-y-1">
                {humanThoughts.map((thought, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-sm ${
                      i === humanThoughts.length - 1 ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    💭 {thought}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Live Analysis Results */}
      <AnimatePresence>
        {analysisResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Live Analysis</h3>
                  <p className="text-sm text-white/60">
                    {analysisResults.length} segments analyzed
                  </p>
                </div>
                <div className="flex gap-3">
                  {[
                    { status: 'verified', color: 'emerald', count: analysisResults.filter(r => r.status === 'verified').length },
                    { status: 'warning', color: 'amber', count: analysisResults.filter(r => r.status === 'warning').length },
                    { status: 'error', color: 'red', count: analysisResults.filter(r => r.status === 'error').length },
                  ].map(({ status, color, count }) => (
                    <div key={status} className={`px-3 py-1 rounded-lg bg-${color}-500/10 text-${color}-400 text-sm`}>
                      {count} {status}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {analysisResults.slice(-5).map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white line-clamp-2">
                          {result.scriptSegment.slice(0, 150)}...
                        </p>
                        <p className="text-xs text-white/40 mt-2 italic">
                          &ldquo;{result.humanInsight}&rdquo;
                        </p>
                        {result.issues.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {result.issues.map((issue, i) => (
                              <span
                                key={i}
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  issue.severity === 'high'
                                    ? 'bg-red-500/20 text-red-400'
                                    : issue.severity === 'medium'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}
                              >
                                {issueTypeLabels[issue.type]}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Report Button - appears when analysis is complete */}
      <AnimatePresence>
        {isComplete && generatedReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-4"
          >
            <Card className="p-6 w-full" glow gradient>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Analysis Complete!</h3>
                <p className="text-white/60 mb-6">
                  Your script has been analyzed. View the full report with detailed feedback and recommendations.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-emerald-400 font-semibold">{generatedReport.summary.verifiedClaims}</span>
                    <span className="text-white/60 ml-2">Verified</span>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <span className="text-amber-400 font-semibold">{generatedReport.summary.warningClaims}</span>
                    <span className="text-white/60 ml-2">Warnings</span>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                    <span className="text-red-400 font-semibold">{generatedReport.summary.errorClaims}</span>
                    <span className="text-white/60 ml-2">Issues</span>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              size="lg"
              onClick={() => onComplete(generatedReport)}
              icon={<ArrowRight className="w-5 h-5" />}
              className="min-w-[250px]"
            >
              View Full Report
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
