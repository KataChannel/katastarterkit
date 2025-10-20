import { gql } from '@apollo/client';

// Course Fragments
export const COURSE_BASIC_FRAGMENT = gql`
  fragment CourseBasic on Course {
    id
    title
    slug
    description
    thumbnail
    price
    level
    status
    duration
    rating
    avgRating
    enrollmentCount
    reviewCount
    createdAt
    publishedAt
  }
`;

export const COURSE_DETAIL_FRAGMENT = gql`
  fragment CourseDetail on Course {
    ...CourseBasic
    trailer
    metaTitle
    metaDescription
    tags
    instructorId
  }
  ${COURSE_BASIC_FRAGMENT}
`;

// Queries
export const GET_COURSES = gql`
  query GetCourses($filters: CourseFiltersInput) {
    courses(filters: $filters) {
      data {
        ...CourseBasic
        category {
          id
          name
          slug
        }
        instructor {
          id
          username
          firstName
          lastName
          avatar
        }
      }
      total
      page
      limit
      totalPages
    }
  }
  ${COURSE_BASIC_FRAGMENT}
`;

export const GET_COURSE_BY_SLUG = gql`
  query GetCourseBySlug($slug: String!) {
    courseBySlug(slug: $slug) {
      ...CourseDetail
      category {
        id
        name
        slug
        icon
      }
      instructor {
        id
        username
        firstName
        lastName
        avatar
      }
      modules {
        id
        title
        description
        order
        lessons {
          id
          title
          type
          duration
          order
          isFree
        }
      }
    }
  }
  ${COURSE_DETAIL_FRAGMENT}
`;

export const GET_MY_COURSES = gql`
  query GetMyCourses {
    myCourses {
      ...CourseBasic
      category {
        id
        name
        slug
      }
      _count {
        enrollments
        modules
        reviews
      }
    }
  }
  ${COURSE_BASIC_FRAGMENT}
`;

export const GET_ENROLLMENT = gql`
  query GetEnrollment($courseId: ID!) {
    enrollment(courseId: $courseId) {
      id
      userId
      courseId
      status
      progress
      enrolledAt
      completedAt
      lessonProgress {
        id
        lessonId
        completed
        completedAt
      }
    }
  }
`;

export const GET_COURSE_CATEGORIES = gql`
  query GetCourseCategories {
    courseCategories {
      id
      name
      slug
      description
      icon
      parentId
      _count {
        courses
      }
    }
  }
`;

export const GET_COURSE_CATEGORY_TREE = gql`
  query GetCourseCategoryTree {
    courseCategoryTree {
      id
      name
      slug
      icon
      children {
        id
        name
        slug
        icon
        _count {
          courses
        }
      }
      _count {
        courses
      }
    }
  }
`;

// Mutations
export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(createCourseInput: $input) {
      ...CourseDetail
    }
  }
  ${COURSE_DETAIL_FRAGMENT}
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($input: UpdateCourseInput!) {
    updateCourse(updateCourseInput: $input) {
      ...CourseDetail
    }
  }
  ${COURSE_DETAIL_FRAGMENT}
`;

export const PUBLISH_COURSE = gql`
  mutation PublishCourse($id: ID!) {
    publishCourse(id: $id) {
      id
      status
      publishedAt
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

export const MARK_LESSON_COMPLETE = gql`
  mutation MarkLessonComplete($enrollmentId: ID!, $lessonId: ID!) {
    markLessonComplete(enrollmentId: $enrollmentId, lessonId: $lessonId) {
      id
      lessonId
      completed
      completedAt
    }
  }
`;
