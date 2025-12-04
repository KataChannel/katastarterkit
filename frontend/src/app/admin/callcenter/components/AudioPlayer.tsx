/**
 * AudioPlayer Component
 * Component phát audio recording của cuộc gọi
 * Hỗ trợ 2 nguồn: PBX Server và Google Drive
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Server, Cloud, ExternalLink } from 'lucide-react';
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
    return <span className="text-muted-foreground text-sm">Không có ghi âm</span>;
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

  return (
    <div className="flex flex-col gap-2 min-w-[180px]">
      {/* Source selector badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {pbxUrl && (
          <Badge
            variant={activeSource === 'pbx' ? 'default' : 'outline'}
            className={`cursor-pointer text-[10px] px-1.5 py-0 h-5 ${
              activeSource === 'pbx' ? 'bg-blue-600' : 'hover:bg-blue-50'
            }`}
            onClick={() => handleSourceChange('pbx')}
          >
            <Server className="h-3 w-3 mr-0.5" />
            PBX
          </Badge>
        )}
        {driveUrl && (
          <Badge
            variant={activeSource === 'drive' ? 'default' : 'outline'}
            className={`cursor-pointer text-[10px] px-1.5 py-0 h-5 ${
              activeSource === 'drive' ? 'bg-green-600' : 'hover:bg-green-50'
            }`}
            onClick={() => handleSourceChange('drive')}
          >
            <Cloud className="h-3 w-3 mr-0.5" />
            Drive
          </Badge>
        )}
      </div>

      {/* Player controls */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={togglePlay}
          className="h-8 w-8 p-0"
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
        
        <a
          href={currentUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
        >
          <ExternalLink className="h-3 w-3" />
          Tải về
        </a>
      </div>
      
      {/* Time display */}
      {duration > 0 && (
        <div className="text-xs text-muted-foreground font-mono">
          {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
        </div>
      )}
    </div>
  );
}
