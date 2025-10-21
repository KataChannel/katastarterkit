import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import EnrollButton from '../EnrollButton';
import { ENROLL_COURSE } from '@/graphql/lms/enrollments.graphql';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('EnrollButton', () => {
  const mockEnrollSuccess = {
    request: {
      query: ENROLL_COURSE,
      variables: {
        input: { courseId: 'course-1' },
      },
    },
    result: {
      data: {
        enrollCourse: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          status: 'ACTIVE',
          progress: 0,
          enrolledAt: '2025-10-21T00:00:00.000Z',
          completedAt: null,
          lastAccessedAt: '2025-10-21T00:00:00.000Z',
          course: {
            id: 'course-1',
            title: 'Test Course',
            slug: 'test-course',
            __typename: 'Course',
          },
          __typename: 'Enrollment',
        },
      },
    },
  };

  const mockEnrollError = {
    request: {
      query: ENROLL_COURSE,
      variables: {
        input: { courseId: 'course-1' },
      },
    },
    error: new Error('Enrollment failed'),
  };

  const defaultProps = {
    courseId: 'course-1',
    courseSlug: 'test-course',
    price: 99.99,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering and Display', () => {
    it('should render enroll button for free course', () => {
      render(
        <MockedProvider>
          <EnrollButton {...defaultProps} price={0} />
        </MockedProvider>
      );

      expect(screen.getByRole('button', { name: /Enroll for Free/i })).toBeInTheDocument();
    });

    it('should render enroll button with price for paid course', () => {
      render(
        <MockedProvider>
          <EnrollButton {...defaultProps} price={99.99} />
        </MockedProvider>
      );

      expect(screen.getByRole('button', { name: /Enroll for \$99.99/i })).toBeInTheDocument();
    });

    it('should render "Go to Course" button when already enrolled', () => {
      render(
        <MockedProvider>
          <EnrollButton {...defaultProps} isEnrolled={true} />
        </MockedProvider>
      );

      expect(screen.getByRole('button', { name: /Go to Course/i })).toBeInTheDocument();
      expect(screen.queryByText(/Enroll/i)).not.toBeInTheDocument();
    });

    it('should have correct styling for enrolled state', () => {
      render(
        <MockedProvider>
          <EnrollButton {...defaultProps} isEnrolled={true} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Go to Course/i });
      expect(button).toHaveClass('bg-green-600', 'hover:bg-green-700');
    });

    it('should have correct styling for unenrolled state', () => {
      render(
        <MockedProvider>
          <EnrollButton {...defaultProps} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
    });

    it('should have full width button', () => {
      render(
        <MockedProvider>
          <EnrollButton {...defaultProps} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      expect(button).toHaveClass('w-full');
    });

    it('should show CheckCircle icon when enrolled', () => {
      render(
        <MockedProvider>
          <EnrollButton {...defaultProps} isEnrolled={true} />
        </MockedProvider>
      );

      expect(document.querySelector('.lucide-check-circle')).toBeInTheDocument();
    });

    it('should format price with 2 decimal places', () => {
      render(
        <MockedProvider>
          <EnrollButton {...defaultProps} price={99} />
        </MockedProvider>
      );

      expect(screen.getByText(/\$99/)).toBeInTheDocument();
    });

    it('should handle fractional prices', () => {
      render(
        <MockedProvider>
          <EnrollButton {...defaultProps} price={49.99} />
        </MockedProvider>
      );

      expect(screen.getByText(/\$49\.99/)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should navigate to course when "Go to Course" clicked', () => {
      render(
        <MockedProvider>
          <EnrollButton {...defaultProps} isEnrolled={true} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Go to Course/i });
      fireEvent.click(button);

      expect(mockPush).toHaveBeenCalledWith('/learn/test-course');
    });
  });

  describe('Enrollment Flow (with GraphQL)', () => {
    it('should show loading state when enrolling', async () => {
      render(
        <MockedProvider mocks={[mockEnrollSuccess]}>
          <EnrollButton {...defaultProps} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Enrolling...')).toBeInTheDocument();
      });
    });

    it('should disable button while enrolling', async () => {
      render(
        <MockedProvider mocks={[mockEnrollSuccess]}>
          <EnrollButton {...defaultProps} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });

    it('should show loading spinner while enrolling', async () => {
      render(
        <MockedProvider mocks={[mockEnrollSuccess]}>
          <EnrollButton {...defaultProps} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
      });
    });

    it('should enroll successfully and show "Go to Course"', async () => {
      render(
        <MockedProvider mocks={[mockEnrollSuccess]}>
          <EnrollButton {...defaultProps} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Go to Course')).toBeInTheDocument();
      });
    });

    it('should call onEnrollSuccess callback after enrollment', async () => {
      const onEnrollSuccess = vi.fn();

      render(
        <MockedProvider mocks={[mockEnrollSuccess]}>
          <EnrollButton {...defaultProps} onEnrollSuccess={onEnrollSuccess} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(onEnrollSuccess).toHaveBeenCalled();
      });
    });

    it('should redirect to course after enrollment with delay', async () => {
      render(
        <MockedProvider mocks={[mockEnrollSuccess]}>
          <EnrollButton {...defaultProps} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Go to Course')).toBeInTheDocument();
      });

      // Fast-forward 1 second
      vi.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/learn/test-course');
      });
    });

    it('should show error alert on enrollment failure', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(
        <MockedProvider mocks={[mockEnrollError]}>
          <EnrollButton {...defaultProps} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Enrollment failed');
      });

      alertSpy.mockRestore();
    });

    it('should log error to console on failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(
        <MockedProvider mocks={[mockEnrollError]}>
          <EnrollButton {...defaultProps} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Enrollment error:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it('should not redirect if enrollment fails', async () => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(
        <MockedProvider mocks={[mockEnrollError]}>
          <EnrollButton {...defaultProps} />
        </MockedProvider>
      );

      const button = screen.getByRole('button', { name: /Enroll for/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });

      vi.advanceTimersByTime(2000);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
  const mockEnrollSuccess = {
    request: {
      query: ENROLL_COURSE,
      variables: {
        input: { courseId: 'course-1' },
      },
    },
    result: {
      data: {
        enrollCourse: {
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: 'course-1',
          status: 'ACTIVE',
          progress: 0,
          enrolledAt: '2025-10-21T00:00:00.000Z',
          completedAt: null,
          lastAccessedAt: '2025-10-21T00:00:00.000Z',
          course: {
            id: 'course-1',
            title: 'Test Course',
            slug: 'test-course',
            __typename: 'Course',
          },
          __typename: 'Enrollment',
        },
      },
    },
  };

  const mockEnrollError = {
    request: {
      query: ENROLL_COURSE,
      variables: {
        input: { courseId: 'course-1' },
      },
    },
    error: new Error('Enrollment failed'),
  };

  const defaultProps = {
    courseId: 'course-1',
    courseSlug: 'test-course',
    price: 99.99,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render enroll button for free course', () => {
    render(
      <MockedProvider>
        <EnrollButton {...defaultProps} price={0} />
      </MockedProvider>
    );

    expect(screen.getByRole('button', { name: /Enroll for Free/i })).toBeInTheDocument();
  });

  it('should render enroll button with price for paid course', () => {
    render(
      <MockedProvider>
        <EnrollButton {...defaultProps} price={99.99} />
      </MockedProvider>
    );

    expect(screen.getByRole('button', { name: /Enroll for \$99.99/i })).toBeInTheDocument();
  });

  it('should render "Go to Course" button when already enrolled', () => {
    render(
      <MockedProvider>
        <EnrollButton {...defaultProps} isEnrolled={true} />
      </MockedProvider>
    );

    expect(screen.getByRole('button', { name: /Go to Course/i })).toBeInTheDocument();
    expect(screen.queryByText(/Enroll/i)).not.toBeInTheDocument();
  });

  it('should navigate to course when "Go to Course" clicked', () => {
    render(
      <MockedProvider>
        <EnrollButton {...defaultProps} isEnrolled={true} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Go to Course/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/learn/test-course');
  });

  it('should show loading state when enrolling', async () => {
    render(
      <MockedProvider mocks={[mockEnrollSuccess]} addTypename={false}>
        <EnrollButton {...defaultProps} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Enrolling...')).toBeInTheDocument();
    });
  });

  it('should disable button while enrolling', async () => {
    render(
      <MockedProvider mocks={[mockEnrollSuccess]} addTypename={false}>
        <EnrollButton {...defaultProps} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it('should show loading spinner while enrolling', async () => {
    render(
      <MockedProvider mocks={[mockEnrollSuccess]} addTypename={false}>
        <EnrollButton {...defaultProps} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  it('should enroll successfully and show "Go to Course"', async () => {
    render(
      <MockedProvider mocks={[mockEnrollSuccess]} addTypename={false}>
        <EnrollButton {...defaultProps} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Go to Course')).toBeInTheDocument();
    });
  });

  it('should call onEnrollSuccess callback after enrollment', async () => {
    const onEnrollSuccess = vi.fn();

    render(
      <MockedProvider mocks={[mockEnrollSuccess]} addTypename={false}>
        <EnrollButton {...defaultProps} onEnrollSuccess={onEnrollSuccess} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onEnrollSuccess).toHaveBeenCalled();
    });
  });

  it('should redirect to course after enrollment with delay', async () => {
    render(
      <MockedProvider mocks={[mockEnrollSuccess]} addTypename={false}>
        <EnrollButton {...defaultProps} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Go to Course')).toBeInTheDocument();
    });

    // Fast-forward 1 second
    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/learn/test-course');
    });
  });

  it('should show error alert on enrollment failure', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MockedProvider mocks={[mockEnrollError]} addTypename={false}>
        <EnrollButton {...defaultProps} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Enrollment failed');
    });

    alertSpy.mockRestore();
  });

  it('should log error to console on failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MockedProvider mocks={[mockEnrollError]} addTypename={false}>
        <EnrollButton {...defaultProps} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Enrollment error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should not redirect if enrollment fails', async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MockedProvider mocks={[mockEnrollError]} addTypename={false}>
        <EnrollButton {...defaultProps} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    vi.advanceTimersByTime(2000);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should have correct styling for enrolled state', () => {
    render(
      <MockedProvider>
        <EnrollButton {...defaultProps} isEnrolled={true} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Go to Course/i });
    expect(button).toHaveClass('bg-green-600', 'hover:bg-green-700');
  });

  it('should have correct styling for unenrolled state', () => {
    render(
      <MockedProvider>
        <EnrollButton {...defaultProps} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
  });

  it('should have full width button', () => {
    render(
      <MockedProvider>
        <EnrollButton {...defaultProps} />
      </MockedProvider>
    );

    const button = screen.getByRole('button', { name: /Enroll for/i });
    expect(button).toHaveClass('w-full');
  });

  it('should show CheckCircle icon when enrolled', () => {
    render(
      <MockedProvider>
        <EnrollButton {...defaultProps} isEnrolled={true} />
      </MockedProvider>
    );

    expect(document.querySelector('.lucide-check-circle')).toBeInTheDocument();
  });

  it('should format price with 2 decimal places', () => {
    render(
      <MockedProvider>
        <EnrollButton {...defaultProps} price={99} />
      </MockedProvider>
    );

    expect(screen.getByText(/\$99/)).toBeInTheDocument();
  });

  it('should handle fractional prices', () => {
    render(
      <MockedProvider>
        <EnrollButton {...defaultProps} price={49.99} />
      </MockedProvider>
    );

    expect(screen.getByText(/\$49\.99/)).toBeInTheDocument();
  });
});
