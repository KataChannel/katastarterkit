import { gql } from '@apollo/client';

// ==================== COURSES ====================
export const GET_ACADEMY_COURSES = gql`
  query GetAcademyCourses($filter: AcademyCourseFilterInput) {
    academyCourses(filter: $filter) {
      id
      title
      slug
      shortDescription
      description
      duration
      price
      discountPrice
      featuredImage
      images
      isActive
      isFeatured
      displayOrder
      category {
        id
        name
        slug
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACADEMY_COURSE = gql`
  query GetAcademyCourse($id: ID!) {
    academyCourse(id: $id) {
      id
      title
      slug
      shortDescription
      description
      duration
      price
      discountPrice
      featuredImage
      images
      curriculum
      requirements
      benefits
      isActive
      isFeatured
      displayOrder
      category {
        id
        name
        slug
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACADEMY_COURSE_BY_SLUG = gql`
  query GetAcademyCourseBySlug($slug: String!) {
    academyCourseBySlug(slug: $slug) {
      id
      title
      slug
      shortDescription
      description
      duration
      price
      discountPrice
      featuredImage
      images
      curriculum
      requirements
      benefits
      isActive
      isFeatured
      displayOrder
      category {
        id
        name
        slug
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_FEATURED_COURSES = gql`
  query GetFeaturedCourses($limit: Int) {
    featuredAcademyCourses(limit: $limit) {
      id
      title
      slug
      shortDescription
      featuredImage
      price
      discountPrice
      duration
      category {
        id
        name
      }
    }
  }
`;

// ==================== COURSE CATEGORIES ====================
export const GET_ACADEMY_COURSE_CATEGORIES = gql`
  query GetAcademyCourseCategories($filter: AcademyCourseCategoryFilterInput) {
    getAcademyCourseCategories(filter: $filter) {
      id
      name
      slug
      description
      thumbnail
      isActive
      sortOrder
      createdAt
      updatedAt
    }
  }
`;

// ==================== INSTRUCTORS ====================
export const GET_ACADEMY_INSTRUCTORS = gql`
  query GetAcademyInstructors($filter: AcademyInstructorFilterInput) {
    getAcademyInstructors(filter: $filter) {
      id
      name
      slug
      title
      bio
      avatar
      email
      phone
      specialization
      experience
      education
      certifications
      linkedIn
      facebook
      website
      isActive
      isFeatured
      displayOrder
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACADEMY_INSTRUCTOR = gql`
  query GetAcademyInstructor($id: ID!) {
    getAcademyInstructor(id: $id) {
      id
      name
      slug
      title
      bio
      avatar
      email
      phone
      specialization
      experience
      education
      certifications
      linkedIn
      facebook
      website
      isActive
      isFeatured
      displayOrder
      createdAt
      updatedAt
    }
  }
`;

// ==================== TESTIMONIALS ====================
export const GET_ACADEMY_TESTIMONIALS = gql`
  query GetAcademyTestimonials($filter: AcademyTestimonialFilterInput) {
    getAcademyTestimonials(filter: $filter) {
      id
      studentName
      studentAvatar
      studentTitle
      content
      rating
      videoUrl
      courseName
      completedDate
      isActive
      isFeatured
      displayOrder
      isVerified
      verifiedAt
      createdAt
      updatedAt
    }
  }
`;

// ==================== FAQs ====================
export const GET_ACADEMY_FAQS = gql`
  query GetAcademyFAQs($filter: AcademyFAQFilterInput) {
    getAcademyFAQs(filter: $filter) {
      id
      question
      answer
      category
      isActive
      displayOrder
      createdAt
      updatedAt
    }
  }
`;

// ==================== BRANCHES ====================
export const GET_BRANCHES = gql`
  query GetBranches($filter: BranchFilterInput) {
    branches(filter: $filter) {
      id
      name
      slug
      address
      phone
      email
      hotline
      workingHours
      description
      shortDescription
      featuredImage
      latitude
      longitude
      mapEmbedUrl
      facebookUrl
      zaloUrl
      isActive
      isFeatured
      displayOrder
      createdAt
      updatedAt
    }
  }
`;

// ==================== STUDENT WORKS ====================
export const GET_ACADEMY_STUDENT_WORKS = gql`
  query GetAcademyStudentWorks($filter: AcademyStudentWorkFilterInput) {
    academyStudentWorks(filter: $filter) {
      id
      title
      description
      thumbnail
      videoUrl
      images
      category
      studentName
      isActive
      isFeatured
      sortOrder
      createdAt
      updatedAt
    }
  }
`;

// ==================== MEDIA COVERAGE ====================
export const GET_ACADEMY_MEDIA_COVERAGES = gql`
  query GetAcademyMediaCoverages($filter: AcademyMediaCoverageFilterInput) {
    academyMediaCoverages(filter: $filter) {
      id
      title
      source
      sourceLogo
      thumbnail
      videoUrl
      articleUrl
      publishedAt
      isActive
      isFeatured
      sortOrder
      createdAt
      updatedAt
    }
  }
`;
