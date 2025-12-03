/**
 * AudioPlayer Component
 * Component phát audio recording của cuộc gọi
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { formatAudioTime, buildRecordingUrl } from '../utils';
import type { AudioPlayerProps } from '../types';

export function AudioPlayer({ recordPath, domain }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, []);

  if (!recordPath) {
    return <span className="text-muted-foreground text-sm">Không có recording</span>;
  }

  const recordingUrl = buildRecordingUrl(recordPath);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={togglePlay}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <audio
          ref={audioRef}
          src={recordingUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <a
          href={recordingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          Tải về
        </a>
      </div>
      {duration > 0 && (
        <div className="text-xs text-muted-foreground font-mono">
          {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
        </div>
      )}
    </div>
  );
}
