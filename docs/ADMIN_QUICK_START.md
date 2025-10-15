# Admin User System - Quick Start Guide

## 🎉 What's New

Your admin system has been upgraded! Instead of a single password, you now have:
- **Individual admin accounts** with usernames
- **Automatic password generation** (6-digit initial passwords)
- **Mandatory password change** on first login with strength validation
- **User management interface** in the admin dashboard

## 🚀 Getting Started

### 1. First Login
Use these credentials to log in:
- **Username**: `admin`
- **Password**: `admin123`
- **URL**: `http://localhost:3000/admin/login`

⚠️ **Important**: You'll be prompted to change this password immediately!

### 2. Create Your First Secure Password
When prompted, create a password that meets these requirements:
- ✅ At least 8 characters
- ✅ At least one lowercase letter (a-z)
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one number (0-9)

Example: `Wendessen2025!`

### 3. Access Admin Dashboard
After changing your password, you'll be redirected to the admin dashboard where you can:
- Manage events, news, gallery, and portraits (as before)
- **NEW**: Manage admin users in the "Admin-Benutzer" section

## 👥 Creating New Admin Users

1. Go to **Admin Dashboard** → **Admin-Benutzer** section
2. Click **"Neuer Admin"** button
3. Enter a username (e.g., `max.mustermann`)
4. System generates a **6-digit password** automatically
5. **Share credentials securely** with the new admin
6. New admin must change password on first login

## 📋 Managing Admin Users

In the Admin Users page (`/admin/users`), you can:
- **View all admins** with their creation and last login dates
- **See who needs to change their password** (yellow badge)
- **Delete admin accounts** (except the last one - safety feature!)

## 🔐 Security Features

✅ **Passwords are encrypted** using industry-standard bcrypt hashing  
✅ **Session tokens expire** after 7 days  
✅ **HTTP-only cookies** prevent JavaScript access  
✅ **Cannot delete last admin** to prevent lockout  
✅ **Password strength validation** ensures secure passwords

## 📍 Key URLs

- **Login**: `/admin/login`
- **Change Password**: `/admin/change-password`
- **Dashboard**: `/admin/dashboard`
- **User Management**: `/admin/users`

## 💡 Tips

1. **Use strong, unique passwords** - consider using a password manager
2. **Don't share passwords** - create separate accounts instead
3. **Remove old accounts** - delete admins who no longer need access
4. **Initial passwords are temporary** - they expire on first login
5. **Copy initial passwords** - use the "Copy" button in the success dialog

## 🆘 Troubleshooting

### "Invalid username or password"
- Check that username is spelled correctly (case-sensitive)
- If first login, use the 6-digit initial password
- Ask another admin to verify your account exists

### "Password doesn't meet requirements"
- Ensure all 4 requirements show green checkmarks
- Password must have uppercase, lowercase, numbers
- Must be at least 8 characters long

### "Cannot delete the last admin user"
- This is a safety feature
- Create another admin account first
- Then delete the unwanted account

## 🔄 Migration Notes

If you were using the old system:
- The `ADMIN_PASSWORD` environment variable is no longer used
- All admins are now in the database
- Each admin has their own login credentials
- Old login page updated to require username + password

## 📞 Need Help?

Check the full documentation at: `docs/ADMIN_USER_SYSTEM.md`

---

**Ready to try it?** Open `http://localhost:3000/admin/login` and log in with `admin` / `admin123`! 🎊
