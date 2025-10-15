# Admin User Management System

## Overview

The admin system has been upgraded from a simple password-based authentication to a comprehensive user management system with individual admin accounts.

## Features

### 1. **User-Based Authentication**
- Each admin has a unique username and password
- Secure password hashing using bcryptjs
- Session-based authentication with HTTP-only cookies

### 2. **Password Security**
- Initial 6-digit randomly generated passwords for new admins
- Mandatory password change on first login
- Password strength requirements:
  - Minimum 8 characters
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number

### 3. **Admin User Management**
- View all admin users
- Create new admin users
- Delete admin users (with safeguard against deleting the last admin)
- Track last login dates
- See which users need to change their passwords

## Database Schema

### `admin_users` Table
```sql
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    must_change_password BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);
```

## Setup

1. **Install Dependencies**
   ```bash
   bun add bcryptjs
   bun add -d @types/bcryptjs
   ```

2. **Create Database Table**
   ```bash
   bun run scripts/setup-admin-users.ts
   ```

3. **Default Admin Account**
   - Username: `admin`
   - Password: `admin123`
   - **IMPORTANT**: Change this password immediately after first login!

## Usage

### Logging In

1. Navigate to `/admin/login`
2. Enter your username and password
3. If it's your first login (or password reset), you'll be redirected to change your password

### Creating New Admin Users

1. Log in to the admin dashboard
2. Navigate to "Admin-Benutzer" section
3. Click "Neuer Admin"
4. Enter a username (letters, numbers, underscores, dashes only)
5. A 6-digit initial password will be generated
6. Share the credentials securely with the new admin
7. The new admin must change their password on first login

### Managing Admin Users

- **View Users**: See all admin users, their creation dates, and last login times
- **Delete Users**: Remove admin accounts (cannot delete the last admin)
- **Password Status**: See which users need to change their passwords

## API Routes

### Authentication
- `POST /api/admin/login` - Authenticate with username and password
- `POST /api/admin/logout` - End current session
- `POST /api/admin/change-password` - Change password (requires authentication)

### User Management
- `GET /api/admin/users` - List all admin users
- `POST /api/admin/users/create` - Create new admin user
- `DELETE /api/admin/users/[id]` - Delete admin user

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
2. **Session Management**: Session tokens expire after 7 days
3. **HTTP-Only Cookies**: Session tokens cannot be accessed via JavaScript
4. **Password Strength Validation**: Enforced on password change
5. **Safeguards**: Cannot delete the last admin user

## Migration from Old System

The old system used a single password stored in environment variables. The new system:
- Removes dependency on `ADMIN_PASSWORD` environment variable
- Stores user credentials securely in the database
- Provides individual accountability through usernames
- Enables proper user lifecycle management

## Files Modified/Created

### Core Authentication
- `lib/auth.ts` - Complete rewrite for user-based authentication
- `middleware.ts` - Updated to allow change-password page

### Database
- `lib/database.ts` - Added admin user management functions
- `scripts/setup-admin-users.ts` - Database setup script

### API Routes
- `app/api/admin/login/route.ts` - Updated for username/password
- `app/api/admin/change-password/route.ts` - New
- `app/api/admin/users/route.ts` - New
- `app/api/admin/users/create/route.ts` - New
- `app/api/admin/users/[id]/route.ts` - New

### UI Components
- `app/admin/login/page.tsx` - Updated for username input
- `app/admin/change-password/page.tsx` - New
- `app/admin/users/page.tsx` - New
- `app/admin/users/AdminUsersClient.tsx` - New
- `app/admin/dashboard/AdminDashboard.tsx` - Added admin users section

## Best Practices

1. **Regular Password Changes**: Encourage admins to change passwords periodically
2. **Strong Passwords**: Use password managers for complex, unique passwords
3. **Revoke Access**: Delete user accounts when admins no longer need access
4. **Monitor Activity**: Check last login dates for suspicious activity
5. **Secure Communication**: Share initial passwords through secure channels

## Troubleshooting

### Cannot Login
- Verify username is correct (case-sensitive)
- Ensure you're using the correct password
- If first login, use the 6-digit initial password provided

### Forgot Password
- Currently no self-service password reset
- Contact another admin to delete your account and create a new one
- Future enhancement: Password reset functionality

### Database Connection Issues
- Verify `DATABASE_URL` environment variable is set
- Check database connection and permissions
- Ensure `admin_users` table exists

## Future Enhancements

Potential improvements for future versions:
- Password reset via email
- Two-factor authentication (2FA)
- Role-based access control (different permission levels)
- Audit logging for admin actions
- Account lockout after failed login attempts
- Password expiration policies
