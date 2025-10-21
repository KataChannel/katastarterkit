import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CourseCard from '../CourseCard';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, fill, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('CourseCard', () => {
  const mockCourse = {
    id: '1',
    title: 'Test Course',
    slug: 'test-course',
    description: 'Test Description',
    thumbnail: 'https://example.com/image.jpg',
    price: 99.99,
    level: 'BEGINNER',
    duration: 120,
    rating: 4.5,
    enrollmentCount: 150,
    reviewCount: 45,
    instructor: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      avatar: 'https://example.com/avatar.jpg',
    },
    category: {
      name: 'Programming',
      slug: 'programming',
    },
  };

  it('should render course title', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('Test Course')).toBeInTheDocument();
  });

  it('should render course description', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render course price', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should render free badge for free courses', () => {
    const freeCourse = { ...mockCourse, price: 0 };
    render(<CourseCard course={freeCourse} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('should render course level badge', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('BEGINNER')).toBeInTheDocument();
  });

  it('should render correct level badge colors for different levels', () => {
    const { rerender } = render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('BEGINNER')).toHaveClass('bg-green-100', 'text-green-800');
    
    rerender(<CourseCard course={{ ...mockCourse, level: 'INTERMEDIATE' }} />);
    expect(screen.getByText('INTERMEDIATE')).toHaveClass('bg-blue-100', 'text-blue-800');
    
    rerender(<CourseCard course={{ ...mockCourse, level: 'ADVANCED' }} />);
    expect(screen.getByText('ADVANCED')).toHaveClass('bg-purple-100', 'text-purple-800');
    
    rerender(<CourseCard course={{ ...mockCourse, level: 'EXPERT' }} />);
    expect(screen.getByText('EXPERT')).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should render course thumbnail when provided', () => {
    render(<CourseCard course={mockCourse} />);
    const img = screen.getByAltText('Test Course');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should render default icon when no thumbnail provided', () => {
    const courseWithoutThumbnail = { ...mockCourse, thumbnail: undefined };
    render(<CourseCard course={courseWithoutThumbnail} />);
    // BookOpen icon should be rendered
    expect(document.querySelector('.lucide-book-open')).toBeInTheDocument();
  });

  it('should render category name', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('Programming')).toBeInTheDocument();
  });

  it('should not render category when not provided', () => {
    const courseWithoutCategory = { ...mockCourse, category: undefined };
    render(<CourseCard course={courseWithoutCategory} />);
    expect(screen.queryByText('Programming')).not.toBeInTheDocument();
  });

  it('should render instructor name', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render instructor username if no first/last name', () => {
    const courseWithUsernameOnly = {
      ...mockCourse,
      instructor: {
        ...mockCourse.instructor!,
        firstName: undefined,
        lastName: undefined,
      },
    };
    render(<CourseCard course={courseWithUsernameOnly} />);
    expect(screen.getByText('johndoe')).toBeInTheDocument();
  });

  it('should hide instructor when showInstructor is false', () => {
    render(<CourseCard course={mockCourse} showInstructor={false} />);
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should render rating with star icon', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(45)')).toBeInTheDocument();
  });

  it('should render enrollment count', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('should render duration when provided', () => {
    render(<CourseCard course={mockCourse} />);
    // 120 minutes = 2h 0m
    expect(screen.getByText('2h 0m')).toBeInTheDocument();
  });

  it('should not render duration when not provided', () => {
    const courseWithoutDuration = { ...mockCourse, duration: undefined };
    render(<CourseCard course={courseWithoutDuration} />);
    expect(screen.queryByText(/h.*m/)).not.toBeInTheDocument();
  });

  it('should link to course detail page', () => {
    render(<CourseCard course={mockCourse} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/courses/test-course');
  });

  it('should apply hover effects with proper classes', () => {
    const { container } = render(<CourseCard course={mockCourse} />);
    const card = container.querySelector('.group');
    expect(card).toHaveClass('hover:shadow-xl', 'hover:border-blue-200');
  });
});
