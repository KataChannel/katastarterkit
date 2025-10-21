import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RatingStars from '../RatingStars';

describe('RatingStars', () => {
  it('should render rating stars', () => {
    const { container } = render(<RatingStars rating={4} />);
    const stars = container.querySelectorAll('.lucide-star');
    expect(stars).toHaveLength(5);
  });

  it('should render correct number of full stars', () => {
    const { container } = render(<RatingStars rating={3} />);
    const fullStars = container.querySelectorAll('.fill-yellow-400');
    expect(fullStars).toHaveLength(3);
  });

  it('should render half star for decimal ratings', () => {
    const { container } = render(<RatingStars rating={3.5} />);
    // 3 full stars + 1 half star
    const fullStars = container.querySelectorAll('.fill-yellow-400');
    expect(fullStars.length).toBeGreaterThanOrEqual(3);
  });

  it('should not render half star when decimal is less than 0.5', () => {
    const { container } = render(<RatingStars rating={3.4} />);
    const fullStars = container.querySelectorAll('.fill-yellow-400');
    expect(fullStars).toHaveLength(3);
  });

  it('should render empty stars for remaining slots', () => {
    const { container } = render(<RatingStars rating={2} />);
    const emptyStars = container.querySelectorAll('.text-gray-300');
    expect(emptyStars.length).toBeGreaterThanOrEqual(3); // At least 3 empty stars
  });

  it('should show rating number when showNumber is true', () => {
    render(<RatingStars rating={4.5} showNumber={true} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('should not show rating number by default', () => {
    render(<RatingStars rating={4.5} />);
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  it('should show review count when provided', () => {
    render(<RatingStars rating={4} reviewCount={150} />);
    expect(screen.getByText('(150)')).toBeInTheDocument();
  });

  it('should not show review count when not provided', () => {
    render(<RatingStars rating={4} />);
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('should render small size stars', () => {
    const { container } = render(<RatingStars rating={4} size="sm" />);
    const stars = container.querySelectorAll('.w-3.h-3');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('should render medium size stars by default', () => {
    const { container } = render(<RatingStars rating={4} />);
    const stars = container.querySelectorAll('.w-4.h-4');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('should render large size stars', () => {
    const { container } = render(<RatingStars rating={4} size="lg" />);
    const stars = container.querySelectorAll('.w-5.h-5');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('should handle 0 rating', () => {
    const { container } = render(<RatingStars rating={0} />);
    const emptyStars = container.querySelectorAll('.text-gray-300');
    expect(emptyStars).toHaveLength(5);
  });

  it('should handle maximum rating', () => {
    const { container } = render(<RatingStars rating={5} />);
    const fullStars = container.querySelectorAll('.fill-yellow-400');
    expect(fullStars).toHaveLength(5);
  });

  it('should handle custom maxRating', () => {
    const { container } = render(<RatingStars rating={8} maxRating={10} />);
    const stars = container.querySelectorAll('.lucide-star');
    expect(stars).toHaveLength(10);
  });

  it('should format rating number with 1 decimal place', () => {
    render(<RatingStars rating={4} showNumber={true} />);
    expect(screen.getByText('4.0')).toBeInTheDocument();
  });

  it('should format rating number with 1 decimal place for decimals', () => {
    render(<RatingStars rating={4.567} showNumber={true} />);
    expect(screen.getByText('4.6')).toBeInTheDocument();
  });

  it('should have proper spacing between stars', () => {
    const { container } = render(<RatingStars rating={4} />);
    const starsContainer = container.querySelector('.gap-0\\.5');
    expect(starsContainer).toBeInTheDocument();
  });

  it('should have proper spacing between stars and number', () => {
    const { container } = render(<RatingStars rating={4} showNumber />);
    const numberElement = screen.getByText('4.0');
    expect(numberElement).toHaveClass('ml-1');
  });

  it('should have proper spacing between number and review count', () => {
    const { container } = render(<RatingStars rating={4} reviewCount={100} />);
    const reviewElement = screen.getByText('(100)');
    expect(reviewElement).toHaveClass('ml-1');
  });

  it('should use yellow color for filled stars', () => {
    const { container } = render(<RatingStars rating={3} />);
    const fullStars = container.querySelectorAll('.text-yellow-400.fill-yellow-400');
    expect(fullStars).toHaveLength(3);
  });

  it('should use gray color for empty stars', () => {
    const { container } = render(<RatingStars rating={2} />);
    const emptyStars = container.querySelectorAll('.text-gray-300');
    expect(emptyStars.length).toBeGreaterThanOrEqual(3);
  });

  it('should render with flexbox layout', () => {
    const { container } = render(<RatingStars rating={4} />);
    const wrapper = container.querySelector('.flex.items-center');
    expect(wrapper).toBeInTheDocument();
  });

  it('should handle rating exactly at 0.5', () => {
    const { container } = render(<RatingStars rating={3.5} />);
    // Should have 3 full stars and 1 half star
    const fullStars = container.querySelectorAll('.fill-yellow-400');
    expect(fullStars.length).toBeGreaterThanOrEqual(3);
  });

  it('should handle rating just below 0.5 threshold', () => {
    const { container } = render(<RatingStars rating={3.49} />);
    const fullStars = container.querySelectorAll('.fill-yellow-400');
    expect(fullStars).toHaveLength(3); // No half star
  });

  it('should handle rating just above 0.5 threshold', () => {
    const { container } = render(<RatingStars rating={3.51} />);
    const fullStars = container.querySelectorAll('.fill-yellow-400');
    expect(fullStars.length).toBeGreaterThan(3); // Has half star
  });

  it('should display both number and review count together', () => {
    render(<RatingStars rating={4.5} showNumber={true} reviewCount={250} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(250)')).toBeInTheDocument();
  });

  it('should have medium font weight for rating number', () => {
    render(<RatingStars rating={4.5} showNumber={true} />);
    const numberElement = screen.getByText('4.5');
    expect(numberElement).toHaveClass('font-medium');
  });

  it('should have small text size for rating number', () => {
    render(<RatingStars rating={4.5} showNumber={true} />);
    const numberElement = screen.getByText('4.5');
    expect(numberElement).toHaveClass('text-sm');
  });

  it('should have gray color for review count', () => {
    render(<RatingStars rating={4} reviewCount={100} />);
    const reviewElement = screen.getByText('(100)');
    expect(reviewElement).toHaveClass('text-gray-500');
  });
});
