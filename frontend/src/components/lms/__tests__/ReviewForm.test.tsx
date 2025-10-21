import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import ReviewForm from '../ReviewForm';
import { CREATE_REVIEW, UPDATE_REVIEW } from '@/graphql/lms/reviews.graphql';

describe('ReviewForm', () => {
  const mockCreateReviewSuccess = {
    request: {
      query: CREATE_REVIEW,
      variables: {
        input: {
          courseId: 'course-1',
          rating: 5,
          comment: 'Great course!',
        },
      },
    },
    result: {
      data: {
        createReview: {
          id: 'review-1',
          rating: 5,
          comment: 'Great course!',
        },
      },
    },
  };

  const mockUpdateReviewSuccess = {
    request: {
      query: UPDATE_REVIEW,
      variables: {
        input: {
          reviewId: 'review-1',
          rating: 4,
          comment: 'Updated review',
        },
      },
    },
    result: {
      data: {
        updateReview: {
          id: 'review-1',
          rating: 4,
          comment: 'Updated review',
        },
      },
    },
  };

  const defaultProps = {
    courseId: 'course-1',
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render rating stars', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByText('Your Rating *')).toBeInTheDocument();
    
    // Should have 5 star buttons
    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );
    expect(stars).toHaveLength(5);
  });

  it('should render comment textarea', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/Your Review/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Share your experience/i)).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByRole('button', { name: /Submit Review/i })).toBeInTheDocument();
  });

  it('should render cancel button when onCancel provided', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('should not render cancel button when onCancel not provided', () => {
    const { onCancel, ...propsWithoutCancel } = defaultProps;
    
    render(
      <MockedProvider>
        <ReviewForm {...propsWithoutCancel} />
      </MockedProvider>
    );

    expect(screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument();
  });

  it('should select rating when star clicked', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );

    // Click 4th star
    fireEvent.click(stars[3]);

    expect(screen.getByText('4 stars')).toBeInTheDocument();
  });

  it('should show single star text for rating 1', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );

    fireEvent.click(stars[0]);

    expect(screen.getByText('1 star')).toBeInTheDocument();
  });

  it('should highlight stars on hover', () => {
    const { container } = render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );

    // Hover over 3rd star
    fireEvent.mouseEnter(stars[2]);

    // First 3 stars should be highlighted
    const star1 = stars[0].querySelector('.lucide-star');
    const star2 = stars[1].querySelector('.lucide-star');
    const star3 = stars[2].querySelector('.lucide-star');
    const star4 = stars[3].querySelector('.lucide-star');

    expect(star1).toHaveClass('fill-yellow-400', 'text-yellow-400');
    expect(star2).toHaveClass('fill-yellow-400', 'text-yellow-400');
    expect(star3).toHaveClass('fill-yellow-400', 'text-yellow-400');
    expect(star4).toHaveClass('text-gray-300');
  });

  it('should reset hover state on mouse leave', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );

    // Select 2 stars
    fireEvent.click(stars[1]);

    // Hover over 4th star
    fireEvent.mouseEnter(stars[3]);
    
    // Leave hover
    fireEvent.mouseLeave(stars[3]);

    // Should show selected rating (2 stars), not hovered (4 stars)
    const star1 = stars[0].querySelector('.lucide-star');
    const star2 = stars[1].querySelector('.lucide-star');
    const star3 = stars[2].querySelector('.lucide-star');

    expect(star1).toHaveClass('fill-yellow-400');
    expect(star2).toHaveClass('fill-yellow-400');
    expect(star3).toHaveClass('text-gray-300');
  });

  it('should update comment text', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const textarea = screen.getByPlaceholderText(/Share your experience/i);
    
    fireEvent.change(textarea, { target: { value: 'Great course!' } });

    expect(textarea).toHaveValue('Great course!');
  });

  it('should show character count', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByText('0 / 1000 characters')).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Share your experience/i);
    fireEvent.change(textarea, { target: { value: 'Test' } });

    expect(screen.getByText('4 / 1000 characters')).toBeInTheDocument();
  });

  it('should enforce 1000 character limit', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const textarea = screen.getByPlaceholderText(/Share your experience/i) as HTMLTextAreaElement;
    
    expect(textarea.maxLength).toBe(1000);
  });

  it('should show error when submitting without rating', async () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const submitButton = screen.getByRole('button', { name: /Submit Review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please select a rating')).toBeInTheDocument();
    });
  });

  it('should not show error after rating selected', async () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    // Try to submit without rating
    const submitButton = screen.getByRole('button', { name: /Submit Review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please select a rating')).toBeInTheDocument();
    });

    // Select rating
    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );
    fireEvent.click(stars[4]);

    // Error should disappear
    await waitFor(() => {
      expect(screen.queryByText('Please select a rating')).not.toBeInTheDocument();
    });
  });

  it('should create new review successfully', async () => {
    const mocks = [mockCreateReviewSuccess];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    // Select 5 stars
    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );
    fireEvent.click(stars[4]);

    // Enter comment
    const textarea = screen.getByPlaceholderText(/Share your experience/i);
    fireEvent.change(textarea, { target: { value: 'Great course!' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /Submit Review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should update existing review successfully', async () => {
    const existingReview = {
      id: 'review-1',
      rating: 3,
      comment: 'Good course',
    };

    const mocks = [mockUpdateReviewSuccess];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ReviewForm {...defaultProps} existingReview={existingReview} />
      </MockedProvider>
    );

    // Should pre-fill with existing data
    expect(screen.getByText('3 stars')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Good course')).toBeInTheDocument();

    // Update rating
    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );
    fireEvent.click(stars[3]);

    // Update comment
    const textarea = screen.getByPlaceholderText(/Share your experience/i);
    fireEvent.change(textarea, { target: { value: 'Updated review' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /Update Review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should show loading state while submitting', async () => {
    const mocks = [mockCreateReviewSuccess];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );
    fireEvent.click(stars[4]);

    const submitButton = screen.getByRole('button', { name: /Submit Review/i });
    fireEvent.click(submitButton);

    // Should show loading text
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    
    // Button should be disabled
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should disable all buttons while submitting', async () => {
    const mocks = [mockCreateReviewSuccess];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );
    fireEvent.click(stars[4]);

    const submitButton = screen.getByRole('button', { name: /Submit Review/i });
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should call onCancel when cancel button clicked', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should show error message on submission failure', async () => {
    const mockError = {
      request: {
        query: CREATE_REVIEW,
        variables: {
          input: expect.any(Object),
        },
      },
      error: new Error('Network error'),
    };

    render(
      <MockedProvider mocks={[mockError]} addTypename={false}>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );
    fireEvent.click(stars[4]);

    const submitButton = screen.getByRole('button', { name: /Submit Review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit review/i)).toBeInTheDocument();
    });
  });

  it('should allow submission without comment', async () => {
    const mockWithoutComment = {
      request: {
        query: CREATE_REVIEW,
        variables: {
          input: {
            courseId: 'course-1',
            rating: 5,
            comment: undefined,
          },
        },
      },
      result: {
        data: {
          createReview: {
            id: 'review-1',
            rating: 5,
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[mockWithoutComment]} addTypename={false}>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );
    fireEvent.click(stars[4]);

    const submitButton = screen.getByRole('button', { name: /Submit Review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should trim whitespace from comment', async () => {
    const mocks = [mockCreateReviewSuccess];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );
    fireEvent.click(stars[4]);

    const textarea = screen.getByPlaceholderText(/Share your experience/i);
    fireEvent.change(textarea, { target: { value: '  Great course!  ' } });

    const submitButton = screen.getByRole('button', { name: /Submit Review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should have accessible form elements', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    // Label should be associated with textarea
    const label = screen.getByText(/Your Review \(Optional\)/i);
    const textarea = screen.getByLabelText(/Your Review/i);
    
    expect(label).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
  });

  it('should have focus styles on star buttons', () => {
    render(
      <MockedProvider>
        <ReviewForm {...defaultProps} />
      </MockedProvider>
    );

    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('.lucide-star')
    );

    stars.forEach(star => {
      expect(star).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
    });
  });
});
