# PrissPass

## Overview

The PrissPass application now includes a cookie-based session management system that allows users to enter their master password once per session, eliminating the need to re-enter it for every vault operation.

## Features

### Session-Based Access

- **Automatic Session Creation**: When a user logs in or enters their master password for the first time, a session is created
- **Session Duration**: Sessions last for 30 minutes of inactivity
- **Cookie Storage**: Session information is stored securely in HTTP-only cookies
- **Automatic Extension**: Sessions are automatically extended when users perform vault operations

### User Experience Improvements

- **No Repeated Master Password Entry**: Once a session is active, users can add, edit, and view passwords without entering their master password
- **Visual Session Status**: A session status indicator shows when the session is active and time remaining
- **Session Expiration Warning**: Users are warned when their session is about to expire (5 minutes remaining)
- **Graceful Fallback**: If a session expires, users are prompted to enter their master password again

### Security Features

- **Secure Cookies**: Session cookies are HTTP-only, secure, and use strict same-site policy
- **Server-Side Validation**: All session validation happens on the server
- **Automatic Cleanup**: Expired sessions are automatically cleaned up
- **Encryption Key Caching**: User encryption keys are cached securely on the server

## Technical Implementation

### Frontend Components

#### Cookie Utilities (`utils/cookieUtils.js`)

- `getCookie(name)`: Retrieve cookie values
- `setCookie(name, value, options)`: Set cookies with security options
- `deleteCookie(name)`: Remove cookies
- `hasValidSession()`: Check if a valid session exists
- `clearSession()`: Clear all session cookies

#### Session Manager (`utils/sessionManager.js`)

- `checkSessionExpiration()`: Check if current session has expired
- `extendSession()`: Extend the current session
- `getSessionTimeRemaining()`: Get time remaining in current session
- `isSessionExpiringSoon()`: Check if session expires within 5 minutes

#### Session Status Component (`components/SessionStatus/SessionStatus.jsx`)

- Displays current session status
- Shows time remaining
- Warns when session is expiring soon
- Automatically updates every second

### Backend Implementation

#### Authentication Controller

- Creates session ID on login
- Sets secure session cookies
- Returns session information to frontend

#### Vault Controller

- Checks for valid session before requiring master password
- Automatically extends session on successful operations
- Falls back to master password if session is invalid

## Usage

### For Users

1. **Login**: Enter your email and master password to log in
2. **Session Creation**: A session is automatically created and you'll see a green "Session Active" indicator
3. **Vault Operations**: Add, edit, and view passwords without entering master password
4. **Session Monitoring**: Watch the session status indicator for time remaining
5. **Session Expiration**: When session expires, you'll be prompted to enter master password again

### For Developers

#### Checking Session Status

```javascript
import { hasValidSession } from "../utils/cookieUtils";

if (hasValidSession()) {
  // Session is active, no master password needed
} else {
  // Session expired, require master password
}
```

#### Handling Session Expiration

```javascript
import { checkSessionExpiration } from "../utils/sessionManager";

if (checkSessionExpiration()) {
  // Session has expired, redirect to login or show master password modal
}
```

#### Extending Session

```javascript
import { extendSession } from "../utils/sessionManager";

// Call this after successful vault operations
extendSession();
```

## Security Considerations

1. **Cookie Security**: All session cookies use secure, HTTP-only settings
2. **Server-Side Validation**: Session validation happens on the server, not client
3. **Automatic Cleanup**: Expired sessions are automatically removed
4. **Encryption**: User keys are encrypted and cached securely
5. **Fallback Security**: If session fails, master password is still required

## Configuration

### Session Duration

- Default: 30 minutes
- Configurable in backend session cache settings
- Frontend automatically syncs with backend timing

### Cookie Settings

- `HttpOnly`: true (prevents XSS attacks)
- `Secure`: true (HTTPS only)
- `SameSite`: Strict (prevents CSRF attacks)
- `Path`: / (available across the application)

## Troubleshooting

### Common Issues

1. **Session Not Working**: Check if cookies are enabled in browser
2. **Session Expires Too Quickly**: Verify server time settings
3. **Master Password Still Required**: Check if session cookies are being set properly

### Debug Information

- Session status is visible in the bottom-right corner
- Browser developer tools can show cookie values
- Server logs show session creation and validation

## Future Enhancements

1. **Session Renewal**: Allow users to extend sessions manually
2. **Multiple Sessions**: Support for multiple concurrent sessions
3. **Session History**: Track and display session activity
4. **Advanced Security**: Additional session security features
