import { gql } from '@apollo/client';

// Auth Fragments
export const AUTH_RESPONSE_FRAGMENT = gql`
  fragment AuthResponseFragment on AuthResponse {
    accessToken
    refreshToken
    user {
      id
      email
      username
      firstName
      lastName
      avatar
      role
      isActive
      isVerified
      createdAt
    }
  }
`;

export const OTP_RESPONSE_FRAGMENT = gql`
  fragment OtpResponseFragment on OtpResponse {
    success
    message
  }
`;

// Auth Mutations
export const LOGIN_USER = gql`
  ${AUTH_RESPONSE_FRAGMENT}
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      ...AuthResponseFragment
    }
  }
`;

export const LOGIN_WITH_GOOGLE = gql`
  ${AUTH_RESPONSE_FRAGMENT}
  mutation LoginWithGoogle($input: SocialLoginInput!) {
    loginWithGoogle(input: $input) {
      ...AuthResponseFragment
    }
  }
`;

export const LOGIN_WITH_FACEBOOK = gql`
  ${AUTH_RESPONSE_FRAGMENT}
  mutation LoginWithFacebook($input: SocialLoginInput!) {
    loginWithFacebook(input: $input) {
      ...AuthResponseFragment
    }
  }
`;

export const LOGIN_WITH_PHONE = gql`
  ${AUTH_RESPONSE_FRAGMENT}
  mutation LoginWithPhone($input: PhoneLoginInput!) {
    loginWithPhone(input: $input) {
      ...AuthResponseFragment
    }
  }
`;

export const REQUEST_PHONE_VERIFICATION = gql`
  ${OTP_RESPONSE_FRAGMENT}
  mutation RequestPhoneVerification($input: RequestPhoneVerificationInput!) {
    requestPhoneVerification(input: $input) {
      ...OtpResponseFragment
    }
  }
`;

export const REGISTER_USER = gql`
  ${AUTH_RESPONSE_FRAGMENT}
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      ...AuthResponseFragment
    }
  }
`;
