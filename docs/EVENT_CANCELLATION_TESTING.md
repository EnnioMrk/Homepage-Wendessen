# Event Cancellation - Testing Guide

## Setup Complete ✅

All database migrations and permission updates have been successfully applied:

1. ✅ Database columns added (`is_cancelled`, `cancelled_at`, `cancelled_by`)
2. ✅ Permissions created (`events.cancel`, `verein.events.cancel`)
3. ✅ API routes created (`/api/events/[id]/cancel`)
4. ✅ UI components updated (Admin calendar, public calendar, event cards)

## Testing the Feature

### Prerequisites

1. **Start the development server** (if not already running):
   ```bash
   bun dev
   ```

2. **Login as admin user**:
   - Go to `/admin/login`
   - Use your admin credentials

### Test Steps

#### 1. Cancel an Event

1. Navigate to `/admin/events`
2. Click on any event in the calendar
3. Click the **orange "Cancel" button** (ProhibitInset icon)
4. Confirm the cancellation
5. Event should now:
   - Show grey background with line-through
   - Display 🚫 emoji prefix
   - Show "ABGESAGT" badge in modal

#### 2. Restore a Cancelled Event

1. Click on a cancelled event
2. Click the **green "Restore" button** (ArrowCounterClockwise icon)
3. Confirm the restoration
4. Event should return to normal appearance

#### 3. Try to Delete (Permission Test)

1. As an Editor or Verein user, try to delete an event
2. Should see permission error: "Nur Administratoren können Termine dauerhaft löschen"
3. Only Administrators should be able to permanently delete

#### 4. Public View

1. Visit `/was-steht-an` (public calendar)
2. Cancelled events should appear with:
   - Grey background, line-through
   - 🚫 emoji prefix
   - Warning message in details modal

## Troubleshooting

### Error: "Cancel failed with status: 500"

**Possible Causes:**

1. **Not logged in**
   - Solution: Go to `/admin/login` and authenticate

2. **Missing permissions**
   - Solution: Check user has `events.cancel` or `verein.events.cancel` permission
   - Editors should have this automatically
   - Verein users should have this automatically

3. **Database connection issue**
   - Solution: Check `DATABASE_URL` environment variable is set
   - Test connection: `bun run scripts/check-events-table.ts`

4. **Development server not running**
   - Solution: Start with `bun dev`

### Checking Logs

The system now includes detailed logging. Check terminal for:

```
Cancel event request for ID: X
Event found, checking permissions...
User authenticated: admin Role: super_admin
User has permission, cancelling event. User: admin
Cancelling with user identifier: admin
Database: Cancelling event ID: X by user: admin
Database: Update result length: 1
Event cancelled successfully
```

### Manual Database Check

To verify cancellation worked:

```bash
bun run scripts/check-events-table.ts
```

Look for `is_cancelled: true` on events.

## Permission Matrix

| User Role | Can Cancel? | Can Restore? | Can Delete? |
|-----------|-------------|--------------|-------------|
| Super Admin | ✅ | ✅ | ✅ |
| Administrator | ✅ | ✅ | ✅ |
| Editor (Redakteur) | ✅ | ✅ | ❌ |
| Moderator | ❌ | ❌ | ❌ |
| Verein User | ✅ (own) | ✅ (own) | ❌ |

## API Endpoints

### Cancel Event
```
POST /api/events/[id]/cancel
Authorization: Required (events.cancel or verein.events.cancel)
Response: { message, event }
```

### Restore Event
```
DELETE /api/events/[id]/cancel
Authorization: Required (events.cancel or verein.events.cancel)
Response: { message, event }
```

### Delete Event (Permanent)
```
DELETE /api/events/[id]
Authorization: Required (events.delete) - Administrators only
Response: { message }
```

## Known Issues

### Issue: 500 Error on Cancel

**Status**: Fixed with enhanced error handling and logging

**What was done**:
1. Added detailed console logging throughout the cancel flow
2. Added try-catch around permission check
3. Added fallback for username (uses 'admin' if undefined)
4. Improved error messages to include actual error details

**How to verify fix**:
1. Restart dev server: `bun dev`
2. Login as admin
3. Try to cancel an event
4. Check terminal logs for detailed error information

## Next Steps

If you're still experiencing issues:

1. **Clear browser cache** and refresh
2. **Check browser console** (F12) for client-side errors
3. **Check terminal** for server-side error logs
4. **Verify login status** - logout and login again
5. **Check permissions** - run: `bun run scripts/add-cancel-permissions.ts` again

## Success Indicators

✅ Events can be cancelled without errors
✅ Cancelled events show with proper styling
✅ Cancel/restore buttons work correctly
✅ Permission errors are clear and helpful
✅ Public calendar shows cancelled events appropriately
✅ Only admins can permanently delete events

---

**Last Updated**: October 15, 2025
**Status**: Ready for testing
