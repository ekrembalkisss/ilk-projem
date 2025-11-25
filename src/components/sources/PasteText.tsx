'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ClipboardPaste, Plus, FileText, X, Link, Tag } from 'lucide-react';
import { Source } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';

interface PasteTextProps {
  onSourcesAdd: (sources: Source[]) => void;
  existingSources: Source[];
}

interface PastedSource {
  id: string;
  name: string;
  content: string;
  url?: string;
}

export default function PasteText({ onSourcesAdd, existingSources }: PasteTextProps) {
  const [currentSource, setCurrentSource] = useState<PastedSource>({
    id: uuidv4(),
    name: '',
    content: '',
    url: '',
  });
  const [pastedSources, setPastedSources] = useState<PastedSource[]>([]);
  const [showForm, setShowForm] = useState(true);

  const handleAddSource = () => {
    if (!currentSource.name.trim() || !currentSource.content.trim()) return;

    setPastedSources((prev) => [...prev, currentSource]);
    setCurrentSource({
      id: uuidv4(),
      name: '',
      content: '',
      url: '',
    });
  };

  const removeSource = (id: string) => {
    setPastedSources((prev) => prev.filter((s) => s.id !== id));
  };

  const submitAllSources = () => {
    const newSources: Source[] = pastedSources.map((ps) => ({
      id: ps.id,
      type: 'paste' as const,
      name: ps.name,
      content: ps.content,
      url: ps.url || undefined,
      timestamp: new Date(),
    }));

    onSourcesAdd(newSources);
    setPastedSources([]);
    setCurrentSource({
      id: uuidv4(),
      name: '',
      content: '',
      url: '',
    });
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCurrentSource((prev) => ({
        ...prev,
        content: text,
      }));
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const wordCount = currentSource.content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = currentSource.content.length;

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <ClipboardPaste className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Paste Text Sources</h3>
            <p className="text-sm text-white/60">
              Manually add text from articles, documents, or research materials
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Source Name"
                placeholder="e.g., Wikipedia Article, Research Paper..."
                value={currentSource.name}
                onChange={(value) => setCurrentSource((prev) => ({ ...prev, name: value }))}
                icon={<Tag className="w-4 h-4" />}
              />
              <Input
                label="Source URL (Optional)"
                placeholder="https://..."
                value={currentSource.url || ''}
                onChange={(value) => setCurrentSource((prev) => ({ ...prev, url: value }))}
                icon={<Link className="w-4 h-4" />}
              />
            </div>

            <div className="relative">
              <TextArea
                label="Source Content"
                placeholder="Paste your source text here..."
                value={currentSource.content}
                onChange={(value) => setCurrentSource((prev) => ({ ...prev, content: value }))}
                rows={8}
              />
              <button
                onClick={handlePasteFromClipboard}
                className="absolute top-8 right-3 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors"
              >
                <ClipboardPaste className="w-4 h-4" />
                Paste
              </button>
            </div>

            {/* Word/Character count */}
            {currentSource.content && (
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span>{wordCount.toLocaleString()} words</span>
                <span>{charCount.toLocaleString()} characters</span>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                onClick={handleAddSource}
                disabled={!currentSource.name.trim() || !currentSource.content.trim()}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Source
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Added Sources List */}
      <AnimatePresence>
        {pastedSources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">
                {pastedSources.length} source{pastedSources.length > 1 ? 's' : ''} added
              </p>
              <Button size="sm" onClick={submitAllSources} icon={<Plus className="w-4 h-4" />}>
                Submit All
              </Button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {pastedSources.map((source) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-amber-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{source.name}</p>
                    {source.url && (
                      <p className="text-xs text-amber-400/60 truncate">{source.url}</p>
                    )}
                    <p className="text-sm text-white/40 mt-1 line-clamp-2">{source.content}</p>
                    <p className="text-xs text-white/30 mt-1">
                      {source.content.trim().split(/\s+/).filter(Boolean).length} words
                    </p>
                  </div>

                  <button
                    onClick={() => removeSource(source.id)}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Templates */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-sm text-white/60 mb-3">Quick tips for better results:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {[
            'Include full article text, not just snippets',
            'Add publication date and author if available',
            'Include the source URL for reference',
            'Multiple smaller sources are better than one large one',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-white/40">
              <span className="text-violet-400">•</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
