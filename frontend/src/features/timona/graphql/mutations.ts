import { gql } from '@apollo/client';

// ==================== COURSE REGISTRATION ====================
export const CREATE_ACADEMY_REGISTRATION = gql`
  mutation CreateAcademyRegistration($input: CreateAcademyRegistrationInput!) {
    createAcademyRegistration(input: $input) {
      id
      studentName
      email
      phone
      course {
        id
        name
      }
      branch {
        id
        name
      }
      notes
      status
      createdAt
    }
  }
`;

export const UPDATE_ACADEMY_REGISTRATION_STATUS = gql`
  mutation UpdateAcademyRegistrationStatus($id: ID!, $status: AcademyRegistrationStatus!, $statusNote: String) {
    updateAcademyRegistrationStatus(id: $id, status: $status, statusNote: $statusNote) {
      id
      status
      statusNote
      updatedAt
    }
  }
`;

// ==================== ADMIN MUTATIONS ====================
export const CREATE_ACADEMY_COURSE = gql`
  mutation CreateAcademyCourse($input: CreateAcademyCourseInput!) {
    createAcademyCourse(input: $input) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_ACADEMY_COURSE = gql`
  mutation UpdateAcademyCourse($id: ID!, $input: UpdateAcademyCourseInput!) {
    updateAcademyCourse(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`;

export const DELETE_ACADEMY_COURSE = gql`
  mutation DeleteAcademyCourse($id: ID!) {
    deleteAcademyCourse(id: $id)
  }
`;

export const CREATE_ACADEMY_INSTRUCTOR = gql`
  mutation CreateAcademyInstructor($input: CreateAcademyInstructorInput!) {
    createAcademyInstructor(input: $input) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_ACADEMY_INSTRUCTOR = gql`
  mutation UpdateAcademyInstructor($id: ID!, $input: UpdateAcademyInstructorInput!) {
    updateAcademyInstructor(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`;

export const DELETE_ACADEMY_INSTRUCTOR = gql`
  mutation DeleteAcademyInstructor($id: ID!) {
    deleteAcademyInstructor(id: $id)
  }
`;

export const CREATE_ACADEMY_TESTIMONIAL = gql`
  mutation CreateAcademyTestimonial($input: CreateAcademyTestimonialInput!) {
    createAcademyTestimonial(input: $input) {
      id
      studentName
    }
  }
`;

export const UPDATE_ACADEMY_TESTIMONIAL = gql`
  mutation UpdateAcademyTestimonial($id: ID!, $input: UpdateAcademyTestimonialInput!) {
    updateAcademyTestimonial(id: $id, input: $input) {
      id
      studentName
    }
  }
`;

export const DELETE_ACADEMY_TESTIMONIAL = gql`
  mutation DeleteAcademyTestimonial($id: ID!) {
    deleteAcademyTestimonial(id: $id)
  }
`;

export const CREATE_ACADEMY_FAQ = gql`
  mutation CreateAcademyFAQ($input: CreateAcademyFAQInput!) {
    createAcademyFAQ(input: $input) {
      id
      question
    }
  }
`;

export const UPDATE_ACADEMY_FAQ = gql`
  mutation UpdateAcademyFAQ($id: ID!, $input: UpdateAcademyFAQInput!) {
    updateAcademyFAQ(id: $id, input: $input) {
      id
      question
    }
  }
`;

export const DELETE_ACADEMY_FAQ = gql`
  mutation DeleteAcademyFAQ($id: ID!) {
    deleteAcademyFAQ(id: $id)
  }
`;

export const CREATE_BRANCH = gql`
  mutation CreateBranch($input: CreateBranchInput!) {
    createBranch(input: $input) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_BRANCH = gql`
  mutation UpdateBranch($id: ID!, $input: UpdateBranchInput!) {
    updateBranch(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`;

export const DELETE_BRANCH = gql`
  mutation DeleteBranch($id: ID!) {
    deleteBranch(id: $id)
  }
`;
