import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import QuizTaker from '../QuizTaker';
import { GET_QUIZ, SUBMIT_QUIZ } from '@/graphql/lms/quizzes.graphql';

describe('QuizTaker', () => {
  const mockQuiz = {
    id: '1',
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your knowledge of JavaScript basics',
    passingScore: 70,
    timeLimit: 30,
    questions: [
      {
        id: 'q1',
        type: 'SINGLE_CHOICE',
        question: 'What is the output of 2 + 2?',
        points: 10,
        order: 1,
        explanation: '2 + 2 equals 4',
        answers: [
          { id: 'a1', text: '3', order: 1, isCorrect: false },
          { id: 'a2', text: '4', order: 2, isCorrect: true },
          { id: 'a3', text: '5', order: 3, isCorrect: false },
        ],
      },
      {
        id: 'q2',
        type: 'MULTIPLE_CHOICE',
        question: 'Which are JavaScript data types?',
        points: 15,
        order: 2,
        answers: [
          { id: 'a4', text: 'String', order: 1, isCorrect: true },
          { id: 'a5', text: 'Number', order: 2, isCorrect: true },
          { id: 'a6', text: 'Character', order: 3, isCorrect: false },
        ],
      },
    ],
  };

  const mockQuizQuerySuccess = {
    request: {
      query: GET_QUIZ,
      variables: { id: '1' },
    },
    result: {
      data: {
        quiz: mockQuiz,
      },
    },
  };

  const mockQuizQueryError = {
    request: {
      query: GET_QUIZ,
      variables: { id: '1' },
    },
    error: new Error('Failed to load quiz'),
  };

  const mockSubmitQuizSuccess = {
    request: {
      query: SUBMIT_QUIZ,
      variables: {
        input: {
          quizId: '1',
          enrollmentId: 'enrollment-1',
          answers: expect.any(Array),
          timeSpent: expect.any(Number),
        },
      },
    },
    result: {
      data: {
        submitQuiz: {
          id: 'attempt-1',
          score: 85,
          passed: true,
        },
      },
    },
  };

  const defaultProps = {
    quizId: '1',
    enrollmentId: 'enrollment-1',
    onComplete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show loading spinner while fetching quiz', () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('should render quiz title and description', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('JavaScript Fundamentals Quiz')).toBeInTheDocument();
      expect(screen.getByText('Test your knowledge of JavaScript basics')).toBeInTheDocument();
    });
  });

  it('should display error message when quiz fails to load', async () => {
    render(
      <MockedProvider mocks={[mockQuizQueryError]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load quiz')).toBeInTheDocument();
    });
  });

  it('should render first question on load', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('What is the output of 2 + 2?')).toBeInTheDocument();
    });
  });

  it('should display all answer options for current question', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('should select answer when clicked', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    const answerButton = screen.getByText('4').closest('button');
    fireEvent.click(answerButton!);

    expect(answerButton).toHaveClass('border-blue-600', 'bg-blue-50');
  });

  it('should allow multiple answers for MULTIPLE_CHOICE questions', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Next Question')).toBeInTheDocument();
    });

    // Go to second question (multiple choice)
    fireEvent.click(screen.getByText('Next Question'));

    await waitFor(() => {
      expect(screen.getByText('Which are JavaScript data types?')).toBeInTheDocument();
    });

    // Select multiple answers
    const stringButton = screen.getByText('String').closest('button');
    const numberButton = screen.getByText('Number').closest('button');

    fireEvent.click(stringButton!);
    fireEvent.click(numberButton!);

    expect(stringButton).toHaveClass('border-blue-600', 'bg-blue-50');
    expect(numberButton).toHaveClass('border-blue-600', 'bg-blue-50');
  });

  it('should show "Select all correct answers" hint for multiple choice', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Next Question'));
    });

    await waitFor(() => {
      expect(screen.getByText('Select all correct answers')).toBeInTheDocument();
    });
  });

  it('should navigate to next question', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Next Question'));

    await waitFor(() => {
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
    });
  });

  it('should navigate to previous question', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Next Question'));
    });

    await waitFor(() => {
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Previous'));

    await waitFor(() => {
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    });
  });

  it('should disable Previous button on first question', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      const prevButton = screen.getByText('Previous');
      expect(prevButton).toBeDisabled();
    });
  });

  it('should show Submit button on last question', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Next Question'));
    });

    await waitFor(() => {
      expect(screen.getByText('Submit Quiz')).toBeInTheDocument();
    });
  });

  it('should disable Submit button if not all questions answered', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Next Question'));
    });

    await waitFor(() => {
      const submitButton = screen.getByText('Submit Quiz');
      expect(submitButton).toBeDisabled();
    });
  });

  it('should show warning when not all questions answered', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Next Question'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Please answer all questions before submitting/)).toBeInTheDocument();
      expect(screen.getByText(/Unanswered: 2/)).toBeInTheDocument();
    });
  });

  it('should display timer when time limit is set', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      // 30 minutes = 30:00
      expect(screen.getByText('30:00')).toBeInTheDocument();
    });
  });

  it('should countdown timer', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('30:00')).toBeInTheDocument();
    });

    // Advance 1 second
    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('29:59')).toBeInTheDocument();
    });
  });

  it('should show red warning when time is below 1 minute', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('30:00')).toBeInTheDocument();
    });

    // Advance to 30 seconds remaining
    vi.advanceTimersByTime(29 * 60 * 1000 + 30 * 1000);

    await waitFor(() => {
      const timer = screen.getByText('0:30').closest('div');
      expect(timer).toHaveClass('bg-red-100', 'text-red-700');
    });
  });

  it('should render question navigation grid', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('should highlight current question in navigation', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      const currentButton = screen.getByText('1').closest('button');
      expect(currentButton).toHaveClass('bg-blue-600', 'text-white');
    });
  });

  it('should show answered questions in green in navigation', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      const answerButton = screen.getByText('4').closest('button');
      fireEvent.click(answerButton!);
    });

    await waitFor(() => {
      const navButton = screen.getByText('1').closest('button');
      expect(navButton).toHaveClass('bg-blue-600'); // Current question, still blue
    });

    // Go to next question
    fireEvent.click(screen.getByText('Next Question'));

    await waitFor(() => {
      const navButton = screen.getByText('1').closest('button');
      expect(navButton).toHaveClass('bg-green-100', 'text-green-700');
    });
  });

  it('should jump to question when navigation button clicked', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      const question2Button = screen.getByText('2').closest('button');
      fireEvent.click(question2Button!);
    });

    await waitFor(() => {
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
    });
  });

  it('should display progress bar', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('0/2')).toBeInTheDocument();
    });

    // Answer first question
    const answerButton = screen.getByText('4').closest('button');
    fireEvent.click(answerButton!);

    await waitFor(() => {
      expect(screen.getByText('1/2')).toBeInTheDocument();
    });
  });

  it('should display question points', async () => {
    render(
      <MockedProvider mocks={[mockQuizQuerySuccess]} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('10 points')).toBeInTheDocument();
    });
  });

  it('should submit quiz when all questions answered', async () => {
    const mocks = [mockQuizQuerySuccess, mockSubmitQuizSuccess];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <QuizTaker {...defaultProps} />
      </MockedProvider>
    );

    // Answer question 1
    await waitFor(() => {
      const answerButton = screen.getByText('4').closest('button');
      fireEvent.click(answerButton!);
    });

    // Go to question 2
    fireEvent.click(screen.getByText('Next Question'));

    // Answer question 2
    await waitFor(() => {
      const stringButton = screen.getByText('String').closest('button');
      fireEvent.click(stringButton!);
    });

    // Submit
    await waitFor(() => {
      const submitButton = screen.getByText('Submit Quiz');
      expect(submitButton).not.toBeDisabled();
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(defaultProps.onComplete).toHaveBeenCalledWith('attempt-1');
    });
  });
});
