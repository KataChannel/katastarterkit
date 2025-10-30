// ✅ MIGRATED TO LMS ENROLLMENT MUTATION - 2025-10-30
// Original backup: EnrollButton.tsx.backup

'use client';

import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ENROLL_COURSE } from '@/graphql/lms/enrollments.graphql';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  isEnrolled?: boolean;
  price: number;
  onEnrollSuccess?: () => void;
}

export default function EnrollButton({ 
  courseId, 
  courseSlug,
  isEnrolled = false,
  price,
  onEnrollSuccess 
}: EnrollButtonProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [enrolled, setEnrolled] = useState(isEnrolled);
  
  // Sync local state with prop when it changes
  useEffect(() => {
    setEnrolled(isEnrolled);
  }, [isEnrolled]);
  
  const [enrollCourse, { loading }] = useMutation(ENROLL_COURSE, {
    onCompleted: () => {
      setEnrolled(true);
      
      if (onEnrollSuccess) {
        onEnrollSuccess();
      }

      // Redirect to learning page after a short delay
      setTimeout(() => {
        router.push(`/lms/learn/${courseSlug}`);
      }, 1000);
    },
    onError: (error) => {
      console.error('Enrollment error:', error);
      
      // Check if already enrolled - redirect to learning page instead of showing error
      if (error.message.includes('Already enrolled')) {
        setEnrolled(true);
        router.push(`/lms/learn/${courseSlug}`);
      } else {
        alert(error.message || 'Không thể ghi danh khóa học');
      }
    },
  });

  const handleEnroll = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      // Redirect to login page with return URL
      router.push(`/login?returnUrl=/lms/courses/${courseSlug}`);
      return;
    }

    try {
      await enrollCourse({
        variables: { 
          input: { courseId }
        },
      });
    } catch (error: any) {
      // Error handled in onError callback
    }
  };

  if (enrolled) {
    return (
      <button
        onClick={() => router.push(`/lms/learn/${courseSlug}`)}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <CheckCircle className="w-5 h-5" />
        Vào học
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Đang ghi danh...
        </>
      ) : !isAuthenticated ? (
        <>
          Đăng nhập để ghi danh
        </>
      ) : (
        <>
          {price > 0 ? `Ghi danh - $${price}` : 'Ghi danh miễn phí'}
        </>
      )}
    </button>
  );
}
