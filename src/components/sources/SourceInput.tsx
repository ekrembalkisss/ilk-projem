'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Upload, Globe, Layers, ClipboardPaste, FolderOpen, Trash2 } from 'lucide-react';
import { Source, SourceType } from '@/types';
import Card from '../ui/Card';
import FileUpload from './FileUpload';
import WebSearch from './WebSearch';
import DeepSearch from './DeepSearch';
import PasteText from './PasteText';
import Button from '../ui/Button';

interface SourceInputProps {
  sources: Source[];
  onSourcesChange: (sources: Source[]) => void;
  onContinue: () => void;
}

interface TabConfig {
  id: SourceType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: TabConfig[] = [
  {
    id: 'upload',
    label: 'Upload Files',
    icon: <Upload className="w-5 h-5" />,
    description: 'Upload documents, PDFs, or text files',
  },
  {
    id: 'web-search',
    label: 'Web Search',
    icon: <Globe className="w-5 h-5" />,
    description: 'Search and add web sources',
  },
  {
    id: 'deep-search',
    label: 'Deep Search',
    icon: <Layers className="w-5 h-5" />,
    description: 'Comprehensive multi-source analysis',
  },
  {
    id: 'paste',
    label: 'Paste Text',
    icon: <ClipboardPaste className="w-5 h-5" />,
    description: 'Manually paste source content',
  },
];

export default function SourceInput({
  sources,
  onSourcesChange,
  onContinue,
}: SourceInputProps) {
  const [activeTab, setActiveTab] = useState<SourceType>('upload');

  const handleAddSources = (newSources: Source[]) => {
    onSourcesChange([...sources, ...newSources]);
  };

  const handleRemoveSource = (id: string) => {
    onSourcesChange(sources.filter((s) => s.id !== id));
  };

  const clearAllSources = () => {
    onSourcesChange([]);
  };

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case 'upload':
        return <Upload className="w-4 h-4" />;
      case 'web-search':
        return <Globe className="w-4 h-4" />;
      case 'deep-search':
        return <Layers className="w-4 h-4" />;
      case 'paste':
        return <ClipboardPaste className="w-4 h-4" />;
      default:
        return <FolderOpen className="w-4 h-4" />;
    }
  };

  const getSourceColor = (type: SourceType) => {
    switch (type) {
      case 'upload':
        return 'text-violet-400 bg-violet-400/10';
      case 'web-search':
        return 'text-blue-400 bg-blue-400/10';
      case 'deep-search':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'paste':
        return 'text-amber-400 bg-amber-400/10';
      default:
        return 'text-white/40 bg-white/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.h2
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Add Your Sources
        </motion.h2>
        <motion.p
          className="text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Provide sources that will be used to verify your script. More sources = better verification.
        </motion.p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300
              ${
                activeTab === tab.id
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
              }
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className="p-6" glow>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'upload' && (
              <FileUpload onSourcesAdd={handleAddSources} existingSources={sources} />
            )}
            {activeTab === 'web-search' && (
              <WebSearch onSourcesAdd={handleAddSources} existingSources={sources} />
            )}
            {activeTab === 'deep-search' && (
              <DeepSearch onSourcesAdd={handleAddSources} existingSources={sources} />
            )}
            {activeTab === 'paste' && (
              <PasteText onSourcesAdd={handleAddSources} existingSources={sources} />
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Added Sources Summary */}
      <AnimatePresence>
        {sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Added Sources ({sources.length})
                  </h3>
                  <p className="text-sm text-white/60">
                    {sources.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0).toLocaleString()}{' '}
                    total words
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={clearAllSources} icon={<Trash2 className="w-4 h-4" />}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {sources.map((source) => (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSourceColor(
                        source.type
                      )}`}
                    >
                      {getSourceIcon(source.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{source.name}</p>
                      <p className="text-xs text-white/40">
                        {source.content.split(/\s+/).length.toLocaleString()} words • {source.type}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveSource(source.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          size="lg"
          onClick={onContinue}
          disabled={sources.length === 0}
          className="min-w-[200px]"
        >
          Continue to Analysis
        </Button>
      </motion.div>
    </div>
  );
}
