'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Youtube, User, Type, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { VideoInfo, ExtractedFact } from '@/types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';

interface VideoInfoFormProps {
  extractedFacts: ExtractedFact[];
  onSubmit: (videoInfo: VideoInfo) => void;
}

export default function VideoInfoForm({ extractedFacts, onSubmit }: VideoInfoFormProps) {
  const [videoInfo, setVideoInfo] = useState<VideoInfo>({
    channelName: '',
    videoTitle: '',
    script: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof VideoInfo, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof VideoInfo, string>> = {};

    if (!videoInfo.channelName.trim()) {
      newErrors.channelName = 'Channel name is required';
    }
    if (!videoInfo.videoTitle.trim()) {
      newErrors.videoTitle = 'Video title is required';
    }
    if (!videoInfo.script.trim()) {
      newErrors.script = 'Script is required';
    } else if (videoInfo.script.trim().split(/\s+/).length < 50) {
      newErrors.script = 'Script should be at least 50 words for meaningful analysis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(videoInfo);
    }
  };

  const wordCount = videoInfo.script.trim().split(/\s+/).filter(Boolean).length;
  const estimatedDuration = Math.ceil(wordCount / 150); // ~150 words per minute

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Youtube className="w-4 h-4" />
          Video Information
        </motion.div>
        <motion.h2
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Enter Your Video Details
        </motion.h2>
        <motion.p
          className="text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Provide your channel info and the script you want to verify
        </motion.p>
      </div>

      {/* Facts Summary */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {extractedFacts.length} Facts Ready for Verification
            </p>
            <p className="text-sm text-white/60">
              Your script will be checked against these extracted facts
            </p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card className="p-6" glow>
        <div className="space-y-6">
          {/* Channel & Title Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Channel Name"
              placeholder="e.g., TechExplained, ScienceDaily..."
              value={videoInfo.channelName}
              onChange={(value) => setVideoInfo((prev) => ({ ...prev, channelName: value }))}
              icon={<User className="w-4 h-4" />}
              error={errors.channelName}
            />
            <Input
              label="Video Title"
              placeholder="e.g., The Truth About AI in 2024"
              value={videoInfo.videoTitle}
              onChange={(value) => setVideoInfo((prev) => ({ ...prev, videoTitle: value }))}
              icon={<Type className="w-4 h-4" />}
              error={errors.videoTitle}
            />
          </div>

          {/* Script Input */}
          <div>
            <TextArea
              label="Video Script"
              placeholder="Paste your complete video script here. The script will be analyzed segment by segment against the sources you provided. Include all dialogue, narration, and on-screen text..."
              value={videoInfo.script}
              onChange={(value) => setVideoInfo((prev) => ({ ...prev, script: value }))}
              rows={12}
              error={errors.script}
            />

            {/* Script Stats */}
            {videoInfo.script && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-4 mt-3"
              >
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-white/40" />
                  <span className="text-white/60">
                    {wordCount.toLocaleString()} words
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Youtube className="w-4 h-4 text-white/40" />
                  <span className="text-white/60">~{estimatedDuration} min video</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-white/40" />
                  <span className="text-white/60">
                    {Math.ceil(wordCount / 100)} segments to analyze
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/60 mb-3 font-medium">Tips for best results:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-white/40">
              {[
                'Include your complete script, not just bullet points',
                'Add any statistics or claims you plan to mention',
                'Include direct quotes you intend to use',
                'Mention specific names, dates, and events',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Warning for short scripts */}
          {wordCount > 0 && wordCount < 100 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
            >
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-400 font-medium">Short Script Detected</p>
                <p className="text-xs text-amber-400/60">
                  Longer scripts provide more comprehensive analysis. Consider adding more content.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Submit Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!videoInfo.channelName || !videoInfo.videoTitle || !videoInfo.script}
          icon={<Sparkles className="w-5 h-5" />}
          className="min-w-[200px]"
        >
          Start Human Analysis
        </Button>
      </motion.div>
    </div>
  );
}
