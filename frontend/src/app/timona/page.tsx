'use client';

import {
  HeroSlider,
  StatsSection,
  CoursesSection,
  CommitmentsSection,
  InstructorsSection,
  TestimonialsSection,
  FAQSection,
  RegistrationSection,
  BranchesSection,
} from '@/features/timona';

export default function TimonaHomePage() {
  return (
    <>
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Stats */}
      <StatsSection />
      
      {/* Courses */}
      <CoursesSection />
      
      {/* Commitments */}
      <CommitmentsSection />
      
      {/* Instructors */}
      <InstructorsSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* FAQ */}
      <FAQSection />
      
      {/* Registration Form */}
      <RegistrationSection />
      
      {/* Branches */}
      <BranchesSection />
      
      {/* Floating Contact Buttons */}
      <div className="fixed right-4 bottom-24 z-50 flex flex-col gap-3">
        <a
          href="tel:19002109"
          className="w-14 h-14 bg-[#00256e] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse"
          aria-label="Call us"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </a>
        
        <a
          href="https://zalo.me/timonaacademy"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Chat on Zalo"
        >
          <svg className="w-8 h-8" viewBox="0 0 48 48" fill="currentColor">
            <path d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z M29.5,33H18c-0.828,0-1.5-0.672-1.5-1.5 S17.172,30,18,30h11.5c0.828,0,1.5,0.672,1.5,1.5S30.328,33,29.5,33z M32,26H16c-1.105,0-2-0.895-2-2s0.895-2,2-2h16 c1.105,0,2,0.895,2,2S33.105,26,32,26z M33,20H15c-1.105,0-2-0.895-2-2s0.895-2,2-2h18c1.105,0,2,0.895,2,2S34.105,20,33,20z" />
          </svg>
        </a>
        
        <a
          href="https://m.me/timonaacademy"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Chat on Messenger"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z" />
          </svg>
        </a>
      </div>
    </>
  );
}
