# Test Google Login

## GraphQL Mutation for Testing

```graphql
mutation LoginWithGoogle($input: SocialLoginInput!) {
  loginWithGoogle(input: $input) {
    user {
      id
      email
      firstName
      lastName
    }
    accessToken
    refreshToken
  }
}
```

## Variables for Testing

```json
{
  "input": {
    "token": "dummy_google_token_for_testing",
    "provider": "GOOGLE"
  }
}
```

## Expected Error Output

The backend should log detailed information about the Google token verification process and show where exactly the "Bad Request Exception" occurs.

## Steps to Test

1. Open GraphQL Playground at http://localhost:14000/graphql
2. Paste the mutation above
3. Use the variables provided
4. Execute the mutation
5. Check backend logs for detailed error information

## Error Analysis

Based on the logs, we should see:
- Whether GOOGLE_CLIENT_ID is properly loaded
- The exact Google API call being made
- The response from Google's tokeninfo endpoint
- Where in the process the error occurs
