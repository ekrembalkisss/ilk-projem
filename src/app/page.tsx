'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Shield, Sparkles, Brain, FileCheck } from 'lucide-react';
import { Source, ExtractedFact, VideoInfo, OverallReport, AppState } from '@/types';
import SourceInput from '@/components/sources/SourceInput';
import GateOne from '@/components/gates/GateOne';
import VideoInfoForm from '@/components/gates/VideoInfoForm';
import GateTwo from '@/components/gates/GateTwo';
import Report from '@/components/report/Report';
import StepIndicator from '@/components/ui/StepIndicator';

const steps = [
  { id: 'sources', label: 'Add Sources', description: 'Upload your references' },
  { id: 'extract', label: 'Extract Facts', description: 'Analyze sources' },
  { id: 'video-info', label: 'Video Details', description: 'Enter script' },
  { id: 'analyze', label: 'Human Analysis', description: 'Verify content' },
  { id: 'report', label: 'Report', description: 'View results' },
];

export default function Home() {
  const [appState, setAppState] = useState<AppState>('source-input');
  const [sources, setSources] = useState<Source[]>([]);
  const [extractedFacts, setExtractedFacts] = useState<ExtractedFact[]>([]);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [report, setReport] = useState<OverallReport | null>(null);

  const getCurrentStep = () => {
    switch (appState) {
      case 'source-input':
        return 0;
      case 'gate-one':
        return 1;
      case 'video-info':
        return 2;
      case 'gate-two':
      case 'analyzing':
        return 3;
      case 'report':
        return 4;
      default:
        return 0;
    }
  };

  const handleSourcesContinue = () => {
    setAppState('gate-one');
  };

  const handleGateOneComplete = useCallback((facts: ExtractedFact[]) => {
    setExtractedFacts(facts);
    setAppState('video-info');
  }, []);

  const handleVideoInfoSubmit = (info: VideoInfo) => {
    setVideoInfo(info);
    setAppState('gate-two');
  };

  const handleGateTwoComplete = useCallback((generatedReport: OverallReport) => {
    setReport(generatedReport);
    setAppState('report');
  }, []);

  const handleStartOver = () => {
    setSources([]);
    setExtractedFacts([]);
    setVideoInfo(null);
    setReport(null);
    setAppState('source-input');
  };

  return (
    <main className="min-h-screen relative z-10">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent" />

        <div className="container mx-auto px-4 py-8">
          {/* Logo & Title */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Youtube className="w-7 h-7 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-3 h-3 text-white" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ScriptVerify Pro</h1>
              <p className="text-sm text-white/60">Human-like Script Verification</p>
            </div>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <StepIndicator steps={steps} currentStep={getCurrentStep()} />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Source Input State */}
            {appState === 'source-input' && (
              <motion.div
                key="source-input"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Welcome Section */}
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Premium Verification Engine
                  </motion.div>

                  <motion.h2
                    className="text-4xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Verify Your Script Like a{' '}
                    <span className="gradient-text">Real Human</span>
                  </motion.h2>

                  <motion.p
                    className="text-lg text-white/60 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Our two-gate verification system analyzes your YouTube script against your sources
                    with human-like attention to detail. No AI alterations — just honest fact-checking.
                  </motion.p>
                </div>

                {/* Feature Cards */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {[
                    {
                      icon: Brain,
                      title: 'Human-like Analysis',
                      description: 'Reviews your script as a real fact-checker would',
                    },
                    {
                      icon: Shield,
                      title: 'Source Verification',
                      description: 'Cross-references every claim with your sources',
                    },
                    {
                      icon: FileCheck,
                      title: 'Detailed Reports',
                      description: 'Get actionable insights with motion graphics',
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <feature.icon className="w-8 h-8 text-violet-400 mb-3" />
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-white/60">{feature.description}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <SourceInput
                  sources={sources}
                  onSourcesChange={setSources}
                  onContinue={handleSourcesContinue}
                />
              </motion.div>
            )}

            {/* Gate One State */}
            {appState === 'gate-one' && (
              <motion.div
                key="gate-one"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <GateOne sources={sources} onComplete={handleGateOneComplete} />
              </motion.div>
            )}

            {/* Video Info State */}
            {appState === 'video-info' && (
              <motion.div
                key="video-info"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <VideoInfoForm
                  extractedFacts={extractedFacts}
                  onSubmit={handleVideoInfoSubmit}
                />
              </motion.div>
            )}

            {/* Gate Two State */}
            {(appState === 'gate-two' || appState === 'analyzing') && videoInfo && (
              <motion.div
                key="gate-two"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <GateTwo
                  videoInfo={videoInfo}
                  extractedFacts={extractedFacts}
                  onComplete={handleGateTwoComplete}
                />
              </motion.div>
            )}

            {/* Report State */}
            {appState === 'report' && report && (
              <motion.div
                key="report"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Report report={report} onStartOver={handleStartOver} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4" />
              <span>ScriptVerify Pro</span>
            </div>
            <p>Human-like verification for YouTube creators</p>
            <div className="flex items-center gap-4">
              <span>Premium Tool</span>
              <span>•</span>
              <span>No AI Alterations</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
