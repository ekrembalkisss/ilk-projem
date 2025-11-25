// Types for YouTube Script Checker App

export type SourceType = 'upload' | 'web-search' | 'deep-search' | 'paste';

export interface Source {
  id: string;
  type: SourceType;
  name: string;
  content: string;
  url?: string;
  timestamp: Date;
}

export interface ExtractedFact {
  id: string;
  fact: string;
  sourceId: string;
  sourceName: string;
  confidence: number;
  category: FactCategory;
}

export type FactCategory =
  | 'statistic'
  | 'quote'
  | 'date'
  | 'name'
  | 'event'
  | 'claim'
  | 'definition'
  | 'process'
  | 'comparison';

export interface VideoInfo {
  channelName: string;
  videoTitle: string;
  script: string;
}

export interface AnalysisResult {
  id: string;
  scriptSegment: string;
  matchedFacts: MatchedFact[];
  issues: Issue[];
  status: 'verified' | 'warning' | 'error' | 'unverified';
  humanInsight: string;
}

export interface MatchedFact {
  factId: string;
  fact: string;
  matchConfidence: number;
  sourceName: string;
}

export interface Issue {
  type: IssueType;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestion: string;
}

export type IssueType =
  | 'factual-error'
  | 'missing-source'
  | 'outdated-info'
  | 'exaggeration'
  | 'misattribution'
  | 'inconsistency'
  | 'unverifiable-claim';

export interface OverallReport {
  videoInfo: VideoInfo;
  totalScore: number;
  factAccuracy: number;
  sourceAlignment: number;
  consistencyScore: number;
  credibilityScore: number;
  analysisResults: AnalysisResult[];
  extractedFacts: ExtractedFact[];
  summary: ReportSummary;
  recommendations: string[];
  timestamp: Date;
}

export interface ReportSummary {
  totalClaims: number;
  verifiedClaims: number;
  warningClaims: number;
  errorClaims: number;
  unverifiedClaims: number;
  humanVerdict: string;
}

export type AppState =
  | 'source-input'
  | 'gate-one'
  | 'video-info'
  | 'gate-two'
  | 'analyzing'
  | 'report';

export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress: number;
  message?: string;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  content?: string;
}

export interface DeepSearchResult extends WebSearchResult {
  subResults: WebSearchResult[];
  analysisDepth: number;
}
