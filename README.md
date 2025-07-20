# PrissPass - Encrypted Password Vault

## Overview

PrissPass is a secure, encrypted password vault web application built with modern technologies. The application features military-grade encryption, session-based authentication, and a smooth user experience that eliminates the need for repeated master password entry.

## 🏗️ Architecture

### Backend (.NET 8.0)

- **Framework**: ASP.NET Core Web API
- **Database**: SQL Server (SSMS) with Entity Framework Core
- **Authentication**: JWT Bearer Tokens + HttpOnly Session Cookies
- **Architecture Pattern**: Clean Architecture with Repository Pattern
- **Caching**: In-Memory Cache for session management

### Frontend (React 19)

- **Framework**: React 19 with Vite build tool
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **UI Components**: Lucide React Icons
- **Notifications**: React Toastify

## 🔐 Security Features

### Encryption Implementation

- **Password Hashing**: PBKDF2 with SHA512 (100,000 iterations)
- **Data Encryption**: AES-256 for vault items
- **Key Derivation**: User-specific keys derived from master password + salt + pepper
- **Salt & Pepper**: Unique salt per user + application-wide pepper
- **Secure Storage**: All sensitive data encrypted at rest

### Authentication & Session Management

- **Dual Authentication**: JWT tokens + HttpOnly session cookies
- **Session Duration**: 30 minutes with automatic extension
- **Secure Cookies**: HttpOnly, Secure, SameSite policies
- **Server-Side Validation**: All session checks on backend
- **Automatic Cleanup**: Expired sessions removed automatically

## 📦 Tech Stack Details

### Backend Dependencies

```xml
<!-- Core Framework -->
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0"/>
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.10"/>

<!-- Database -->
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0"/>
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0"/>
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0"/>

<!-- Security & Caching -->
<PackageReference Include="Isopoh.Cryptography.Argon2" Version="2.0.0"/>
<PackageReference Include="System.Security.Claims" Version="4.3.0"/>
<PackageReference Include="PostSharp.Patterns.Caching.IMemoryCache" Version="2025.1.5"/>

<!-- API Documentation -->
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2"/>
```

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.5.3",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "axios": "^1.9.0",
    "tailwindcss": "^4.1.5",

    "lucide-react": "^0.507.0",
    "react-toastify": "^11.0.5"
  }
}
```

## 🗄️ Database Schema

### Users Table

- `UserId` (Guid, Primary Key)
- `Username` (nvarchar)
- `Email` (nvarchar)
- `MasterPassword` (nvarchar, hashed)
- `PasswordSalt` (nvarchar)

### VaultItems Table

- `VaultId` (Guid, Primary Key)
- `SiteName` (nvarchar, encrypted)
- `EncryptedUrl` (nvarchar, encrypted)
- `EncryptedPassword` (nvarchar, encrypted)
- `EncryptedNotes` (nvarchar, encrypted)
- `UserId` (Guid, Foreign Key)

## 🔄 Development Process

### Project Evolution

#### Phase 1: MVP (May-June)

- **Authentication**: Master password required for every operation
- **Security**: JWT-only authentication
- **UX**: Basic but secure functionality

#### Phase 2: Enhanced UX (July)

- **Session Management**: HttpOnly cookies + session IDs
- **UX Improvement**: Single master password entry per session
- **Security**: Dual authentication (JWT + Session cookies)

### Development Environment

- **IDE**: Visual Studio 2022 / VS Code
- **Database**: SQL Server Management Studio (SSMS)
- **Frontend Dev Server**: Vite (localhost:5173)
- **Backend API**: ASP.NET Core (localhost:5133)
- **Package Manager**: NuGet (Backend) / npm (Frontend)

## 🚀 Features

### Core Functionality

- **Secure Registration/Login**: Email + master password authentication
- **Password Management**: Add, edit, delete, search encrypted passwords
- **Session Management**: 30-minute sessions with automatic extension
- **Real-time Search**: Filter vault items by site name or URL
- **Copy to Clipboard**: One-click password copying
- **Responsive Design**: Mobile-friendly interface

### Security Features

- **Server-Side Encryption**: Secure encryption with user-specific keys
- **Secure Transmission**: HTTPS with secure cookie policies
- **Session Security**: Automatic session cleanup and validation

## 🔧 Configuration

### Environment Variables

```env
# Frontend (.env)
VITE_BACKEND_API_URL=http://localhost:5133

# Backend (appsettings.json)
ConnectionStrings:can't give that bro T_T;
```

### Security Settings

```json
{
  "Jwt": {
    "SecretKey": "your-secret-key",
    "Issuer": "your issuer",
    "Audience": "your audience",
    "ExpiryInMinutes": "450"
  },
  "Encryption": {
    "Key": "your-encryption-key",
    "Pepper": "your-pepper-value"
  }
}
```

## 🛠️ Installation & Setup

### Backend Setup

1. **Database**: Create SQL Server database using SSMS
2. **Migrations**: Run `dotnet ef database update`
3. **Configuration**: Update `appsettings.json` with your connection string
4. **Run**: `dotnet run` in PrissPass.Api directory

### Frontend Setup

1. **Dependencies**: `npm install`
2. **Environment**: Create `.env` file with backend URL
3. **Development**: `npm run dev`
4. **Build**: `npm run build`

## 🔍 API Endpoints

### Authentication

- `POST /api/Auth/Register` - User registration
- `POST /api/Auth/login` - User login
- `POST /api/Auth/logout` - User logout

### Vault Operations

- `GET /api/Vault/GetAll` - Retrieve all vault items
- `POST /api/Vault/AddVaultItem` - Add new password
- `PUT /api/Vault/UpdateVaultItem/{id}` - Update password
- `DELETE /api/Vault/DeleteVaultItem/{id}` - Delete password

## 🧪 Testing Data

The application includes encrypted test data for demonstration purposes. All vault items are encrypted using AES-256 with user-specific keys derived from the master password.

## 🔮 Future Enhancements

### Planned Features

- **Password Strength Meter**: zxcvbn-powered strength analysis
- **CRUD Modals**: Enhanced modal interfaces with skeleton loaders
- **Vault Export/Import**: Backup and restore functionality
- **OAuth 2.0**: Social login integration

### Technical Improvements

- **Performance**: Implement virtual scrolling for large vaults
- **Audit Logging**: Security event tracking

## 🐛 Known Issues & Solutions

### Common Development Issues

1. **CORS Errors**: Ensure backend CORS policy matches frontend origin
2. **Session Expiration**: Check cookie settings and server time
3. **Encryption Errors**: Verify pepper and key configuration
4. **Database Connection**: Confirm SQL Server connection string

### Debug Tips

- **Frontend**: Check browser console for API errors
- **Backend**: Monitor server logs for authentication issues
- **Database**: Use SSMS to verify data encryption
- **Network**: Use browser dev tools to inspect requests

## 📚 Learning Outcomes

### Technical Skills Developed

- **Full-Stack Development**: React + .NET Core integration
- **Security Implementation**: Encryption, authentication, session management
- **Database Design**: Entity Framework with SQL Server
- **State Management**: Redux Toolkit for complex state
- **API Design**: RESTful endpoints with proper error handling

### Development Lessons

- **Patience in Debugging**: Complex security implementations require careful testing
- **Security First**: Always prioritize security over convenience
- **User Experience**: Balance security with usability
- **Code Organization**: Clean architecture improves maintainability

## 🤝 Contributing

This project demonstrates modern web development practices with a focus on security. Feel free to explore the codebase and suggest improvements!

---

**Note**: This application is for educational and demonstration purposes. Always follow security best practices when implementing password management systems in production environments. so if FBI comes to you don't blame me
