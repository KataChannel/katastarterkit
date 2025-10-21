import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CourseList from '../CourseList';

// Mock CourseCard component
vi.mock('../CourseCard', () => ({
  default: ({ course, showInstructor }: any) => (
    <div data-testid={`course-card-${course.id}`} data-show-instructor={showInstructor}>
      {course.title}
    </div>
  ),
}));

describe('CourseList', () => {
  const mockCourses = [
    {
      id: '1',
      title: 'Course 1',
      slug: 'course-1',
      price: 99,
      level: 'BEGINNER',
      rating: 4.5,
      enrollmentCount: 100,
      reviewCount: 20,
    },
    {
      id: '2',
      title: 'Course 2',
      slug: 'course-2',
      price: 0,
      level: 'INTERMEDIATE',
      rating: 4.8,
      enrollmentCount: 200,
      reviewCount: 50,
    },
    {
      id: '3',
      title: 'Course 3',
      slug: 'course-3',
      price: 149,
      level: 'ADVANCED',
      rating: 4.9,
      enrollmentCount: 150,
      reviewCount: 35,
    },
  ];

  describe('Loading State', () => {
    it('should show loading skeleton when loading is true', () => {
      const { container } = render(<CourseList courses={[]} loading={true} />);
      
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(8);
    });

    it('should render 8 skeleton cards', () => {
      const { container } = render(<CourseList courses={[]} loading={true} />);
      
      const skeletonCards = container.querySelectorAll('.bg-white.rounded-xl');
      expect(skeletonCards.length).toBe(8);
    });

    it('should not show course cards when loading', () => {
      render(<CourseList courses={mockCourses} loading={true} />);
      
      expect(screen.queryByText('Course 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Course 2')).not.toBeInTheDocument();
    });

    it('should use grid layout for skeletons', () => {
      const { container } = render(<CourseList courses={[]} loading={true} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no courses', () => {
      render(<CourseList courses={[]} />);
      
      expect(screen.getByText('No courses found')).toBeInTheDocument();
    });

    it('should show custom empty message', () => {
      render(<CourseList courses={[]} emptyMessage="Custom empty message" />);
      
      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });

    it('should show empty state icon', () => {
      const { container } = render(<CourseList courses={[]} />);
      
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-8', 'h-8', 'text-gray-400');
    });

    it('should show "Check back later" text in empty state', () => {
      render(<CourseList courses={[]} />);
      
      expect(screen.getByText('Check back later for new courses')).toBeInTheDocument();
    });

    it('should show empty state when courses is undefined', () => {
      render(<CourseList courses={undefined as any} />);
      
      expect(screen.getByText('No courses found')).toBeInTheDocument();
    });

    it('should show empty state when courses is null', () => {
      render(<CourseList courses={null as any} />);
      
      expect(screen.getByText('No courses found')).toBeInTheDocument();
    });

    it('should center empty state content', () => {
      const { container } = render(<CourseList courses={[]} />);
      
      const emptyContainer = container.querySelector('.text-center.py-16');
      expect(emptyContainer).toBeInTheDocument();
    });
  });

  describe('Course Rendering', () => {
    it('should render all courses', () => {
      render(<CourseList courses={mockCourses} />);
      
      expect(screen.getByText('Course 1')).toBeInTheDocument();
      expect(screen.getByText('Course 2')).toBeInTheDocument();
      expect(screen.getByText('Course 3')).toBeInTheDocument();
    });

    it('should render correct number of course cards', () => {
      render(<CourseList courses={mockCourses} />);
      
      const cards = screen.getAllByTestId(/course-card-/);
      expect(cards).toHaveLength(3);
    });

    it('should pass course data to CourseCard', () => {
      render(<CourseList courses={mockCourses} />);
      
      expect(screen.getByTestId('course-card-1')).toHaveTextContent('Course 1');
      expect(screen.getByTestId('course-card-2')).toHaveTextContent('Course 2');
      expect(screen.getByTestId('course-card-3')).toHaveTextContent('Course 3');
    });

    it('should use grid layout for courses', () => {
      const { container } = render(<CourseList courses={mockCourses} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', 'gap-6');
    });

    it('should render single course correctly', () => {
      const singleCourse = [mockCourses[0]];
      render(<CourseList courses={singleCourse} />);
      
      expect(screen.getByTestId('course-card-1')).toBeInTheDocument();
      expect(screen.queryByTestId('course-card-2')).not.toBeInTheDocument();
    });

    it('should handle large number of courses', () => {
      const manyCourses = Array.from({ length: 20 }, (_, i) => ({
        ...mockCourses[0],
        id: `course-${i}`,
        title: `Course ${i}`,
      }));
      
      render(<CourseList courses={manyCourses} />);
      
      const cards = screen.getAllByTestId(/course-card-/);
      expect(cards).toHaveLength(20);
    });
  });

  describe('Show Instructor Prop', () => {
    it('should pass showInstructor=true by default', () => {
      render(<CourseList courses={mockCourses} />);
      
      const card = screen.getByTestId('course-card-1');
      expect(card).toHaveAttribute('data-show-instructor', 'true');
    });

    it('should pass showInstructor=false when specified', () => {
      render(<CourseList courses={mockCourses} showInstructor={false} />);
      
      const card = screen.getByTestId('course-card-1');
      expect(card).toHaveAttribute('data-show-instructor', 'false');
    });

    it('should pass showInstructor to all course cards', () => {
      render(<CourseList courses={mockCourses} showInstructor={false} />);
      
      const cards = screen.getAllByTestId(/course-card-/);
      cards.forEach(card => {
        expect(card).toHaveAttribute('data-show-instructor', 'false');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid columns', () => {
      const { container } = render(<CourseList courses={mockCourses} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass(
        'grid-cols-1',     // Mobile
        'md:grid-cols-2',  // Tablet
        'lg:grid-cols-3',  // Desktop
        'xl:grid-cols-4'   // Large desktop
      );
    });

    it('should have consistent gap between cards', () => {
      const { container } = render(<CourseList courses={mockCourses} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-6');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array', () => {
      render(<CourseList courses={[]} />);
      
      expect(screen.getByText('No courses found')).toBeInTheDocument();
      expect(screen.queryByTestId(/course-card-/)).not.toBeInTheDocument();
    });

    it('should not crash with missing course properties', () => {
      const incompleteCourses = [
        { id: '1', title: 'Course 1' } as any,
      ];
      
      expect(() => {
        render(<CourseList courses={incompleteCourses} />);
      }).not.toThrow();
    });

    it('should handle loading=false explicitly', () => {
      render(<CourseList courses={mockCourses} loading={false} />);
      
      expect(screen.getByText('Course 1')).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    it('should transition from loading to loaded', () => {
      const { rerender } = render(<CourseList courses={[]} loading={true} />);
      
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
      
      rerender(<CourseList courses={mockCourses} loading={false} />);
      
      expect(screen.getByText('Course 1')).toBeInTheDocument();
      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });

    it('should transition from loading to empty', () => {
      const { rerender } = render(<CourseList courses={[]} loading={true} />);
      
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
      
      rerender(<CourseList courses={[]} loading={false} />);
      
      expect(screen.getByText('No courses found')).toBeInTheDocument();
    });

    it('should transition from loaded to loading', () => {
      const { rerender } = render(<CourseList courses={mockCourses} loading={false} />);
      
      expect(screen.getByText('Course 1')).toBeInTheDocument();
      
      rerender(<CourseList courses={mockCourses} loading={true} />);
      
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
      expect(screen.queryByText('Course 1')).not.toBeInTheDocument();
    });
  });
});
