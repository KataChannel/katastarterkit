'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COURSES, GET_COURSE_CATEGORIES } from '@/graphql/lms/courses.graphql';
import CourseList from '@/components/lms/CourseList';
import { Search, Filter, X } from 'lucide-react';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categoriesData } = useQuery(GET_COURSE_CATEGORIES);

  const { data, loading, error } = useQuery(GET_COURSES, {
    variables: {
      filters: {
        search: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        level: selectedLevel || undefined,
        status: 'PUBLISHED',
      },
      skip: 0,
      take: 100,
    },
  });

  const courses = data?.courses || [];
  const categories = categoriesData?.courseCategories || [];

  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedLevel(null);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedLevel;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Learn new skills, advance your career, and achieve your goals with expert-led courses
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm mb-4"
            >
              <span className="font-medium flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </span>
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              )}

              {/* Category Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!selectedCategory}
                      onChange={() => setSelectedCategory(null)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map((category: any) => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Level</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      checked={!selectedLevel}
                      onChange={() => setSelectedLevel(null)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">All Levels</span>
                  </label>
                  {levels.map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="level"
                        checked={selectedLevel === level}
                        onChange={() => setSelectedLevel(level)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {level.toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Course Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : `${courses.length} courses`}
              </h2>
              {hasActiveFilters && (
                <p className="text-gray-600 mt-1">
                  Showing filtered results
                </p>
              )}
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">Failed to load courses. Please try again.</p>
              </div>
            )}

            {/* Course List */}
            <CourseList 
              courses={courses} 
              loading={loading}
              emptyMessage={hasActiveFilters ? 'No courses match your filters' : 'No courses available'}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
