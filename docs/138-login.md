# Authentication System Prompts

## Login Feature Prompt
Create a comprehensive login system that supports multiple authentication methods:
- Email/password login
- Phone number/OTP login
- Google OAuth integration
- Facebook OAuth integration
- Remember me functionality
- Account lockout after failed attempts

## Registration Feature Prompt
Develop a user registration system with the following capabilities:
- Email registration with verification
- Phone number registration with SMS verification
- Google account registration
- Facebook account registration
- Password strength validation
- Terms of service acceptance
- Email/phone uniqueness validation

## Forgot Password Feature Prompt
Implement a password recovery system that includes:
- Password reset via email link
- Password reset via SMS OTP
- Security questions as backup option
- Token expiration handling
- Rate limiting for reset requests
- Account verification before reset

## Multi-Method Authentication Requirements
- Unified user profile linking multiple auth methods
- Social login account merging
- Two-factor authentication support
- Session management across all login types
- Secure token handling and refresh mechanisms
- Cross-platform compatibility (web, mobile)

## Security Considerations
- Implement proper encryption for passwords
- Use secure session tokens
- Add CSRF protection
- Implement rate limiting
- Add input validation and sanitization
- Include audit logging for auth events