/**
 * AudioPlayer Component
 * Component phát audio recording của cuộc gọi
 * Hỗ trợ 2 nguồn: PBX Server và Google Drive
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Server, Cloud, Download } from 'lucide-react';
import { formatAudioTime, buildRecordingUrl } from '../utils';
import type { AudioPlayerProps } from '../types';

type AudioSource = 'pbx' | 'drive';

export function AudioPlayer({ recordPath, googleDriveUrl, domain }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeSource, setActiveSource] = useState<AudioSource>(googleDriveUrl ? 'drive' : 'pbx');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Build URLs
  const pbxUrl = recordPath ? buildRecordingUrl(recordPath) : null;
  const driveUrl = googleDriveUrl || null;

  // Get current playing URL based on active source
  const currentUrl = activeSource === 'drive' ? driveUrl : pbxUrl;

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

  // Reset player when source changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [activeSource]);

  // No recording available
  if (!recordPath && !googleDriveUrl) {
    return <span className="text-muted-foreground text-xs">Không có recording</span>;
  }

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

  const handleSourceChange = (source: AudioSource) => {
    if (source === activeSource) return;
    setActiveSource(source);
  };

  // Convert Google Drive view link to direct playable link
  const getPlayableUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // If it's a Google Drive view link, convert to direct download
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/d\/([^/]+)/);
      if (match) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return url;
  };

  // Check if both sources available
  const hasBothSources = pbxUrl && driveUrl;

  return (
    <div className="flex items-center gap-1">
      {/* Play button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={togglePlay}
        className="h-7 w-7 shrink-0"
        disabled={!currentUrl}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      {currentUrl && (
        <audio
          ref={audioRef}
          src={activeSource === 'drive' ? getPlayableUrl(currentUrl) || '' : currentUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Download link with source badge */}
      <a
        href={currentUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
      >
        Tải về
      </a>

      {/* Source selector - only show if both sources available */}
      {hasBothSources && (
        <div className="flex items-center gap-0.5 ml-1">
          <Badge
            variant={activeSource === 'pbx' ? 'default' : 'outline'}
            className={`cursor-pointer text-[9px] px-1 py-0 h-4 ${
              activeSource === 'pbx' ? 'bg-blue-600' : 'hover:bg-blue-50'
            }`}
            onClick={() => handleSourceChange('pbx')}
            title="PBX Server"
          >
            <Server className="h-2.5 w-2.5" />
          </Badge>
          <Badge
            variant={activeSource === 'drive' ? 'default' : 'outline'}
            className={`cursor-pointer text-[9px] px-1 py-0 h-4 ${
              activeSource === 'drive' ? 'bg-green-600' : 'hover:bg-green-50'
            }`}
            onClick={() => handleSourceChange('drive')}
            title="Google Drive"
          >
            <Cloud className="h-2.5 w-2.5" />
          </Badge>
        </div>
      )}
      
      {/* Time display when playing */}
      {duration > 0 && (
        <span className="text-[10px] text-muted-foreground font-mono ml-1 whitespace-nowrap">
          {formatAudioTime(currentTime)}/{formatAudioTime(duration)}
        </span>
      )}
    </div>
  );
}
