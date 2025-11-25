'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Search, Globe, Loader2, ExternalLink, Plus, Check } from 'lucide-react';
import { Source, WebSearchResult } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface WebSearchProps {
  onSourcesAdd: (sources: Source[]) => void;
  existingSources: Source[];
}

export default function WebSearch({ onSourcesAdd, existingSources }: WebSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<WebSearchResult[]>([]);
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      // Simulated search results - in production, this would call a real search API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockResults: WebSearchResult[] = [
        {
          title: `Research findings on "${query}"`,
          url: `https://example.com/research/${encodeURIComponent(query)}`,
          snippet: `Comprehensive analysis and data regarding ${query}. This source provides verified information from multiple academic institutions...`,
          content: `Detailed research content about ${query}. According to recent studies, this topic has been extensively researched with multiple peer-reviewed publications supporting the key findings. The data shows consistent patterns across various demographic groups and time periods.`,
        },
        {
          title: `${query} - Wikipedia Overview`,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
          snippet: `Overview and background information about ${query}. Contains historical context, key facts, and references...`,
          content: `Wikipedia content for ${query}. This article covers the fundamental aspects, historical development, and current understanding of the topic. Multiple citations from academic sources support the information presented.`,
        },
        {
          title: `Latest News: ${query}`,
          url: `https://news.example.com/${encodeURIComponent(query)}`,
          snippet: `Recent developments and news articles related to ${query}. Updated information from verified news sources...`,
          content: `News article about ${query}. Recent reports indicate significant developments in this area. Experts from leading institutions have provided commentary on the implications and future outlook.`,
        },
        {
          title: `Expert Analysis: Understanding ${query}`,
          url: `https://expert-insights.com/${encodeURIComponent(query)}`,
          snippet: `In-depth expert analysis breaking down complex aspects of ${query}. Written by industry professionals...`,
          content: `Expert analysis on ${query}. This comprehensive guide breaks down the topic into understandable segments, providing context for both beginners and advanced readers. Key takeaways include actionable insights based on current best practices.`,
        },
        {
          title: `${query} Statistics & Data`,
          url: `https://data-source.com/stats/${encodeURIComponent(query)}`,
          snippet: `Statistical data and metrics related to ${query}. Includes charts, graphs, and verified numbers...`,
          content: `Statistical overview of ${query}. The data presented here has been compiled from multiple authoritative sources including government databases, academic research, and industry reports. Key statistics show trends and patterns over the past decade.`,
        },
      ];

      setResults(mockResults);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsSearching(false);
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
        type: 'web-search' as const,
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

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search for information sources..."
            value={query}
            onChange={setQuery}
            icon={<Search className="w-5 h-5" />}
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          loading={isSearching}
          icon={<Globe className="w-5 h-5" />}
        >
          Search
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

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
                Found {results.length} results for &ldquo;{query}&rdquo;
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

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
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
                          ${
                            isSelected
                              ? 'bg-violet-500 text-white'
                              : 'bg-white/10 text-white/40'
                          }
                        `}
                      >
                        {isSelected ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white truncate">{result.title}</h4>
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
                        <p className="text-sm text-white/60 mt-2 line-clamp-2">{result.snippet}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-10 h-10 text-violet-500" />
          </motion.div>
          <p className="mt-4 text-white/60">Searching the web...</p>
        </motion.div>
      )}
    </div>
  );
}
