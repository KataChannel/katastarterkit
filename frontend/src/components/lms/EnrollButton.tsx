'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ENROLL_COURSE } from '@/graphql/lms/enrollments.graphql';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [enrollCourse, { loading }] = useMutation(ENROLL_COURSE);
  const [enrolled, setEnrolled] = useState(isEnrolled);

  const handleEnroll = async () => {
    try {
      await enrollCourse({
        variables: {
          input: { courseId },
        },
      });
      
      setEnrolled(true);
      
      if (onEnrollSuccess) {
        onEnrollSuccess();
      }

      // Redirect to learning page after a short delay
      setTimeout(() => {
        router.push(`/lms/learn/${courseSlug}`);
      }, 1000);
    } catch (error: any) {
      console.error('Enrollment error:', error);
      alert(error.message || 'Không thể ghi danh khóa học');
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
      ) : (
        <>
          {price > 0 ? `Ghi danh - $${price}` : 'Ghi danh miễn phí'}
        </>
      )}
    </button>
  );
}
