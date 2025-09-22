# Portrait Cleanup System

## Overview

The portrait submission system now includes automatic cleanup of old rejected portraits to prevent database bloat and maintain system performance.

## Configuration

- **Maximum Rejected Portraits**: 50 (configurable via `PORTRAIT_CONFIG.MAX_REJECTED_PORTRAITS`)
- **Cleanup Trigger**: Automatic when rejecting a portrait submission
- **Cleanup Strategy**: Delete oldest rejected portraits first (FIFO)

## How It Works

1. **Rejection Process**: When an admin rejects a portrait submission:
   - The portrait status is updated to "rejected"
   - The system checks if the total number of rejected portraits exceeds the limit (50)
   - If exceeded, it automatically deletes the oldest rejected portraits

2. **Cleanup Logic**:
   - Counts current rejected portraits in database
   - If count > `MAX_REJECTED_PORTRAITS`, calculates how many to delete
   - Deletes oldest rejected portraits first (ordered by `reviewed_at` then `submitted_at`)
   - Logs cleanup activity for monitoring

3. **Safety Features**:
   - Only affects portraits with status "rejected"
   - Never deletes approved or pending portraits
   - Cleanup failure doesn't prevent rejection operation
   - Detailed logging for audit purposes

## Files Modified

- `lib/portrait-config.ts` - Configuration constants
- `lib/database.ts` - Added `cleanupOldRejectedPortraits()` function
- `app/api/admin/portraits/route.ts` - Integrated cleanup into rejection logic
- `app/api/portraits/route.ts` - Updated to use config constants
- `scripts/test-portrait-cleanup.ts` - Test script for verification

## Testing

Run the test script to verify functionality:
```bash
bun run scripts/test-portrait-cleanup.ts
```

The system is designed to be maintenance-free and automatically keeps the rejected portraits count within reasonable limits while preserving important submissions (approved and pending).