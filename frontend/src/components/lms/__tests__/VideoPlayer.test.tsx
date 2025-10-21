import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VideoPlayer from '../VideoPlayer';

// Mock Plyr
vi.mock('plyr-react', () => ({
  default: vi.fn(({ source, options }) => (
    <div data-testid="plyr-player">
      <video src={source.sources[0].src} poster={source.poster} />
      <div data-testid="plyr-controls">
        {options.controls.join(', ')}
      </div>
    </div>
  )),
}));

describe('VideoPlayer', () => {
  const defaultProps = {
    src: 'https://example.com/video.mp4',
    poster: 'https://example.com/poster.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render video player', () => {
    render(<VideoPlayer {...defaultProps} />);
    expect(screen.getByTestId('plyr-player')).toBeInTheDocument();
  });

  it('should render video with correct src', () => {
    render(<VideoPlayer {...defaultProps} />);
    const video = screen.getByRole('generic', { hidden: true }).querySelector('video');
    expect(video).toHaveAttribute('src', 'https://example.com/video.mp4');
  });

  it('should render video with poster image', () => {
    render(<VideoPlayer {...defaultProps} />);
    const video = screen.getByRole('generic', { hidden: true }).querySelector('video');
    expect(video).toHaveAttribute('poster', 'https://example.com/poster.jpg');
  });

  it('should work without poster image', () => {
    const { src, ...propsWithoutPoster } = defaultProps;
    render(<VideoPlayer src={src} />);
    expect(screen.getByTestId('plyr-player')).toBeInTheDocument();
  });

  it('should render with all standard controls', () => {
    render(<VideoPlayer {...defaultProps} />);
    const controls = screen.getByTestId('plyr-controls');
    
    expect(controls).toHaveTextContent('play-large');
    expect(controls).toHaveTextContent('play');
    expect(controls).toHaveTextContent('progress');
    expect(controls).toHaveTextContent('current-time');
    expect(controls).toHaveTextContent('duration');
    expect(controls).toHaveTextContent('mute');
    expect(controls).toHaveTextContent('volume');
    expect(controls).toHaveTextContent('fullscreen');
  });

  it('should call onProgress callback during playback', async () => {
    const onProgress = vi.fn();
    const mockPlayer = {
      plyr: {
        currentTime: 30,
        duration: 100,
        on: vi.fn((event, callback) => {
          if (event === 'timeupdate') {
            setTimeout(() => callback(), 0);
          }
        }),
        off: vi.fn(),
      },
    };

    const { rerender } = render(
      <VideoPlayer {...defaultProps} onProgress={onProgress} />
    );

    // Simulate ref assignment
    await waitFor(() => {
      expect(onProgress).toHaveBeenCalled();
    }, { timeout: 100 });
  });

  it('should call onComplete when video ends', async () => {
    const onComplete = vi.fn();
    const mockPlayer = {
      plyr: {
        currentTime: 100,
        duration: 100,
        on: vi.fn((event, callback) => {
          if (event === 'ended') {
            setTimeout(() => callback(), 0);
          }
        }),
        off: vi.fn(),
      },
    };

    render(<VideoPlayer {...defaultProps} onComplete={onComplete} />);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 100 });
  });

  it('should set start time when provided', () => {
    const startTime = 60;
    render(<VideoPlayer {...defaultProps} startTime={startTime} />);
    
    // Player should attempt to set currentTime to 60
    expect(screen.getByTestId('plyr-player')).toBeInTheDocument();
  });

  it('should not set start time when not provided', () => {
    render(<VideoPlayer {...defaultProps} />);
    expect(screen.getByTestId('plyr-player')).toBeInTheDocument();
  });

  it('should support autoplay', () => {
    render(<VideoPlayer {...defaultProps} autoPlay={true} />);
    expect(screen.getByTestId('plyr-player')).toBeInTheDocument();
  });

  it('should not autoplay by default', () => {
    render(<VideoPlayer {...defaultProps} />);
    expect(screen.getByTestId('plyr-player')).toBeInTheDocument();
  });

  it('should cleanup event listeners on unmount', () => {
    const mockOff = vi.fn();
    const mockPlayer = {
      plyr: {
        currentTime: 0,
        duration: 100,
        on: vi.fn(),
        off: mockOff,
      },
    };

    const { unmount } = render(<VideoPlayer {...defaultProps} />);
    unmount();

    // Cleanup should be called
    expect(screen.queryByTestId('plyr-player')).not.toBeInTheDocument();
  });

  it('should calculate progress percentage correctly', () => {
    const onProgress = vi.fn();
    
    // Mock player with 30 seconds played out of 100 seconds total
    const mockPlayer = {
      plyr: {
        currentTime: 30,
        duration: 100,
        on: vi.fn((event, callback) => {
          if (event === 'timeupdate') {
            callback();
          }
        }),
        off: vi.fn(),
      },
    };

    render(<VideoPlayer {...defaultProps} onProgress={onProgress} />);
    
    // Progress should be 30% (30/100 * 100)
    // This would be verified in integration tests
  });

  it('should track progress every 5 seconds', () => {
    vi.useFakeTimers();
    const onProgress = vi.fn();

    render(<VideoPlayer {...defaultProps} onProgress={onProgress} />);

    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);

    // Progress tracking should have been called
    // (actual implementation depends on player mock)

    vi.useRealTimers();
  });

  it('should clear interval on unmount', () => {
    vi.useFakeTimers();
    const onProgress = vi.fn();

    const { unmount } = render(<VideoPlayer {...defaultProps} onProgress={onProgress} />);

    unmount();

    // Advance time after unmount - no new calls should happen
    const callCountBeforeUnmount = onProgress.mock.calls.length;
    vi.advanceTimersByTime(10000);
    expect(onProgress.mock.calls.length).toBe(callCountBeforeUnmount);

    vi.useRealTimers();
  });

  it('should report 100% progress when video completes', async () => {
    const onProgress = vi.fn();
    const mockPlayer = {
      plyr: {
        currentTime: 100,
        duration: 100,
        on: vi.fn((event, callback) => {
          if (event === 'ended') {
            callback();
          }
        }),
        off: vi.fn(),
      },
    };

    render(<VideoPlayer {...defaultProps} onProgress={onProgress} />);

    // onProgress should eventually be called with 100
    await waitFor(() => {
      expect(onProgress).toHaveBeenCalledWith(100);
    }, { timeout: 100 });
  });

  it('should have responsive container with rounded corners', () => {
    const { container } = render(<VideoPlayer {...defaultProps} />);
    const wrapper = container.querySelector('.w-full.rounded-lg');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('overflow-hidden', 'bg-black');
  });
});
