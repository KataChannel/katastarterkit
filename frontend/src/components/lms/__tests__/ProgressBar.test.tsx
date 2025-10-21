import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('should render progress bar', () => {
    const { container } = render(<ProgressBar progress={50} />);
    expect(container.querySelector('.bg-gray-200')).toBeInTheDocument();
  });

  it('should display correct progress width', () => {
    const { container } = render(<ProgressBar progress={75} />);
    const progressElement = container.querySelector('.bg-blue-600');
    expect(progressElement).toHaveStyle({ width: '75%' });
  });

  it('should clamp progress to 0 minimum', () => {
    const { container } = render(<ProgressBar progress={-10} />);
    const progressElement = container.querySelector('.bg-blue-600');
    expect(progressElement).toHaveStyle({ width: '0%' });
  });

  it('should clamp progress to 100 maximum', () => {
    const { container } = render(<ProgressBar progress={150} />);
    const progressElement = container.querySelector('.bg-blue-600');
    expect(progressElement).toHaveStyle({ width: '100%' });
  });

  it('should show percentage when showPercentage is true', () => {
    render(<ProgressBar progress={65} showPercentage={true} />);
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('should not show percentage by default', () => {
    render(<ProgressBar progress={65} />);
    expect(screen.queryByText('65%')).not.toBeInTheDocument();
  });

  it('should render small size', () => {
    const { container } = render(<ProgressBar progress={50} size="sm" />);
    const bar = container.querySelector('.h-1');
    expect(bar).toBeInTheDocument();
  });

  it('should render medium size by default', () => {
    const { container } = render(<ProgressBar progress={50} />);
    const bar = container.querySelector('.h-2');
    expect(bar).toBeInTheDocument();
  });

  it('should render large size', () => {
    const { container } = render(<ProgressBar progress={50} size="lg" />);
    const bar = container.querySelector('.h-3');
    expect(bar).toBeInTheDocument();
  });

  it('should use blue color by default', () => {
    const { container } = render(<ProgressBar progress={50} />);
    const progressElement = container.querySelector('.bg-blue-600');
    expect(progressElement).toBeInTheDocument();
  });

  it('should render green color', () => {
    const { container } = render(<ProgressBar progress={50} color="green" />);
    const progressElement = container.querySelector('.bg-green-600');
    expect(progressElement).toBeInTheDocument();
  });

  it('should render purple color', () => {
    const { container } = render(<ProgressBar progress={50} color="purple" />);
    const progressElement = container.querySelector('.bg-purple-600');
    expect(progressElement).toBeInTheDocument();
  });

  it('should render yellow color', () => {
    const { container } = render(<ProgressBar progress={50} color="yellow" />);
    const progressElement = container.querySelector('.bg-yellow-600');
    expect(progressElement).toBeInTheDocument();
  });

  it('should handle 0 progress', () => {
    const { container } = render(<ProgressBar progress={0} />);
    const progressElement = container.querySelector('.bg-blue-600');
    expect(progressElement).toHaveStyle({ width: '0%' });
  });

  it('should handle 100 progress', () => {
    const { container } = render(<ProgressBar progress={100} />);
    const progressElement = container.querySelector('.bg-blue-600');
    expect(progressElement).toHaveStyle({ width: '100%' });
  });

  it('should handle decimal progress values', () => {
    const { container } = render(<ProgressBar progress={45.7} showPercentage />);
    const progressElement = container.querySelector('.bg-blue-600');
    expect(progressElement).toHaveStyle({ width: '45.7%' });
    expect(screen.getByText('45.7%')).toBeInTheDocument();
  });

  it('should have rounded corners', () => {
    const { container } = render(<ProgressBar progress={50} />);
    const bar = container.querySelector('.rounded-full');
    expect(bar).toBeInTheDocument();
  });

  it('should have transition animation', () => {
    const { container } = render(<ProgressBar progress={50} />);
    const progressElement = container.querySelector('.bg-blue-600');
    expect(progressElement).toHaveClass('transition-all', 'duration-300', 'ease-out');
  });

  it('should be full width', () => {
    const { container } = render(<ProgressBar progress={50} />);
    const wrapper = container.querySelector('.w-full');
    expect(wrapper).toBeInTheDocument();
  });

  it('should align percentage text to right', () => {
    render(<ProgressBar progress={50} showPercentage />);
    const percentageText = screen.getByText('50%');
    expect(percentageText).toHaveClass('text-right');
  });

  it('should have proper spacing between bar and percentage', () => {
    render(<ProgressBar progress={50} showPercentage />);
    const percentageText = screen.getByText('50%');
    expect(percentageText).toHaveClass('mt-1');
  });

  it('should render with accessibility considerations', () => {
    const { container } = render(<ProgressBar progress={50} />);
    // Progress bar should be visually accessible
    const progressElement = container.querySelector('.bg-blue-600');
    expect(progressElement).toBeInTheDocument();
  });
});
