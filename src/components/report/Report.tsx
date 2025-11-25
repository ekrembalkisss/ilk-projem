'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Download,
  Share2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Youtube,
  User,
  FileText,
  Sparkles,
  Shield,
  Scale,
  Target,
  TrendingUp,
  Award,
  ExternalLink,
} from 'lucide-react';
import { OverallReport, AnalysisResult, IssueType } from '@/types';
import Card from '../ui/Card';
import ProgressRing from '../ui/ProgressRing';
import Button from '../ui/Button';

interface ReportProps {
  report: OverallReport;
  onStartOver: () => void;
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

export default function Report({ report, onStartOver }: ReportProps) {
  const [showAllResults, setShowAllResults] = useState(false);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  // Animate score on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = report.totalScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= report.totalScore) {
        setAnimatedScore(report.totalScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [report.totalScore]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'green';
    if (score >= 70) return 'blue';
    if (score >= 50) return 'yellow';
    return 'red';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Work';
  };

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

  const displayedResults = showAllResults
    ? report.analysisResults
    : report.analysisResults.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header with Animation */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-violet-400 text-sm font-medium mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <Award className="w-4 h-4" />
          Analysis Complete
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Your Script Report</h2>
        <p className="text-white/60">Human-verified analysis results</p>
      </motion.div>

      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="p-8" glow gradient>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Main Score Ring */}
            <div className="relative">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, type: 'spring' }}
              >
                <ProgressRing
                  progress={animatedScore}
                  size={180}
                  strokeWidth={12}
                  color={getScoreColor(report.totalScore)}
                  showPercentage={false}
                />
              </motion.div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="text-5xl font-bold text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  {animatedScore}
                </motion.span>
                <motion.span
                  className={`text-sm font-medium ${
                    report.totalScore >= 85
                      ? 'text-emerald-400'
                      : report.totalScore >= 70
                      ? 'text-blue-400'
                      : report.totalScore >= 50
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {getScoreLabel(report.totalScore)}
                </motion.span>
              </div>
            </div>

            {/* Video Info & Summary */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                  <User className="w-4 h-4 text-violet-400" />
                  <span className="text-sm text-white">{report.videoInfo.channelName}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                  <Youtube className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-white truncate max-w-[200px]">
                    {report.videoInfo.videoTitle}
                  </span>
                </div>
              </div>

              <motion.p
                className="text-white/80 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {report.summary.humanVerdict}
              </motion.p>

              {/* Quick Stats */}
              <motion.div
                className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {[
                  {
                    label: 'Verified',
                    value: report.summary.verifiedClaims,
                    color: 'emerald',
                    icon: CheckCircle,
                  },
                  {
                    label: 'Warnings',
                    value: report.summary.warningClaims,
                    color: 'amber',
                    icon: AlertTriangle,
                  },
                  {
                    label: 'Issues',
                    value: report.summary.errorClaims,
                    color: 'red',
                    icon: XCircle,
                  },
                  {
                    label: 'Unverified',
                    value: report.summary.unverifiedClaims,
                    color: 'blue',
                    icon: HelpCircle,
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                    <span className={`text-2xl font-bold text-${stat.color}-400`}>
                      {stat.value}
                    </span>
                    <span className="text-sm text-white/60">{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              <span className="font-medium text-white">Score Breakdown</span>
            </div>
            {showScoreBreakdown ? (
              <ChevronUp className="w-5 h-5 text-white/40" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/40" />
            )}
          </button>

          <AnimatePresence>
            {showScoreBreakdown && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-white/10"
              >
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Fact Accuracy',
                      value: report.factAccuracy,
                      icon: Target,
                      color: 'violet',
                    },
                    {
                      label: 'Source Alignment',
                      value: report.sourceAlignment,
                      icon: FileText,
                      color: 'blue',
                    },
                    {
                      label: 'Consistency',
                      value: report.consistencyScore,
                      icon: Scale,
                      color: 'emerald',
                    },
                    {
                      label: 'Credibility',
                      value: report.credibilityScore,
                      icon: Shield,
                      color: 'amber',
                    },
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProgressRing
                        progress={metric.value}
                        size={80}
                        strokeWidth={6}
                        color={metric.color}
                      />
                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        <metric.icon className={`w-4 h-4 text-${metric.color}-400`} />
                        <span className="text-sm text-white/60">{metric.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Recommendations</h3>
          </div>
          <div className="space-y-3">
            {report.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-violet-400">{index + 1}</span>
                </div>
                <p className="text-white/80">{rec}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Detailed Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-semibold text-white">Detailed Analysis</h3>
            </div>
            <span className="text-sm text-white/40">
              {report.analysisResults.length} segments
            </span>
          </div>

          <div className="space-y-3">
            {displayedResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border overflow-hidden ${getStatusColor(result.status)}`}
              >
                <button
                  onClick={() =>
                    setExpandedResult(expandedResult === result.id ? null : result.id)
                  }
                  className="w-full p-4 flex items-start gap-3 text-left hover:bg-white/5 transition-colors"
                >
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white line-clamp-2">
                      {result.scriptSegment.slice(0, 150)}
                      {result.scriptSegment.length > 150 && '...'}
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
                  {expandedResult === result.id ? (
                    <ChevronUp className="w-5 h-5 text-white/40 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedResult === result.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-4 space-y-4">
                        {/* Full Segment */}
                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                            Full Segment
                          </p>
                          <p className="text-sm text-white/80">{result.scriptSegment}</p>
                        </div>

                        {/* Human Insight */}
                        <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                          <p className="text-xs text-violet-400 uppercase tracking-wider mb-1">
                            Human Insight
                          </p>
                          <p className="text-sm text-white/80 italic">
                            &ldquo;{result.humanInsight}&rdquo;
                          </p>
                        </div>

                        {/* Matched Facts */}
                        {result.matchedFacts.length > 0 && (
                          <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                              Matched Sources
                            </p>
                            <div className="space-y-2">
                              {result.matchedFacts.map((match) => (
                                <div
                                  key={match.factId}
                                  className="p-2 rounded-lg bg-white/5 text-sm"
                                >
                                  <p className="text-white/80">{match.fact}</p>
                                  <p className="text-xs text-white/40 mt-1">
                                    Source: {match.sourceName} •{' '}
                                    {Math.round(match.matchConfidence * 100)}% match
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Issues Detail */}
                        {result.issues.length > 0 && (
                          <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                              Issues & Suggestions
                            </p>
                            <div className="space-y-2">
                              {result.issues.map((issue, i) => (
                                <div
                                  key={i}
                                  className={`p-3 rounded-lg ${
                                    issue.severity === 'high'
                                      ? 'bg-red-500/10 border border-red-500/20'
                                      : issue.severity === 'medium'
                                      ? 'bg-amber-500/10 border border-amber-500/20'
                                      : 'bg-blue-500/10 border border-blue-500/20'
                                  }`}
                                >
                                  <p className="text-sm text-white/80">{issue.description}</p>
                                  <p className="text-xs text-white/60 mt-2">
                                    💡 {issue.suggestion}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {report.analysisResults.length > 5 && (
            <button
              onClick={() => setShowAllResults(!showAllResults)}
              className="w-full mt-4 py-3 text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center justify-center gap-2"
            >
              {showAllResults ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show All {report.analysisResults.length} Results
                </>
              )}
            </button>
          )}
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          variant="secondary"
          icon={<Download className="w-5 h-5" />}
          onClick={() => {
            // Export report as JSON
            const dataStr = JSON.stringify(report, null, 2);
            const dataUri =
              'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportName = `script-report-${Date.now()}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportName);
            linkElement.click();
          }}
        >
          Export Report
        </Button>
        <Button
          variant="secondary"
          icon={<Share2 className="w-5 h-5" />}
          onClick={() => {
            navigator.clipboard.writeText(
              `Script Analysis Report\n\nChannel: ${report.videoInfo.channelName}\nTitle: ${report.videoInfo.videoTitle}\nScore: ${report.totalScore}/100\n\n${report.summary.humanVerdict}`
            );
          }}
        >
          Share Summary
        </Button>
        <Button variant="primary" icon={<RefreshCw className="w-5 h-5" />} onClick={onStartOver}>
          Analyze New Script
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-center text-sm text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>
          Report generated on{' '}
          {new Date(report.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </motion.div>
    </div>
  );
}
