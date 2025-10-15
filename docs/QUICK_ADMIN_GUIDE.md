# Quick Admin Guide - Creating Verein Users

A step-by-step guide for administrators to create and manage Verein admin users.

## 📋 Before You Start

Ensure the Verein roles have been set up by running:
```bash
bun run setup-verein-roles
```

You should see confirmation that 7 Verein roles were created.

## 🎯 Creating a Verein Admin User

### Step 1: Access Admin Panel
1. Go to your website's admin area: `https://your-domain.com/admin`
2. Log in with Super Admin or Administrator credentials
3. Navigate to **Admin Dashboard** → **Admin-Benutzer**

### Step 2: Create New User
1. Click the **"Neuer Admin"** button (top right)
2. A modal will appear with a form

### Step 3: Fill in User Details

**Username** (Required)
- Choose a descriptive username
- Recommended format: `{verein-shortname}-admin`
- Examples:
  - `sv-wendessen-admin`
  - `feuerwehr-admin`
  - `kleingaertner-admin`

**Role** (Required)
- Select from the dropdown menu
- Available Verein roles:
  - SV Wendessen - Vereinsverwalter
  - Freiwillige Feuerwehr - Vereinsverwalter
  - Jugendfeuerwehr - Vereinsverwalter
  - Kleingärtner-Verein - Vereinsverwalter
  - Kirchbauverein - Vereinsverwalter
  - Initiative Spritzenhaus - Vereinsverwalter
  - Schützenverein - Vereinsverwalter

### Step 4: Save and Get Password
1. Click **"Erstellen"** button
2. A 6-digit temporary password will be displayed
3. **IMPORTANT**: Copy this password immediately - it cannot be retrieved later!

### Step 5: Share Credentials
Send the following to the Verein contact:

```
Wendessen Website - Admin-Zugang

Benutzername: {username}
Temporäres Passwort: {6-digit-code}

Login-URL: https://your-domain.com/admin/login

WICHTIG:
- Sie müssen Ihr Passwort beim ersten Login ändern
- Das neue Passwort muss mindestens 8 Zeichen haben
- Es muss Großbuchstaben, Kleinbuchstaben und Zahlen enthalten
```

## 🔐 Password Requirements

When the user logs in for the first time, they must create a new password with:
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)

Example valid passwords:
- `Wendessen2025`
- `SvWendessen!23`
- `Feuerwehr123`

## 👥 Managing Existing Verein Users

### View All Users
- Go to **Admin Dashboard** → **Admin-Benutzer**
- Verein users will show their role name (e.g., "SV Wendessen - Vereinsverwalter")

### Edit User Permissions
1. Click the **Edit** icon (pencil) next to the user
2. Modal opens showing current role and custom permissions
3. Check/uncheck permissions as needed
4. Click **"Speichern"** to save changes

### Delete User
1. Click the **Delete** icon (trash) next to the user
2. Confirm deletion in the popup
3. User will be immediately removed

**WARNING**: You cannot delete yourself or other Super Admins!

## 🎨 What Can Verein Users Do?

### ✅ They CAN:
- Create events for their Verein
- Edit their Verein's events
- Delete their Verein's events
- Create news articles for their Verein
- Edit their Verein's news
- Delete their Verein's news
- Upload images for their Verein
- Edit their Verein's gallery images
- Delete their Verein's gallery images

### ❌ They CANNOT:
- View or manage other admin users
- Create other admin accounts
- Access system settings
- Manage other Vereine's content
- Approve/reject public submissions
- Delete their own account

## 🛠️ Troubleshooting

### User Can't Log In
1. **Check username**: Verify no typos or extra spaces
2. **Check password**: Ensure they used the 6-digit code on first login
3. **Reset password**: Delete and recreate the user account

### User Says They Don't See Features
1. **Check role assignment**: Verify the correct Verein role is assigned
2. **Check custom permissions**: Ensure no permissions were accidentally removed
3. **Ask them to log out and back in**: Session may need refreshing

### Wrong Verein Role Assigned
1. Click **Edit** icon next to user
2. Change the **Role** dropdown to correct Verein
3. Save changes
4. User should log out and back in

### User Needs Additional Permissions
1. Click **Edit** icon next to user
2. Scroll to **Berechtigungen** section
3. Check additional permissions needed
4. Example: Give `shared_gallery.view` to allow viewing public submissions
5. Save changes

## 📊 Recommended Setup for Each Verein

### Standard Setup (Most Vereine)
- **Number of users**: 1-2 per Verein
- **Role**: Verein-specific role (e.g., `verein_sv-wendessen`)
- **Custom permissions**: None (use defaults)

### Active Vereine (High content volume)
- **Number of users**: 2-3 per Verein
- **Primary contact**: Full Verein role
- **Secondary contacts**: Same Verein role
- **Tip**: Use descriptive usernames (e.g., `sv-wendessen-hauptadmin`, `sv-wendessen-stellvertreter`)

### Special Cases

**Verein needs to see submissions**:
```
Custom permissions to add:
☑ shared_gallery.view
☑ portraits.view
```

**Verein needs broader permissions**:
```
Recommendation: Contact Super Admin to discuss
Alternative: Upgrade to "Redakteur" role
```

## 📝 Checklist for Creating New Verein Admin

- [ ] Verify Verein roles are set up (`bun run setup-verein-roles`)
- [ ] Choose appropriate username
- [ ] Select correct Verein role from dropdown
- [ ] Click "Erstellen" and copy the 6-digit password
- [ ] Send credentials to Verein contact
- [ ] Provide login instructions
- [ ] Explain password requirements
- [ ] Test login works (optional but recommended)
- [ ] Document the user in your records

## 🎓 Training New Verein Admins

### Topics to Cover
1. How to log in at `/admin/login`
2. How to change their password
3. Where to create events (Admin → Termine)
4. Where to create news (Admin → Neuigkeiten)
5. Where to upload gallery images (Admin → Galerie)
6. Password strength requirements
7. Who to contact for help

### Sample Training Email

```
Willkommen bei der Wendessen Website Admin-Oberfläche!

Sie können sich hier anmelden:
https://your-domain.com/admin/login

Benutzername: {username}
Temporäres Passwort: {6-digit-code}

Nach dem ersten Login werden Sie aufgefordert, ein neues Passwort zu erstellen.

Was können Sie tun:
✓ Termine für {Verein} erstellen und verwalten
✓ Neuigkeiten für {Verein} veröffentlichen
✓ Bilder in die Galerie hochladen

Wenn Sie Fragen haben, wenden Sie sich an:
{Admin Contact Email}

Viel Erfolg!
```

## 📞 Support Contact

For issues or questions about Verein user management:
- Check the [Verein Roles Guide](./VEREIN_ROLES.md)
- Review the [Permission Security docs](./PERMISSION_SECURITY.md)
- Contact the technical administrator

---

**Last Updated**: October 15, 2025  
**For**: Super Admins and Administrators  
**Target**: Verein admin user management
